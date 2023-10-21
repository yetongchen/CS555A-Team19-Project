import { post } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

/**
 * @param {String} user_id
 * @param {String} event_id
 * @param {String} firstname
 * @param {String} lastname
 * @param {String} title
 * @param {String} text
 * @param {String} poll_id
 * @param {Array} comments
 * @returns {createPost: true}
 */

const createPost = async (
    user_id,
    event_id,
    firstname,
    lastname,
    title,
    text
) => {
    
}