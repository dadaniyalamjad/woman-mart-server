const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./src/db/mongoose');
const categoryRoutes = require('./src/routes/category')
const brandRoutes = require('./src/routes/brand')
const userRoutes = require('./src/routes/user')
var UAParser = require('ua-parser-js');

const port = 8080;

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

app.get("/", async (req, res) => {
    var parser = new UAParser();
    var ua = req.headers['user-agent'];
    var browserName = parser.setUA(ua).getBrowser().name;
    console.log("brwoserName", browserName)
});

app.listen(port, () => {
    console.log('app listening on port ' + port);
});