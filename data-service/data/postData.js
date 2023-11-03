import { posts } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from '../validation/postValidation.js';

/**
 * @param {String} user_id
 * @param {String} event_id
 * @param {String} name
 * @param {String} title
 * @param {String} text
 * @returns post Object
 */

const createPost = async (
    user_id,
    event_id,
    name,
    title,
    text
) => {
    //validation
    user_id = validation.checkString(user_id);
    const userCollection = await users();
    let user_exist = await userCollection.findOne({_id: user_id});
    if (!user_exist) throw "The user does not exist";

    event_id = validation.checkString(event_id); //more validation
    name = validation.checkUsername(name);
    title = validation.checkTitle(title);
    text = validation.checkText(text);
    
    let datetime = new Date();
    datetime = datetime.toUTCString();

    const postData = {
        user_id: user_id,
        event_id: event_id,
        name: name,
        datetime: datetime,
        title: title,
        text: text,
        poll_id: null,
        comments: [],
    };

    const postCollection = await posts();
    const postInfo = await postCollection.insertOne(postData);
    if (!postInfo.acknowledged || !postInfo.insertedId) {
        throw "Could not add this post";
    }

    //save post_id in the user collection
    postInfo.insertedId = postInfo.insertedId.toString();
    if (!user_exist.posts) throw "user object do not have posts array";
    user_exist.posts.push(postInfo.insertedId);
    const userInfo = await userCollection.updateOne({_id: user_id},
        {$set : {posts: user_exist.posts}});
    console.log("save post id to user: ", userInfo);
    if (!userInfo.acknowledged) {
        throw "Could not add post_id in user object";
    }
    
    const newPost = await getPostByPostId(postInfo.insertedId);

    return newPost;
}

/**
 * @param {String} post_id
 * @returns {deletePost: true}
 */
const removePostByPostId = async (
    post_id
) => {
    post_id = validation.checkStringObjectID(post_id);

    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(post_id)});
    if (!post) {
        throw "This post does not exist."
    }
    console.log("post to be deleted: ", post)

    let user_id = validation.checkString(post.user_id);
    const userCollection = await users();
    let user_exist = await userCollection.findOne({_id: user_id});
    if (!user_exist) throw "The user dose not exist";
    if (!user_exist.posts) throw "user object do not have posts array";
    if (!user_exist.posts.includes(post_id)) throw "The user do not have a post with this post_id";

    const deleteInfo = await postCollection.deleteOne({_id: new ObjectId(post_id)});
    if (deleteInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${post_id}`;
    }
    
    //remove post from user collection
    const index = user_exist.posts.indexOf(post_id);
    if (index > -1) { // only splice array when item is found
        user_exist.posts.splice(index, 1); // 2nd parameter means remove one item only
    }
    const removeInfo = await userCollection.updateOne({_id: user_id},
        {$set : {posts: user_exist.posts}});
    console.log("remove user id from user: ", removeInfo);

    if (!(removeInfo && deleteInfo)) 
        throw `could not remove post correctlly`;
    
    return {deletePost: true};
}

/**
 * @param {String} post_id
 * @returns post Object
 */
const getPostByPostId = async (
    post_id
) => {
    //validadtion
    post_id = validation.checkStringObjectID(post_id);

    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(post_id)});
    if (!post)
        throw `can not find post with id of ${post_id}`; 

    post._id = post._id.toString();
    return post;
}

/**
 * @param {String} event_id
 * @returns array of post Object
 */
const getPostByEventId = async (
    event_id
) => {
    //validadtion
    //event_id = validation.checkStringObjectID(event_id);

    const postCollection = await posts();
    const postByEventId = await postCollection.find({event_id: event_id}).toArray();
    if (!postByEventId)
        throw `can not find post of event with id of ${event_id}`; 

    return postByEventId;
}

/**
 * @param {String} user_id
 * @returns array of post Object
 */
const getPostByUserId = async (
    user_id
) => {
    //validadtion
    user_id = validation.checkStringObjectID(user_id);

    const postCollection = await posts();
    const postByUserId = await postCollection.find({user_id: user_id}).toArray();
    if (!postByUserId)
        throw `can not find post of user with id of ${user_id}`; 

    return postByUserId;
}

const exportedMethods = {
    createPost,
    removePostByPostId,
    //updatePost,
    getPostByPostId,
    getPostByEventId,
    getPostByUserId
};

export default exportedMethods;