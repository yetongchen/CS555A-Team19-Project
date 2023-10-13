import { polls } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

/**
 * @param {String} org_id
 * @param {String} event_id
 * @param {String} user_id
 * @param {String} poll_id
 * @param {String} title
 * @param {String} description
 * @param {String} option
 * @param {Array} options
 */

const create = async (org_id, event_id, title, description, options) => {};

const vote = async (user_id, poll_id, option) => {};

const update = async (org_id, event_id, title, description, options) => {};

const remove = async (user_id, poll_id) => {};
