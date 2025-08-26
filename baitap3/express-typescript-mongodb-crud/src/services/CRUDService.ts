import User, { IUser } from "../models/User";

class CRUDService {
  // Create new user
  static async createNewUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  // Get all users
  static async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  // Update user
  static async updateUserData(
    userId: string,
    userData: { firstName?: string; lastName?: string; email?: string }
  ): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(userId, userData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  // Delete user
  static async deleteUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}

export default CRUDService;
