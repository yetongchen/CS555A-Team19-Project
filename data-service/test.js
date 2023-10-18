import * as polls from "./data/poll.js";
import { expect } from "chai";

describe("poll function tests", async () => {
  it("create poll", async () => {
    before(async () => {
      // runs before all tests in this file regardless where this line is defined.
      const data = {
        org_id: "1234567890",
        event_id: "1234567890",
        title: "new poll",
        description: "this is a new poll",
        options: ["opt1", "opt2", "opt3"],
      };

      const poll = await polls.create(
        data.org_id,
        data.event_id,
        data.title,
        data.description,
        data.options
      );
    });

    const poll = await polls.getAll();
    const first_poll = poll[0];

    expect(first_poll.org_id).to.equal("1234567890");
    expect(first_poll.event_id).to.equal("1234567890");
    expect(first_poll.title).to.equal("new poll");
    expect(first_poll.description).to.equal("this is a new poll");
    expect(Array.isArray(first_poll.options.opt1)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt2)).to.equal(true);
    expect(Array.isArray(first_poll.options.opt3)).to.equal(true);
  });

  it("vote", async () => {
    const data = {
      org_id: "1234567890",
      event_id: "1234567890",
      title: "new poll",
      description: "this is a new poll",
      options: ["opt1", "opt2", "opt3"],
    };

    let poll = await polls.create(
      data.org_id,
      data.event_id,
      data.title,
      data.description,
      data.options
    );

    expect(poll.org_id).to.equal("1234567890");
    expect(poll.event_id).to.equal("1234567890");
    expect(poll.title).to.equal("new poll");
    expect(poll.description).to.equal("this is a new poll");
    expect(Array.isArray(poll.options.opt1)).to.equal(true);
    expect(Array.isArray(poll.options.opt2)).to.equal(true);
    expect(Array.isArray(poll.options.opt3)).to.equal(true);
  });
});