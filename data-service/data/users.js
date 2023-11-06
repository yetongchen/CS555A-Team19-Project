import { users } from "../config/mongoCollections.js";

export const createUser = async (name, email, _id) => {
  const userCollection = await users();
  let usernameDuplication = await userCollection.findOne({
    email: email,
  });
  if (usernameDuplication !== null) throw "Username already exists";
  const newUser = {
    _id: _id,
    name: name,
    email: email.toLowerCase(),
    posts: [],
    events: []
  };
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (newInsertInformation.acknowledged != true) throw "Insert failed!";
  return await getUserById(newInsertInformation.insertedId);
};

export const getUserById = async (id) => {
  try {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  if (!email) throw 'You must provide an user name to search for';
  if (typeof email !== 'string') throw 'User name must be a string';
  if (email.trim().length === 0)
      throw 'User email cannot be an empty string or just spaces';
  email = email.trim();
  try {
      const userCollection = await users();
      const user = await userCollection.findOne({ email: email.toLowerCase()});
      return user;
  } catch (error) {
      throw error;
  }
};

export const updateUserPatch = async (id,userInfo) => {
  if(!id) throw 'You must provide an id to search for';
  if(typeof id !== 'string' && typeof id !== 'object') 
     throw 'Id must be a string or ObjectId';
  if (id.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  if(userInfo.name){
    if(typeof userInfo.name !== 'string') throw 'Name must be a string';
    if (userInfo.name.trim().length === 0)
      throw 'Name cannot be an empty string or just spaces';
    userInfo.name = userInfo.name.trim();
  }
  if(userInfo.email){
    if(typeof userInfo.email !== 'string') throw 'Email must be a string';
    if (userInfo.email.trim().length === 0)
      throw 'Email cannot be an empty string or just spaces';
    userInfo.email = userInfo.email.trim();
  }
  if(userInfo.posts){
    if(!Array.isArray(userInfo.posts)) throw 'Posts must be an array';
  }
  if(userInfo.events){
    if(!Array.isArray(userInfo.events)) throw 'Events must be an array';
  }
  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      { $set: userInfo },
      {returnDocument: 'after'}
      );
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${id}`;
    return updatedInfo;
  } catch (error) {
    throw error;
  }
};

export const addPostToUser = async (userId, postId) => {
  if(!userId) throw 'You must provide an id to search for';
  if(typeof userId !== 'string' && typeof userId !== 'object') 
     throw 'Id must be a string or ObjectId';
  if (userId.trim().length === 0)
     throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if(!postId) throw 'You must provide an id to search for';
  if(typeof postId !== 'string' && typeof postId !== 'object') 
     throw 'Id must be a string or ObjectId';
  if (postId.trim().length === 0)
     throw 'id cannot be an empty string or just spaces';
  postId = postId.trim();

  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne({_id: userId}, { $push: { posts: postId } });
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${userId}`;
    return updatedInfo;
  }catch (error) {
    throw error;
  }
};

export const addEventToUser = async (userId, eventId) => {
  if(!userId) throw 'You must provide an id to search for';
  if(typeof userId !== 'string' && typeof userId !== 'object') 
     throw 'Id must be a string or ObjectId';
  if (userId.trim().length === 0)
     throw 'id cannot be an empty string or just spaces';
  userId = userId.trim();
  if(!eventId) throw 'You must provide an id to search for';
  if(typeof eventId !== 'string' && typeof eventId !== 'object') 
     throw 'Id must be a string or ObjectId';
  if (eventId.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
  eventId = eventId.trim();

  try {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne({_id: userId}, { $push: { events: eventId } });
    if (!updatedInfo)
      throw `Error: Update failed, could not find a user with id of ${userId}`;
    return updatedInfo;
  }catch (error) {
    throw error;
  }
};