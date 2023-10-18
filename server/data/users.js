const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const validation = require('./validation');



const exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'No users in database.';
    return userList;
  },



  async getUserById(user_id) {
    validation.checkString(user_id, 'User ID');
    const userCollection = await users();
    const user = await userCollection.findOne({ user_id: user_id });
    if (!user) throw 'User not found.';
    return user;
  },



  async getUserByEmail(email) {
    email = validation.checkEmail(email, 'Email');
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });
    if (!user) throw 'User not found.';
    return user;
  },




  async addUser(user_id, first_name, last_name, email, event_ids = [], emails = []) {
    validation.checkString(user_id, 'User ID');
    first_name = validation.checkString(first_name, 'First Name');
    last_name = validation.checkString(last_name, 'Last Name');
    email = validation.checkEmail(email, 'Email');
    event_ids = validation.checkStringArray(event_ids, 'Event IDs');
    emails = validation.checkStringArray(emails, 'Emails');

    const userCollection = await users();
    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) {
      throw 'User with this email already exists!';
    }

    const newUser = {
      user_id: user_id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      event_ids: event_ids,
      emails: emails
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) {
      throw 'Could not add user!';
    }
    return newUser;
  },





  async updateUser(user_id, updatedInfo) {
    validation.checkString(user_id, 'User ID');
    const userCollection = await users();

    let userUpdates = {};

    if (updatedInfo.first_name) {
      userUpdates.first_name = validation.checkString(updatedInfo.first_name, "First Name");
    }

    if (updatedInfo.last_name) {
      userUpdates.last_name = validation.checkString(updatedInfo.last_name, "Last Name");
    }

    if (updatedInfo.email) {
      userUpdates.email = validation.checkEmail(updatedInfo.email, "Email");
    }

    if (updatedInfo.event_ids) {
      userUpdates.event_ids = validation.checkStringArray(updatedInfo.event_ids, "Event IDs");
    }

    if (updatedInfo.emails) {
      userUpdates.emails = validation.checkStringArray(updatedInfo.emails, "Emails");
    }

    const updatedUserData = await userCollection.updateOne(
      { user_id: user_id },
      { $set: userUpdates }
    );

    if (updatedUserData.matchedCount === 0) {
      throw 'Error updating user';
    }

    return await this.getUserById(user_id);
  }
};

module.exports = exportedMethods;
