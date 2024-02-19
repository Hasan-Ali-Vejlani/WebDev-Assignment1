const Users = require("../models/user");
const Tasks = require("../models/Task");
var express = require("express");
var router = express.Router();

router.get('/getMyTasks/:UserId', async (req, res) => {
    try {
      const userId = req.params.UserId;
      const tasks = await Tasks.findAll({ where: { AssignedTo: userId } });
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

/******* below are all the routes that WILL NOT pass through the middleware ********/

router.use((req, res, next) => {
    if (req.user.IsManager === 0) return res.json({ msg: "NOT A MANAGER" })
    else next()
})

/******* below are all the routes that WILL pass through the middleware ********/

router.post('/addTask', async (req, res) => {
    try {
      const { Title, Description, CreatedBy, AssignedTo } = req.body;
      const newTask = await Tasks.create({ Title, Description, CreatedBy, AssignedTo });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.put('/updateTask/:TaskId', async (req, res) => {
    try {
      const taskId = req.params.TaskId;
      const { Title, Description, CreatedBy, AssignedTo, Status } = req.body;
      const task = await Tasks.findByPk(taskId);
      if (!task) {
        return res.status(404).send('Task not found');
      }
      await task.update({ Title, Description, CreatedBy, AssignedTo, Status });
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/deleteTask/:TaskId', async (req, res) => {
    try {
      const taskId = req.params.TaskId;
      const task = await Tasks.findByPk(taskId);
      if (!task) {
        return res.status(404).send('Task not found');
      }
      await task.destroy();
      res.status(204).send(); // No content to return
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.get('/getAllTasks/:UserId', async (req, res) => {
    try {
      const userId = req.params.UserId;
      const tasks = await Tasks.findAll({ where: { CreatedBy: userId } });
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.get('/user_summary', async (_, res) => {
    try {
        const users = await Users.findAll({ attributes: ['UserID', 'FirstName', 'LastName'] });
        const tasks = await Tasks.findAll({ attributes: ['AssignedTo', 'Status'] });

  
      const userSummary = users.map(user => {
      // Filter tasks for the current user
      const userTasks = tasks.filter(task => task.AssignedTo === user.UserID);
      // Count completed tasks for the current user
      const completedTasks = userTasks.filter(task => task.Status === 'Completed').length;

      return {
        firstname: user.FirstName,
        lastname: user.LastName,
        assignedTasks: userTasks.length, // Total number of tasks assigned to the user
        completedTasks: completedTasks, // Total number of completed tasks
      };
    });

  
      res.status(200).json(userSummary);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

module.exports = router
