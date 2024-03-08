
const express = require('express');
const {User,Admin,Animal} = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET} = require("../middleware/auth")
const {authenticateJwt} = require("../middleware/auth");

const router = express.Router();

router.post('/signup', async(req, res) => {
    const { username, password,name } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        res.status(403).json({ message: "User already exists" });
    } else {
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({ username, password:hashedPassword,name});
        await newUser.save();
        const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
        res.json({ message: "User created", token });
    }
});

// router.post('/login', async(req, res) => {
//     const { username, password } = req.headers;

//     const user = await User.findOne({username,password});
//     if (user) {
//         const passwordMatch = await bcrypt.compare(password, existingUser.password);
//         if(passwordMatch){
//         const token = jwt.sign({username,role:'user'}, SECRET, {expiresIn:'1h'})
//         res.status(400).json({ message: "logged in", token });
//         }
//     }
// })
router.get('/me', authenticateJwt, async (req, res) => {
    try {
        console.log(req);
        if (!req.user) {
            // Handle case where req.user is undefined or does not have username
            res.status(403).json({ message: "User not authenticated" });
            return;
        }

        // Find the admin by username asynchronously
        const user = await User.findOne({ username: req.user.username });

        if (!user) {
            // Handle case where admin with the provided username does not exist
            res.status(403).json({ message: "User not found" });
            return;
        }

        // Send the name of the found admin as JSON response
        res.json({ name: user.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.status(403).json({ message: "Authentication failed" });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(403).json({ message: "Authentication failed" });
            return;
        }

        const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
        res.json({ message: "Logged in", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/pets', authenticateJwt, async(req,res)=>{
    try{
    const animals = await Animal.find({});
    res.json({animals});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/pet/:petId", authenticateJwt, async(req,res)=>{
    try{
    const petId = req.params.petId;
    const pet = await Animal.findById(petId);
    console.log(pet);
    res.json({pet})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"failed"})
    }
})
router.post('/pet/:petId', authenticateJwt, async(req,res)=>{
    try{
    const animal = await Animal.findById(req.params.petId);
    if(animal){
        const user = await User.findOne({username: req.user.username});
        if(user){
            if (user.purchasedCourses.includes(animal._id) ) {
                return res.json({ message: "Already purchased" });
            }
    
            user.purchasedCourses.push(animal._id);
            await user.save();
            res.json({message: "Course purchased"});
        }
        else{
            res.status(403).json({message:"User not found"});
        }
    }
    else{
        res.status(404).json({message: "Course not found"});
    }
}
catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
}
});

router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    try {
        // Find the user by username from the JWT payload and populate the purchasedCourses field
        const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
        
        // Send the user data in the response
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports= router;