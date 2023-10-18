const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const validation = require('../data/validation');
const bcrypt = require('bcrypt');



router.post('/login', async (req,res) => {
    const login = req.body;
    try {
        console.log("Login endpoint.");
        let { email, password } = login;
        email = validation.checkString(email, 'Username');
        password = validation.checkPassword(password, 'Password');
        let user;
        try {
            user = await userData.getUserByEmail(email);
        } catch (e) {
            e.message = 'User not found.';
            return res.status(404).json({ error: e });
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
            return res.status(404).json({ error: 'Invalid credentials.' });
        } else {
            res.status(200).json(user);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});




router.post('/signup', async (req,res) => {
    const user = req.body;
    try {
        console.log("Signup endpoint.");
        let { email, phone, password, firstName, lastName, userType } = user;
        firstName = validation.checkString(firstName, 'First Name');
        lastName = validation.checkString(lastName, 'Last Name');
        email = validation.checkString(email, 'Username');
        password = validation.checkPassword(password, 'Password');
        const newUser = await userData.addUser(email, phone, password, firstName, lastName, userType);
        if (!newUser.userCreated) {
            return res.status(404).json({ error: 'Failed to add user.' });
        }
        res.status(200).json(newUser.createdUser);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e });
    }
});



router.get('/logout', async (req,res) => {
    try {
        req.session.email = undefined;
        res.status(200).json("Logout success.");
    } catch (e) {
        return res.status(500).json({error: e});
    }
});



router.get('/users/:email', async (req,res) => {
    try {
        let email = req.params.email;
        email = validation.checkEmail(email);
        let user = await userData.getUserByEmail(email);
        return res.status(200).json(user)
    } catch (e) {
        res.status(500).json({error: "WHAT?"});
    }
});



module.exports = router;