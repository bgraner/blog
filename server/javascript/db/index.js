const User = require('./models/user');
const Entry = require('./models/entry');
const ScoreCard = require('./models/scorecard');
const Category = require('./models/category');
const Task = require('./models/task');
const Checklist = require('./models/checklist');
const ChecklistScore = require('./models/checklist_score'); // TODO: undo snakecase?
const ChecklistQuestion = require('./models/checklist_question'); // TODO: undo snakecase?

module.exports = {
  User,
  Entry,
  ScoreCard,
  Category,
  Task,
  Checklist,
  ChecklistScore,
  ChecklistQuestion
};
