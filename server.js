const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./src/db/mongoose');
const categoryRoutes = require('./src/routes/category')
const brandRoutes = require('./src/routes/brand')
const userRoutes = require('./src/routes/user')
require('dotenv').config();

const port = 8080;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)

client.messages.create({
    body: "This is a text message!",
    from: '+12184323042',
    to: '+923352815651'
})
    .then(message => console.log("message", message))
    .catch(err => console.log("err", err))



app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());
app.use(express.json());

app.use(categoryRoutes);
app.use(brandRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log('app listening on port ' + port);
});