import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import { rowsToCsv } from "./csv.js";

// Usage: node server/export.js [--week MM/DD/YYYY] [--format json|csv] [--out file] [--pdfs dir]
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const databasePath = process.env.SQLITE_DB_PATH ?? path.join(projectRoot, "server", "data", "intake.sqlite");
const database = new Database(databasePath, { readonly: true, fileMustExist: true });

const week = option("week");
const format = option("format") ?? "json";
const out = option("out");
const pdfDirectory = option("pdfs");

const rows = database
  .prepare(
    `SELECT id, submitted_at, week_date, form_data, pdf_name, pdf_size
     FROM weekly_intake_submissions
     ${week ? "WHERE week_date = ?" : ""}
     ORDER BY id`,
  )
  .all(...(week ? [week] : []))
  .map(({ form_data, ...row }) => ({ ...row, ...JSON.parse(form_data) }));

let output;
if (format === "csv") {
  output = rowsToCsv(rows);
} else {
  output = JSON.stringify(rows, null, 2);
}

if (out) {
  writeFileSync(out, output);
  console.log(`Wrote ${rows.length} submission(s) to ${out}`);
} else {
  console.log(output);
}

if (pdfDirectory) {
  mkdirSync(pdfDirectory, { recursive: true });
  const select = database.prepare("SELECT pdf_name, pdf_data FROM weekly_intake_submissions WHERE id = ?");
  let saved = 0;
  for (const row of rows.filter((entry) => entry.pdf_name)) {
    const { pdf_name, pdf_data } = select.get(row.id);
    writeFileSync(path.join(pdfDirectory, `${row.id}-${pdf_name}`), pdf_data);
    saved++;
  }
  console.log(`Saved ${saved} PDF(s) to ${pdfDirectory}`);
}
