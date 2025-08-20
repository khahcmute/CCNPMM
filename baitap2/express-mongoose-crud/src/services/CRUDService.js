const User = require('../models/user');

// Create user
let createNewUser = async (data) => {
    try {
        const user = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
        });
        
        let result = await user.save();
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get all users
let getAllUser = async () => {
    try {
        let users = await User.find({});
        return users;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Get user by ID
let getUserInfoById = async (userId) => {
    try {
        let user = await User.findById(userId);
        if (user) {
            return user;
        }
        return {};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Update user
let updateUserData = async (data) => {
    try {
        let user = await User.findByIdAndUpdate(
            data.id,
            {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            },
            { new: true, runValidators: true }
        );
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Delete user
let deleteUserById = async (userId) => {
    try {
        let user = await User.findByIdAndDelete(userId);
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById
};