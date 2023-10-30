import users from "./users.js";
import postRoute from "./postRoute.js";
import eventIDs from "./eventIDs.js";

const constructorMethod = (app) => {
  app.use("/users", users);
  app.use("/post", postRoute);
  app.use("/eventIDs", eventIDs);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
