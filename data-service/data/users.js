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
    email: email,
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