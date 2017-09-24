const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = express.Router();
const nodemailer = require('nodemailer');
const gmailPass = require('./gmail.auth');
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.set('views', 'public');
app.set('view engine', 'html');
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/', function(req, res) {
    console.log('coming from the post request');
    console.log(req.body);

    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mtclark0518@gmail.com',
        pass: gmailPass
    }
    });
    let mailOptions = {
    from: req.body.email,
    to: 'mtclark0518@gmail.com',
    subject: 'contact form submission',
    text: req.body.message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('error: ' + error)
        }
        console.log('success');
        console.log(info);
        res.send(info);
    });
});









//


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server started on ' + PORT);
});