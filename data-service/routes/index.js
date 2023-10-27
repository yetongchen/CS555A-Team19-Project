import users from "./users.js";
import postRoute from "./postRoute.js";

const constructorMethod = (app) => {
  app.use('/users', users);
  app.use("/post", postRoute);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

export default constructorMethod;
