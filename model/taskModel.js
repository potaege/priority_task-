const db = require('../config/db');

exports.createTask = function (data, callback) {
  const sql = `INSERT INTO tasks (name_task, details, priority) VALUES (?, ?, ?)`;
  db.query(sql, [data.name_task, data.details, data.priority], callback);
};

exports.getAllTasks = async () => {
  const sql = `SELECT * FROM tasks ORDER BY id DESC`;
  
  const [rows] = await db.query(sql);
  return rows;
};

exports.getTasksInProgress = async () => {
  const sql = `
    SELECT * 
    FROM tasks 
    WHERE status = 'in_progress'
    ORDER BY id DESC
  `;

  const [rows] = await db.query(sql);
  return rows;
};

exports.updateTask = async (id, data) => {
  const [result] = await db.query(
    'UPDATE tasks SET name_task = ?, details = ?, priority = ? WHERE id = ?',
    [data.name_task, data.details, data.priority, id]
  );
  return result;
};

exports.createTask = async (data) => {
  const [result] = await db.query(
    'INSERT INTO tasks (name_task, details, priority) VALUES (?, ?, ?)',
    [data.name_task, data.details, data.priority]
  );
  return result;
};

exports.updateTaskStatus = async (id, status) => {
  const [result] = await db.query(
    'UPDATE tasks SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};

exports.getTasksHistory = async () => {
  const sql = `
    SELECT *
    FROM tasks
    WHERE status IN ('done', 'cancel')
    ORDER BY updated_at DESC
  `;

  const [rows] = await db.query(sql);
  return rows;
};