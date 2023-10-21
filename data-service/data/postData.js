import { posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from '../validation/postValidation.js';

/**
 * @param {String} user_id
 * @param {String} event_id
 * @param {String} firstname
 * @param {String} lastname
 * @param {String} datetime
 * @param {String} title
 * @param {String} text
 * @param {String} poll_id
 * @param {Array} comments
 * @returns post Object
 */

const createPost = async (
    user_id,
    event_id,
    firstname,
    lastname,
    title,
    text
) => {
    //validation
    user_id = validation.checkStringObjectID(user_id);
    //event_id = validation.checkStringObjectID(event_id);
    firstname = validation.checkFirstname(firstname);
    lastname = validation.checkLastname(lastname);
    title = validation.checkTitle(title);
    text = validation.checkText(text);
    
    let datetime = new Date();
    datetime = datetime.toUTCString();

    const postData = {
        user_id: user_id,
        event_id: event_id,
        firstname: firstname,
        lastname: lastname,
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
    // postData._id = postData._id.toString();
    // const insertuser = await userdb.putPostIn(postData._id, user_id);
    // if (!insertuser) {
    //     throw "post_id insert in user error";
    // }

    const newPost = await getPostByPostId(postInfo.insertedId.toString());

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
    const post = postCollection.findOne({_id: new ObjectId(post_id)});
    if (!post) {
        throw "This post does not exist."
    }

    const deleteInfo = await postCollection.deleteOne({_id: new ObjectId(post_id)});
    if (deleteInfo.deletedCount === 0) {
        throw `Could not delete post with id of ${post_id}`;
    }
    
    //remove post from user collection
    // const removeInfo = await userdb.removeCommentFromU(commentid, userid);
    // if (!(removeInfo && removeInfo2)) 
    //     throw `could not remove comment correctlly`;
    
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

const exportedMethods = {
    createPost,
    removePostByPostId,
    //updatePost,
    getPostByPostId,
    getPostByEventId,
    //getPostByUserId
};

export default exportedMethods;