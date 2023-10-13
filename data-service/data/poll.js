import { polls } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

/**
 * @param {String} org_id
 * @param {String} event_id
 * @param {String} title
 * @param {String} description
 * @param {Array} options
 */
const create = async (org_id, event_id, title, description, options) => {
  const newPoll = {
    poll_id: "",
    org_id: "",
    event_id: "",
    title: "",
    description: "",
    options: {},
  };
};

/**
 *
 * @param {String} poll_id
 */
const get = async (poll_id) => {};

const getAll = async () => {};

/**
 *
 * @param {String} event_id
 */
const getByEventId = async (event_id) => {};

/**
 *
 * @param {String} user_id
 * @param {String} poll_id
 * @param {String} option
 */
const vote = async (user_id, poll_id, option) => {};

/**
 * @param {String} org_id
 * @param {String} event_id
 * @param {String} title
 * @param {String} description
 * @param {Array} options
 */
const update = async (org_id, event_id, title, description, options) => {};

/**
 *
 * @param {String} user_id
 * @param {String} poll_id
 * @param {String} option
 */
const remove = async (user_id, poll_id) => {};

export { create, get, getAll, getByEventId, vote, update, remove };
