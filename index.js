// Import required modules
const express = require('express');
const fs = require('fs');

const PORT = process.env.PORT || 3000; // Define port number
const app = express(); // Create an instance of Express

app.use(express.json()); // Middleware to parse JSON bodies

// Create a write stream to a log file
const logStream = fs.createWriteStream('app.log', { flags: 'a' });

// Redirect console.log() output to the log file
console.log = function(message) {
  logStream.write(`${new Date().toISOString()} ${message}\n`);
};

// Define a route
app.get('/', (req, res) => {
  console.log("Hello, world!..");
  res.send('Hello, world!');
});

// Mock data for tasks
let tasks = [
  { id: 1, description: 'Task 1', completed: false },
  { id: 2, description: 'Task 2', completed: true }
];

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// GET a single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(task => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send('Task not found');
  res.json(task);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const task = {
    id: tasks.length + 1,
    description: req.body.description,
    completed: false
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT (update) a task
app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find(task => task.id === parseInt(req.params.id));
  if (!task) return res.status(404).send('Task not found');

  task.description = req.body.description || task.description;
  task.completed = req.body.completed || task.completed;

  res.json(task);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex(task => task.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Task not found');

  tasks.splice(index, 1);
  res.send('Task deleted');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});