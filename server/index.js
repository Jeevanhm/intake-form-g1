import Database from "better-sqlite3";
import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import { weekKeyFor, writeWeeklyCsv } from "./csv.js";
import { createAdminAuth } from "./auth.js";

try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // .env is optional; ADMIN_PASSWORD can also come from the real environment.
}

const PORT = Number(process.env.API_PORT ?? 3001);
const HOST = process.env.API_HOST ?? "127.0.0.1";
const BASE_PATH = (process.env.APP_BASE_PATH ?? "").replace(/\/+$/, "");
const routePath = (route) => `${BASE_PATH}${route}`;
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_APPLICATIONS = 20;
const MAX_FILES_PER_APPLICATION = 10;
const MAX_FILES = MAX_APPLICATIONS * MAX_FILES_PER_APPLICATION;
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const databasePath = process.env.SQLITE_DB_PATH ?? path.join(projectRoot, "server", "data", "intake.sqlite");
mkdirSync(path.dirname(databasePath), { recursive: true });

const csvDirectory = process.env.CSV_DIR ?? path.join(projectRoot, "csv-exports");

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS weekly_intake_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    week_date TEXT NOT NULL,
    form_data TEXT NOT NULL,
    pdf_name TEXT,
    pdf_data BLOB,
    pdf_size INTEGER
  );
  CREATE TABLE IF NOT EXISTS submission_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL REFERENCES weekly_intake_submissions(id),
    name TEXT NOT NULL,
    data BLOB NOT NULL,
    size INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS submission_files_submission ON submission_files(submission_id);
`);

// Move PDFs stored by earlier versions (one per submission) into the files table.
database.transaction(() => {
  database.exec(`
    INSERT INTO submission_files (submission_id, name, data, size)
    SELECT id, pdf_name, pdf_data, COALESCE(pdf_size, length(pdf_data))
    FROM weekly_intake_submissions WHERE pdf_data IS NOT NULL AND pdf_name IS NOT NULL;
    UPDATE weekly_intake_submissions SET pdf_data = NULL WHERE pdf_data IS NOT NULL;
  `);
})();

const insertSubmission = database.prepare(`
  INSERT INTO weekly_intake_submissions (week_date, form_data)
  VALUES (@weekDate, @formData)
`);
const insertFile = database.prepare(`
  INSERT INTO submission_files (submission_id, name, data, size) VALUES (@submissionId, @name, @data, @size)
