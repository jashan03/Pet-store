const express = require('express');
const { User, Admin, Animal } = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET } = require("../middleware/auth");
const { authenticateJwt } = require("../middleware/auth"); // Importing authenticateJwt middleware

const router = express.Router();


router.get('/me', authenticateJwt, async (req, res) => {
    try {
        console.log(req);
        if (!req.user) {
            // Handle case where req.user is undefined or does not have username
            res.status(403).json({ message: "User not authenticated" });
            return;
        }

        // Find the admin by username asynchronously
        const admin = await Admin.findOne({ username: req.user.username });

        if (!admin) {
            // Handle case where admin with the provided username does not exist
            res.status(403).json({ message: "Admin not found" });
            return;
        }

        // Send the name of the found admin as JSON response
        res.json({ name: admin.name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.post('/signup', async(req, res) => {
    const { username, password,name } = req.body;
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
        res.status(403).json({ message: "Admin already exists" });
    } else {
        const hashedPassword = await bcrypt.hash(password,10);
        const newAdmin = new Admin({ name,username, password:hashedPassword });
        await newAdmin.save();
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        res.json({ message: "Admin created", token });
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (passwordMatch) {
            const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
            res.json({ message: "Logged in", token });
        } else {
            res.status(403).json({ message: "Authentication failed" });
        }
    } else {
        res.status(403).json({ message: "Authentication failed" });
    }
});

//needs to be resolved
router.post('/pets', authenticateJwt, async(req, res) => {
try{
    const animal = new Animal(req.body);
    await animal.save();
    // petId is var which stores animal id
    res.json({ message: "Pet created successfully", petId: animal.id });
}
catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
}
    
});


router.get('/pets', authenticateJwt, async (req, res) => {
    try {
        // At this point, if the request has reached here, it means authentication was successful
        const animals = await Animal.find({});
        res.json(animals);
    } catch (error) {
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
// router.put('pet/:petId', authenticateJwt, async(req, res) => {
//     try{
//     const pet = await Animal.findByIdAndUpdate(req.params.petId, req.body, { new: true });
//     if (pet) {
//         res.status(200).json({ message: "Updated",pet });
//     } else {
//         res.status(404).json({ message: "Course doesn't exist" });
//     }
// }
// catch(error){
//     console.log(error);
//     res.status(500).json({message:"failed"})
// }
// });
router.put('/pet/:petId', authenticateJwt, async (req, res) => {
    try {
        const pet = await Animal.findByIdAndUpdate(req.params.petId, req.body, { new: true });
        if (pet) {
            res.status(200).json({ message: "Updated", pet });
        } else {
            res.status(404).json({ message: "Pet doesn't exist" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update pet" });
    }
});

module.exports = router;


