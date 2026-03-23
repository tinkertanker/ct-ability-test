const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");
const { loadQuestionBank } = require("./questionBank");

const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "app.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function nowIso() {
  return new Date().toISOString();
}

function hashPassword(password) {
  return crypto.scryptSync(password, "ct-quest-salt", 64).toString("hex");
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function generateJoinCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'teacher',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      join_code TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'active',
      selection_mode TEXT NOT NULL DEFAULT 'ALL',
      duration_minutes INTEGER,
      start_at TEXT,
      end_at TEXT,
      created_by INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS event_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      question_order INTEGER NOT NULL,
      question_json TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      student_group TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'started',
      started_at TEXT NOT NULL,
      submitted_at TEXT,
      score INTEGER,
      max_score INTEGER,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      chosen_index INTEGER,
      correct_index INTEGER NOT NULL,
      earned_points INTEGER NOT NULL,
      max_points INTEGER NOT NULL,
      FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE
    );
  `);
}

function getQuestionsForMode(selectionMode) {
  const bank = loadQuestionBank();

  if (!selectionMode || selectionMode === "ALL") {
    return bank;
  }

  return bank.filter(question => question.level === selectionMode);
}

function createEventWithQuestions({
  title,
  joinCode,
  selectionMode = "ALL",
  durationMinutes = null,
  startAt = null,
  endAt = null,
  createdBy
}) {
  const questions = getQuestionsForMode(selectionMode);

  if (!questions.length) {
    throw new Error(`No questions available for selection mode "${selectionMode}"`);
  }

  const insertEvent = db.prepare(`
    INSERT INTO events (title, join_code, status, selection_mode, duration_minutes, start_at, end_at, created_by, created_at)
    VALUES (@title, @join_code, 'active', @selection_mode, @duration_minutes, @start_at, @end_at, @created_by, @created_at)
  `);

  const insertQuestion = db.prepare(`
    INSERT INTO event_questions (event_id, question_id, question_order, question_json)
    VALUES (@event_id, @question_id, @question_order, @question_json)
  `);

  const transaction = db.transaction(payload => {
    const eventResult = insertEvent.run({
      title: payload.title,
      join_code: payload.joinCode,
      selection_mode: payload.selectionMode,
      duration_minutes: payload.durationMinutes,
      start_at: payload.startAt,
      end_at: payload.endAt,
      created_by: payload.createdBy,
      created_at: nowIso()
    });

    questions.forEach((question, index) => {
      insertQuestion.run({
        event_id: eventResult.lastInsertRowid,
        question_id: question.id,
        question_order: index,
        question_json: JSON.stringify(question)
      });
    });

    return Number(eventResult.lastInsertRowid);
  });

  return transaction({
    title,
    joinCode,
    selectionMode,
    durationMinutes,
    startAt,
    endAt,
    createdBy
  });
}

function seed() {
  const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;

  if (userCount === 0) {
    db.prepare(`
      INSERT INTO users (email, password_hash, role, created_at)
      VALUES (?, ?, 'teacher', ?)
    `).run("teacher@ctquest.local", hashPassword("changeme123"), nowIso());
  }

  const eventCount = db.prepare("SELECT COUNT(*) AS count FROM events").get().count;

  if (eventCount === 0) {
    const teacher = db.prepare("SELECT id FROM users WHERE email = ?").get("teacher@ctquest.local");

    createEventWithQuestions({
      title: "CT Quest Demo Event",
      joinCode: "DEMO123",
      selectionMode: "ALL",
      durationMinutes: 45,
      createdBy: teacher.id
    });
  }
}

function createUniqueJoinCode() {
  let code = generateJoinCode();

  while (db.prepare("SELECT 1 FROM events WHERE join_code = ?").get(code)) {
    code = generateJoinCode();
  }

  return code;
}

createSchema();
seed();

module.exports = {
  db,
  hashPassword,
  verifyPassword,
  createUniqueJoinCode,
  createEventWithQuestions
};
