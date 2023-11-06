import { createUser, addPostToUser, addEventToUser } from '../data/users.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

(async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  let user1 = null;

  // Create User Test
  try {
    user1 = await createUser(
      "Cong Guo",
      "test1@gmail.com", 
      "643477cd9042a9c9256c5ac5"
    );
    console.log("create user1 successfully", user1);
  } catch (e) {
    console.error('Failed to create user:', e);
  }

  const postId = "6545871a4fe1f1f1d524b364";
  // Add Post to User Test
  try {
    const addPostToUserResult = await addPostToUser(user1._id, postId);
    console.log("Post added to user successfully", addPostToUserResult);
  } catch (e) {
    console.error('Failed to add post to user:', e);
  }

  const eventId = "716620239427";
  // Add Event to User Test
  try {
    const addEventToUserResult = await addEventToUser(user1._id, eventId);
    console.log("Event added to user successfully", addEventToUserResult);
  } catch (e) {
    console.error('Failed to add event to user:', e);
  }

  await closeConnection();
})();
