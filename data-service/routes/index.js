//import users from "./users.js";
import postRoute from "./postRoute.js";

const constructorMethod = (app) => {
  //app.use('/user', users);
  app.use("/post", postRoute);

  app.use("*", (req, res) => {
    res.render("error", {
      errorMsg: "Page Not Found",
      login: false,
    });
  });
};

export default constructorMethod;
