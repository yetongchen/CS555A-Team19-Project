import * as pollData from "./data/poll.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { expect } from "chai";

let poll_id;

describe("poll function tests", async () => {
  it("create poll", async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const data = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll",
      description: "this is a new poll",
      options: ["opt1", "opt2", "opt3"],
    };

    const poll = await pollData.create(
      data.org_id,
      data.event_id,
      data.title,
      data.description,
      data.options
    );
    poll_id = poll._id;

    expect(poll.org_id).to.equal("1234567890");
    expect(poll.event_id).to.equal("1234567890");
    expect(poll.title).to.equal("new poll");
    expect(poll.description).to.equal("this is a new poll");
    expect(Array.isArray(poll.options.opt1)).to.equal(true);
    expect(Array.isArray(poll.options.opt2)).to.equal(true);
    expect(Array.isArray(poll.options.opt3)).to.equal(true);
  });

  it("vote", async () => {
    const userId = "userId_000";

    const poll = await pollData.vote(userId, poll_id, "opt1");
    expect(poll.options.opt1[0]).to.equal(userId);
  });

  await db.dropDatabase();
  await db.closeConnection();
});
