const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const configRoutes = require('./routes');
const { decodeToken } = require('./middleware');


const app = express();
const port = 4000;


app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

app.use(cors());


app.use(session({
  name: 'AuthCookie',
  resave: false,
  secret: "Secret",  
  saveUninitialized: true
}));


const publicDir = path.join(__dirname, '/public');
app.use("/public", express.static(publicDir));


app.use('/login', decodeToken);
app.use('/signup', decodeToken);


configRoutes(app);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
