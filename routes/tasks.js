const Users = require("../models/user");
const Tasks = require("../models/Task");
var express = require("express");
var router = express.Router();

router.post("/getByIsbn", async (req, res) => {
    try {
        const Task = await Tasks.findOne({ isbn: req.body.isbn })
        if (!Task) return res.json({ msg: "Task NOT FOUND" })
        res.json({ msg: "Task FOUND", data: Task })
    } catch (error) {
        console.error(error)
    }
});

router.post("/getByIsbnWithUser", async (req, res) => {
    try {
        const Task = await Tasks.findOne({ isbn: req.body.isbn }).populate("user")
        if (!Task) return res.json({ msg: "Task NOT FOUND" })
        res.json({ msg: "Task FOUND", data: Task })
    } catch (error) {
        console.error(error)
    }
});

/******* below are all the routes that WILL NOT pass through the middleware ********/

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})

/******* below are all the routes that WILL pass through the middleware ********/

router.post("/addTask", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (!user) return res.json({ msg: "USER NOT FOUND" })
        await Tasks.create({ ...req.body, user: user._id })
        res.json({ msg: "Task ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/deleteByIsbn", async (req, res) => {
    try {
        const Task = await Tasks.findOne({ isbn: req.body.isbn })
        if (!Task) return res.json({ msg: "Task NOT FOUND" })
        await Tasks.deleteOne({ isbn: req.body.isbn })
        res.json({ msg: "Task DELETED" })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router
