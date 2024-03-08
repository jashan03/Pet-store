const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type:String,
            required: true},
    username: {type:String,
                require: true},
    password: String,
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Animal'
    }]
});

const adminSchema = new mongoose.Schema({
    name: {type:String,
        required: true},
    username: String,
    password: String
});
const animalSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
})

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Animal = mongoose.model('Animal', animalSchema);

module.exports = {
    User,
    Admin,
    Animal
}