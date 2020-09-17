const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./src/db/mongoose');
const categoryRoutes = require('./src/routes/category')


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


app.listen(port, () => {
    console.log('app listening on port ' + port);
});