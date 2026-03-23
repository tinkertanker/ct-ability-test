const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const { db, verifyPassword, createUniqueJoinCode, createEventWithQuestions } = require("./db");
const { sanitizeQuestion } = require("./questionBank");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "ct-quest-dev-secret";
const webDir = path.resolve(__dirname, "../../web");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(webDir));

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

function normalizeJoinCode(rawCode) {
  return String(rawCode || "").trim().toUpperCase();
}

function parseOptionalDate(value, fieldName) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} is not a valid date/time.`);
  }

  return date.toISOString();
}

function getEventWithQuestionsByJoinCode(joinCode) {
  const event = db.prepare(`
    SELECT id, title, join_code, status, selection_mode, duration_minutes, start_at, end_at
    FROM events
    WHERE join_code = ?
  `).get(joinCode);

  if (!event) {
    return null;
  }

  const questions = db.prepare(`
    SELECT question_json
    FROM event_questions
    WHERE event_id = ?
    ORDER BY question_order ASC
  `).all(event.id).map(row => sanitizeQuestion(JSON.parse(row.question_json)));

  return { ...event, questions };
}

function ensureEventAccessible(event) {
  const now = Date.now();

  if (!event) {
    return "That join code does not match any active test.";
  }

  if (event.status !== "active") {
    return "This event is not active right now.";
  }

  if (event.start_at && now < Date.parse(event.start_at)) {
    return "This test has not opened yet.";
  }

  if (event.end_at && now > Date.parse(event.end_at)) {
    return "This test is already closed.";
  }

  return null;
}

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = db.prepare(`
    SELECT id, email, password_hash, role
    FROM users
    WHERE email = ?
  `).get(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }

  res.json({
    token: createToken(user),
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.prepare(`
    SELECT id, email, role
    FROM users
    WHERE id = ?
  `).get(req.user.sub);

  res.json({ user });
});

app.get("/api/events", requireAuth, (req, res) => {
  const events = db.prepare(`
    SELECT e.id, e.title, e.join_code, e.status, e.selection_mode, e.duration_minutes, e.start_at, e.end_at, e.created_at,
           COUNT(a.id) AS attempt_count
    FROM events e
    LEFT JOIN attempts a ON a.event_id = e.id
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `).all();

  res.json({ events });
});

app.post("/api/events", requireAuth, (req, res) => {
  const title = String(req.body.title || "").trim();
  const selectionMode = String(req.body.selectionMode || "ALL").trim().toUpperCase();
  const durationMinutes = req.body.durationMinutes ? Number(req.body.durationMinutes) : null;
  const joinCode = normalizeJoinCode(req.body.joinCode) || createUniqueJoinCode();

  if (!title) {
    res.status(400).json({ error: "Event title is required." });
    return;
  }

  if (!["ALL", "P5", "P6", "S1", "S2"].includes(selectionMode)) {
    res.status(400).json({ error: "Unsupported selection mode." });
    return;
  }

  if (durationMinutes !== null && (!Number.isFinite(durationMinutes) || durationMinutes <= 0)) {
    res.status(400).json({ error: "Duration must be a positive number of minutes." });
    return;
  }

  try {
    const startAt = parseOptionalDate(req.body.startAt, "Start time");
    const endAt = parseOptionalDate(req.body.endAt, "Deadline");

    if (startAt && endAt && Date.parse(startAt) >= Date.parse(endAt)) {
      res.status(400).json({ error: "Deadline must be later than the start time." });
      return;
    }

    const eventId = createEventWithQuestions({
      title,
      joinCode,
      selectionMode,
      durationMinutes,
      startAt,
      endAt,
      createdBy: req.user.sub
    });

    const event = db.prepare(`
      SELECT id, title, join_code, status, selection_mode, duration_minutes, start_at, end_at, created_at
      FROM events
      WHERE id = ?
    `).get(eventId);

    res.status(201).json({ event });
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      res.status(409).json({ error: "That join code is already in use." });
      return;
    }

    res.status(400).json({ error: error.message || "Could not create event." });
  }
});

app.post("/api/events/join", (req, res) => {
  const joinCode = normalizeJoinCode(req.body.joinCode);
  const event = getEventWithQuestionsByJoinCode(joinCode);
  const accessibilityError = ensureEventAccessible(event);

  if (accessibilityError) {
    res.status(404).json({ error: accessibilityError });
    return;
  }

  res.json({
    event: {
      id: event.id,
      title: event.title,
      joinCode: event.join_code,
      durationMinutes: event.duration_minutes,
      startAt: event.start_at,
      endAt: event.end_at
    },
    questionCount: event.questions.length
  });
});

app.post("/api/attempts", (req, res) => {
  const joinCode = normalizeJoinCode(req.body.joinCode);
  const studentName = String(req.body.studentName || "").trim();
  const studentGroup = String(req.body.studentGroup || "").trim();
  const event = getEventWithQuestionsByJoinCode(joinCode);
  const accessibilityError = ensureEventAccessible(event);

  if (accessibilityError) {
    res.status(404).json({ error: accessibilityError });
    return;
  }

  if (!studentName || !studentGroup) {
    res.status(400).json({ error: "Student name and class/group are required." });
    return;
  }

  const result = db.prepare(`
    INSERT INTO attempts (event_id, student_name, student_group, status, started_at)
    VALUES (?, ?, ?, 'started', ?)
  `).run(event.id, studentName, studentGroup, new Date().toISOString());

  res.status(201).json({
    attempt: {
      id: Number(result.lastInsertRowid),
      eventId: event.id,
      studentName,
      studentGroup
    },
    event: {
      id: event.id,
      title: event.title,
      joinCode: event.join_code,
      durationMinutes: event.duration_minutes,
      startAt: event.start_at,
      endAt: event.end_at
    },
    questions: event.questions
  });
});

app.post("/api/attempts/:id/submit", (req, res) => {
  const attemptId = Number(req.params.id);
  const answers = req.body.answers || {};
  const attempt = db.prepare(`
    SELECT a.id, a.event_id, a.student_name, a.student_group, a.status, a.started_at, e.title, e.join_code, e.duration_minutes
    FROM attempts a
    JOIN events e ON e.id = a.event_id
    WHERE a.id = ?
  `).get(attemptId);

  if (!attempt) {
    res.status(404).json({ error: "Attempt not found." });
    return;
  }

  if (attempt.status === "submitted") {
    res.status(409).json({ error: "This attempt has already been submitted." });
    return;
  }

  if (attempt.duration_minutes) {
    const startedAtMs = Date.parse(attempt.started_at);
    const deadlineMs = startedAtMs + attempt.duration_minutes * 60 * 1000;

    if (Date.now() > deadlineMs) {
      res.status(410).json({ error: "The time limit for this attempt has expired." });
      return;
    }
  }

  const eventQuestions = db.prepare(`
    SELECT question_json, question_order
    FROM event_questions
    WHERE event_id = ?
    ORDER BY question_order ASC
  `).all(attempt.event_id).map(row => JSON.parse(row.question_json));

  let score = 0;
  let maxScore = 0;

  const clearAnswers = db.prepare("DELETE FROM answers WHERE attempt_id = ?");
  const insertAnswer = db.prepare(`
    INSERT INTO answers (attempt_id, question_id, chosen_index, correct_index, earned_points, max_points)
    VALUES (@attempt_id, @question_id, @chosen_index, @correct_index, @earned_points, @max_points)
  `);
  const finalizeAttempt = db.prepare(`
    UPDATE attempts
    SET status = 'submitted', submitted_at = ?, score = ?, max_score = ?
    WHERE id = ?
  `);

  const perQuestion = [];

  const transaction = db.transaction(() => {
    clearAnswers.run(attemptId);

    eventQuestions.forEach(question => {
      const chosen = Number.isInteger(answers[question.id]) ? answers[question.id] : null;
      const correct = chosen === question.answerIndex;
      const earnedPoints = correct ? question.points : 0;

      score += earnedPoints;
      maxScore += question.points;

      insertAnswer.run({
        attempt_id: attemptId,
        question_id: question.id,
        chosen_index: chosen,
        correct_index: question.answerIndex,
        earned_points: earnedPoints,
        max_points: question.points
      });

      perQuestion.push({
        id: question.id,
        title: question.title,
        level: question.level,
        topic: question.topic,
        qType: question.qType,
        chosen,
        correctIndex: question.answerIndex,
        earned: earnedPoints,
        max: question.points
      });
    });

    finalizeAttempt.run(new Date().toISOString(), score, maxScore, attemptId);
  });

  transaction();

  res.json({
    attempt: {
      id: attempt.id,
      studentName: attempt.student_name,
      studentGroup: attempt.student_group,
      startedAt: attempt.started_at
    },
    event: {
      title: attempt.title,
      joinCode: attempt.join_code,
      durationMinutes: attempt.duration_minutes
    },
    result: {
      score,
      max: maxScore,
      perQuestion
    }
  });
});

app.get("/api/events/:id/results", requireAuth, (req, res) => {
  const eventId = Number(req.params.id);
  const event = db.prepare(`
    SELECT id, title, join_code, status, selection_mode, duration_minutes, start_at, end_at, created_at
    FROM events
    WHERE id = ?
  `).get(eventId);

  if (!event) {
    res.status(404).json({ error: "Event not found." });
    return;
  }

  const attempts = db.prepare(`
    SELECT id, student_name, student_group, status, started_at, submitted_at, score, max_score
    FROM attempts
    WHERE event_id = ?
    ORDER BY started_at DESC
  `).all(eventId);

  const answersByAttempt = db.prepare(`
    SELECT attempt_id, question_id, chosen_index, correct_index, earned_points, max_points
    FROM answers
    WHERE attempt_id IN (
      SELECT id FROM attempts WHERE event_id = ?
    )
    ORDER BY attempt_id ASC, id ASC
  `).all(eventId).reduce((acc, row) => {
    if (!acc[row.attempt_id]) {
      acc[row.attempt_id] = [];
    }

    acc[row.attempt_id].push({
      questionId: row.question_id,
      chosenIndex: row.chosen_index,
      correctIndex: row.correct_index,
      earnedPoints: row.earned_points,
      maxPoints: row.max_points
    });

    return acc;
  }, {});

  res.json({
    event,
    attempts: attempts.map(attempt => ({
      ...attempt,
      answers: answersByAttempt[attempt.id] || []
    }))
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(webDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`CT Quest server running on http://localhost:${PORT}`);
});
