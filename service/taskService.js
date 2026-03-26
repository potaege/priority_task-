const taskModel = require('../model/taskModel');

exports.createTask = (req, res) => {
  const { name_task, details, priority } = req.body;

  if (!name_task || !priority) {
    return res.status(400).json({
      message: 'name_task and priority are required'
    });
  }

  const taskData = {
    name_task,
    details: details || null,
    priority
  };

  taskService.createTask(taskData, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'create task failed',
        error: err
      });
    }

    res.json({
      message: 'task created successfully',
      id: result.insertId
    });
  });
};

exports.getAllTasks = async () => {

  const data = await taskModel.getAllTasks();

  return data

};

exports.getTaskTable = async (req, res) => {

  const data = await taskModel.getTasksInProgress();

  const result = {
    high: [],
    medium: [],
    low: []
  };

  data.forEach(item => {
    if (result[item.priority]) {
      result[item.priority].push(item);
    }
  });

  res.json(result);

};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { name_task, details, priority } = req.body;
  taskModel.updateTask(id, { name_task, details, priority }).then(() => {
    res.json({ message: 'task updated' });
  });
};

exports.createTask = (req, res) => {
  const { name_task, details, priority } = req.body;
  if (!name_task || !priority) {
    return res.status(400).json({ message: 'name_task and priority are required' });
  }
  taskModel.createTask({ name_task, details, priority }).then(() => {
    res.json({ message: 'task created' });
  });
};

exports.updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  taskModel.updateTaskStatus(id, status).then(() => {
    res.json({ message: 'status updated' });
  });
};

exports.getTasksHistory = async (req, res) => {

  const result = await taskModel.getTasksHistory();

  res.json(result);

};