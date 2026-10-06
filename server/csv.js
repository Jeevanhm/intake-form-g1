import path from "node:path";
import { mkdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";

export const rowsToCsv = (rows) => {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns.join(","), ...rows.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
};

const pad = (value) => String(value).padStart(2, "0");

// Weeks run Monday to Sunday and are named after their Monday.
export const weekStart = (date) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`;
};

// Uses the review date entered on the form (MM/DD/YYYY); falls back to the submission time.
export const weekKeyFor = (weekDate, submittedAt) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(weekDate ?? "").trim());
  if (match) {
    const date = new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2]));
    if (date.getMonth() === Number(match[1]) - 1 && date.getDate() === Number(match[2])) return weekStart(date);
  }
  const submitted = new Date(`${submittedAt.replace(" ", "T")}Z`);
  return weekStart(Number.isNaN(submitted.getTime()) ? new Date() : submitted);
};

// The latest entry per application name for one week, oldest first. When an application name is
// submitted again in the same week, only the latest entry is kept.
export const getWeekRows = (database, weekKey) => {
  const latestByName = new Map();
  const rows = database
    .prepare(`SELECT id, submitted_at, week_date, form_data,
        (SELECT group_concat(name, ' | ') FROM submission_files WHERE submission_id = weekly_intake_submissions.id) AS pdf_name,
        (SELECT sum(size) FROM submission_files WHERE submission_id = weekly_intake_submissions.id) AS pdf_size
       FROM weekly_intake_submissions ORDER BY id`)
    .all()
    .filter((row) => weekKeyFor(row.week_date, row.submitted_at) === weekKey)
    .map(({ form_data, ...row }) => ({ ...row, ...JSON.parse(form_data) }));

  rows.forEach((row, index) => {
    const name = String(row.appName ?? "").trim().toLowerCase();
    latestByName.set(name === "" ? `\0${index}` : name, row);
  });

  return [...latestByName.values()].sort((a, b) => a.id - b.id);
};

export const listWeeks = (database) => {
  const keys = new Set(
    database
      .prepare("SELECT submitted_at, week_date FROM weekly_intake_submissions")
      .all()
      .map((row) => weekKeyFor(row.week_date, row.submitted_at)),
  );
  return [...keys]
    .sort()
    .reverse()
    .map((week) => ({ week, count: getWeekRows(database, week).length }));
};

// Rebuilds one week's CSV from the database, which is the source of truth. Everything here is
// synchronous, so concurrent submissions are applied one after another and each rewrite includes
// every row committed so far; the temp file + rename keeps readers from seeing a half-written file.
export const writeWeeklyCsv = (database, directory, weekKey) => {
  const rows = getWeekRows(database, weekKey);
  mkdirSync(directory, { recursive: true });
  const target = path.join(directory, `intake-week-${weekKey}.csv`);
  const temporary = `${target}.${process.pid}.tmp`;
  try {
    writeFileSync(temporary, rowsToCsv(rows));
    renameSync(temporary, target);
  } catch (error) {
    try { unlinkSync(temporary); } catch { /* nothing to clean up */ }
    throw error;
  }
  return target;
};
