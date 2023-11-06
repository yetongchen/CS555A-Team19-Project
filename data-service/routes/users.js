import express from "express";
import { createUser, getUserById, updateUserPatch, addEventToUser} from "../data/users.js";
import { users } from "../config/mongoCollections.js";
import postValidation from "../validation/postValidation.js";

const router = express.Router();

//Only for testing
router.get("/", async (req, res) => {
  try {
    let usersCollection = users();

    let data = await usersCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    res.json(error);
  }
});

router.route("/register").post(async (req, res) => {
  try {
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let _id = req.body.uid;
    let result = await createUser(name, email, _id);
    console.log(result);
    res.json(result);
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.json({ Authenticated: "logout" });
});

router.route("/:userId")
.get(async (req, res) => {
  try {
    const userInfo = await getUserById(req.params.userId);
    console.log(userInfo);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json(err);
  }
})
.patch(async (req, res) => {
  let userInfo = req.body;
  if (!userInfo || Object.keys(userInfo).length === 0) {
    return res
      .status(400)
      .json({error: 'There are no fields in the request body'});
  }
  try{
    req.params.userId = req.params.userId.trim();
      if(req.params.userId.length === 0) throw 'Id cannot be an empty string or just spaces';
      if(typeof req.params.userId !== 'string' && typeof req.params.userId !== 'object') 
        throw 'Id must be a string or ObjectId';
      if(userInfo.name){
        if(typeof userInfo.name !== 'string') throw 'Name must be a string';
        if (userInfo.name.trim().length === 0)
          throw 'Name cannot be an empty string or just spaces';
        userInfo.name = userInfo.name.trim();
      }
       const updatedUser = await updateUserPatch(req.params.userId, userInfo);
       res.json(updatedUser);
    } catch (e) {
      res.status(400).json({ error: e });
    }
});


router.route("/addEventToUser/:userId/:eventId").post(async (req, res) => {
  let { userId, eventId } = req.params;
  try {
    userId = postValidation.checkString(userId);
    eventId = postValidation.checkString(eventId);
  } catch (e) {
    return res.status(400).json({ error: e.toString() });
  }

  try {
    let updateInfo = await addEventToUser(userId, eventId);
    res.status(200).json({ message: 'Joined the event successfully', updateInfo });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default router;