`);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES, files: MAX_FILES, fields: 1, fieldSize: 256 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== "application/pdf" && !file.originalname.toLowerCase().endsWith(".pdf")) {
      callback(new Error("Choose a PDF file."));
      return;
    }
    callback(null, true);
  },
});

const app = express();
app.use(express.json({ limit: "1kb" }));

const adminAuth = createAdminAuth(process.env.ADMIN_PASSWORD);
app.post(routePath("/api/admin/login"), adminAuth.login);
app.get(routePath("/api/admin/status"), adminAuth.status);

app.post(routePath("/api/submissions"), upload.array("pdf", MAX_FILES), (request, response) => {
  let submissions;
  try {
    submissions = JSON.parse(request.body.submission);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    response.status(400).json({ error: "The submission data is invalid." });
    return;
  }

  if (!Array.isArray(submissions) || submissions.length < 1 || submissions.length > MAX_APPLICATIONS) {
    response.status(400).json({ error: `Submit between 1 and ${MAX_APPLICATIONS} applications at a time.` });
    return;
  }

  const files = request.files;
  const pdfIndexes = new Set();
  const validSubmissions = submissions.every((submission) => {
    if (
      !submission ||
      typeof submission !== "object" ||
      Array.isArray(submission) ||
      typeof submission.weekDate !== "string" ||
      !submission.formData ||
      typeof submission.formData !== "object" ||
      Array.isArray(submission.formData) ||
      !Array.isArray(submission.pdfIndexes) ||
      submission.pdfIndexes.length > MAX_FILES_PER_APPLICATION
    ) {
      return false;
    }

    for (const index of submission.pdfIndexes) {
      if (!Number.isInteger(index) || index < 0 || index >= files.length || pdfIndexes.has(index)) return false;
      pdfIndexes.add(index);
    }
    return true;
  });

  if (!validSubmissions || pdfIndexes.size !== files.length) {
    response.status(400).json({ error: "The submission data is invalid." });
    return;
  }

  if (files.some((pdf) => !pdf.buffer.subarray(0, 5).equals(Buffer.from("%PDF-")))) {
    response.status(400).json({ error: "An uploaded file is not a valid PDF." });
    return;
  }

  const insertBatch = database.transaction((entries) =>
    entries.map((submission) => {
      const result = insertSubmission.run({
        weekDate: submission.weekDate,
        formData: JSON.stringify({ ...submission.formData, weekDate: submission.weekDate }),
      });
      const submissionId = Number(result.lastInsertRowid);
      for (const index of submission.pdfIndexes) {
        const pdf = files[index];
        insertFile.run({
          submissionId,
          name: path.basename(pdf.originalname.replaceAll("\\", "/")),
          data: pdf.buffer,
          size: pdf.size,
        });
      }
      return submissionId;
    }),
  );

  const ids = insertBatch.immediate(submissions);
  try {
    const weeks = new Set(
      submissions.map((submission) => weekKeyFor(submission.weekDate, new Date().toISOString().replace("T", " "))),
    );
    weeks.forEach((week) => writeWeeklyCsv(database, csvDirectory, week));
  } catch (error) {
    // The submission is already saved; the next submission regenerates the file.
    console.error("Could not update the daily CSV:", error);
  }
  response.status(201).json({ ids });
});

const parseId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id >= 1 ? id : null;
};

app.get(routePath("/api/submissions/:id/pdfs"), adminAuth.requireAdmin, (request, response) => {
  const id = parseId(request.params.id);
  if (id === null) {
    response.status(400).json({ error: "The submission ID is invalid." });
    return;
  }
  response.json({
    files: database.prepare("SELECT id, name, size FROM submission_files WHERE submission_id = ? ORDER BY id").all(id),
  });
});

app.get(routePath("/api/submissions/:id/pdfs/:fileId"), adminAuth.requireAdmin, (request, response) => {
  const id = parseId(request.params.id);
  const fileId = parseId(request.params.fileId);
  if (id === null || fileId === null) {
    response.status(400).json({ error: "The file ID is invalid." });
    return;
  }

  const pdf = database
    .prepare("SELECT name, data FROM submission_files WHERE id = ? AND submission_id = ?")
    .get(fileId, id);
  if (!pdf) {
    response.status(404).json({ error: "No PDF was found for this submission." });
    return;
  }

  const safeName = encodeURIComponent(pdf.name).replaceAll("'", "%27");
  response
    .type("application/pdf")
    .set("Content-Disposition", `attachment; filename*=UTF-8''${safeName}`)
    .send(pdf.data);
});

app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    response.status(413).json({ error: "The PDF must be 10 MB or smaller." });
    return;
  }
  if (error instanceof multer.MulterError || error.message === "Choose a PDF file.") {
    response.status(400).json({ error: error.message });
    return;
  }

  console.error("Request failed:", error);
  response.status(500).json({ error: "The server could not process the submission." });
});

const distDirectory = path.join(projectRoot, "dist");
if (BASE_PATH) {
  // Express matches BASE_PATH with or without a trailing slash, so only redirect the bare path.
  app.get(BASE_PATH, (request, response, next) => {
    if (request.path.endsWith("/")) {
      next();
      return;
    }
    response.redirect(302, `${BASE_PATH}/`);
  });
  app.get("/", (_request, response) => response.redirect(302, `${BASE_PATH}/`));
}
app.use(BASE_PATH || "/", express.static(distDirectory));
app.get(routePath("/{*splat}"), (_request, response, next) => {
  response.sendFile(path.join(distDirectory, "index.html"), (error) => {
    if (error) next(error);
  });
});

app.listen(PORT, HOST, (error) => {
  // Express 5 passes startup errors (such as EADDRINUSE) to this callback.
  if (error) throw error;
  console.log(`Intake API listening at http://${HOST}:${PORT}`);
  console.log(`SQLite database: ${databasePath}`);
});
