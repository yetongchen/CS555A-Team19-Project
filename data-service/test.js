import * as pollData from "./data/poll.js";
import { expect } from "chai";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";

describe("poll function tests", async () => {
  it("Get all", async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const data1 = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll-1",
      description: "this is a new poll-1",
      options: ["opt1", "opt2", "opt3"],
    };

    const data2 = {
      org_id: "0987654321",
      event_id: "0987654321",
      title: "new poll-2",
      description: "this is a new poll-2",
      options: ["opt1", "opt2", "opt3"],
    };

    await pollData.create(
      data1.org_id,
      data1.event_id,
      data1.title,
      data1.description,
      data1.options
    );
    await pollData.create(
      data2.org_id,
      data2.event_id,
      data2.title,
      data2.description,
      data2.options
    );

    const poll = await pollData.getAll();
    const first_poll = poll[0];

    expect(first_poll.org_id).to.equal("1234567890");
    expect(first_poll.event_id).to.equal("1234567890");
    expect(first_poll.title).to.equal("new poll-1");
    expect(first_poll.description).to.equal("this is a new poll-1");
    expect(Array.isArray(first_poll.options.opt1)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt2)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt3)).to.equal(true);

    const second_poll = poll[1];

    expect(second_poll.org_id).to.equal("0987654321");
    expect(second_poll.event_id).to.equal("0987654321");
    expect(second_poll.title).to.equal("new poll-2");
    expect(second_poll.description).to.equal("this is a new poll-2");
    expect(Array.isArray(second_poll.options.opt1)).to.equal(true);
    expect(Array.isArray(second_poll.options.opt2)).to.equal(true);
    expect(Array.isArray(second_poll.options.opt3)).to.equal(true);

    await db.dropDatabase();
    await closeConnection();
  });
});
