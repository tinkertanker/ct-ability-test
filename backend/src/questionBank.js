const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadQuestionBank() {
  const filePath = path.resolve(__dirname, "../../web/questions.js");
  const code = fs.readFileSync(filePath, "utf8");
  const sandbox = { window: {} };

  vm.runInNewContext(code, sandbox, { filename: filePath });

  if (!Array.isArray(sandbox.window.QUESTION_BANK)) {
    throw new Error("Could not load QUESTION_BANK from web/questions.js");
  }

  return JSON.parse(JSON.stringify(sandbox.window.QUESTION_BANK));
}

function sanitizeQuestion(question) {
  const { answerIndex, ...safeQuestion } = question;
  return safeQuestion;
}

module.exports = {
  loadQuestionBank,
  sanitizeQuestion
};
