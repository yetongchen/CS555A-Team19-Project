import users from "./users.js";

const constructorMethod = (app) => {

    app.use('/user', users);

    app.use('*', (req, res) => {
        res.render('error', {
            errorMsg: "Page Not Found",
            login: false
        })
    });
};

export default constructorMethod;