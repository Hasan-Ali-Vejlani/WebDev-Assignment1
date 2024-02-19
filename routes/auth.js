const bcrypt = require("bcrypt");
const Users = require("../models/user");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")

function validateSignupData(firstName, lastName, email, password) {
    const errors = [];
  
    if (firstName.length < 3 || lastName.length < 3) {
      errors.push({ field: 'name', message: 'Name must be at least 3 characters long' });
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' });
    }
  
    return errors;
  }
  
  router.post('/signup', async (req, res) => {
    try {
        const { FirstName, LastName, DOB, IsManager, Email, Password } = req.body;
  
      // Validate data
      const validationErrors = validateSignupData(FirstName, LastName, Email, Password);
      if (validationErrors.length > 0) {
        res.status(400).json({ errors: validationErrors });
        return;
      }
  
      // Hash the password for security
      const hashedPassword = await bcrypt.hash(Password, 10);
  
      // Create the new user
      const newUser = await Users.create({
        FirstName,
        LastName,
        DOB,
        IsManager,
        Email,
        Password: hashedPassword
      });
  
      // Send successful response with the created user
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ errors: [{ message: 'Email already exists' }] });
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  });

router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body

        const user = await Users.findOne({ Email })
        if (!user) return res.json({ msg: "USER NOT FOUND" })

        const passwordCheck = await bcrypt.compare(Password, user.Password);
        if (!passwordCheck) return res.json({ msg: "WRONG PASSWORD" })

        const token = jwt.sign({
            Email,
            createdAt: new Date(),
            admin: user.admin,
        }, "MY_SECRET", { expiresIn: "1d" });

        res.json({
            msg: "LOGGED IN", token
        })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router
