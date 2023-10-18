const express = require('express');
const app = express();
const configRoutes = require('./routes');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
var path = require('path');
const { decodeToken } = require('./middleware');

const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(cors());


app.use(session({
  name: 'AuthCookie',
  resave: false,
  secret: "Secret",
  saveUninitialized: true
})
);


var public = path.join(__dirname, '/public');
app.use("/public", express.static(public));


app.use('/services', decodeToken);
app.use('/login', decodeToken);
app.use('/signup', decodeToken);


configRoutes(app);

app.listen(port, ()=>{
  console.log(`We've now got a server! on port ${port}`);
});