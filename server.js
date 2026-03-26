const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const taskService = require('./service/taskService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/page', express.static(path.join(__dirname, 'page')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'page', 'main.html'));
});

app.post('/tasks', taskService.createTask);
app.get('/tasks', taskService.getAllTasks);
app.get('/tasks/table', taskService.getTaskTable);
app.put('/tasks/edit/:id', taskService.updateTask);
app.post('/tasks/add', taskService.createTask);
app.patch('/tasks/status/:id', taskService.updateTaskStatus);
app.get('/tasks/history', taskService.getTasksHistory);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});