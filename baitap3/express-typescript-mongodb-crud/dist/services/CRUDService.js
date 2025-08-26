"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class CRUDService {
    // Create new user
    static async createNewUser(userData) {
        try {
            const user = new User_1.default(userData);
            return await user.save();
        }
        catch (error) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    // Get all users
    static async getAllUsers() {
        try {
            return await User_1.default.find({}).sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error(`Error fetching users: ${error}`);
        }
    }
    // Get user by ID
    static async getUserById(userId) {
        try {
            return await User_1.default.findById(userId);
        }
        catch (error) {
            throw new Error(`Error fetching user: ${error}`);
        }
    }
    // Update user
    static async updateUserData(userId, userData) {
        try {
            return await User_1.default.findByIdAndUpdate(userId, userData, {
                new: true,
                runValidators: true,
            });
        }
        catch (error) {
            throw new Error(`Error updating user: ${error}`);
        }
    }
    // Delete user
    static async deleteUserById(userId) {
        try {
            return await User_1.default.findByIdAndDelete(userId);
        }
        catch (error) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
}
exports.default = CRUDService;
