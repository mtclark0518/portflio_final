const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.set('view engine', 'html');
app.use(express.static(__dirname));

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
router.post('/', function(req, res) {
    console.log('coming from the post request');
    console.log(req.body);
    // const mailOptions;
    // const transporter;

    // transporter = nodemailer.createTransport('smtp',{
    // // host: 'smtp.gmail.com',
    // // port: '465',
    // // secure: true,
    // service: 'gmail',
    // auth: {
    //     user: 'mtclark0518@gmail.com',
    //     pass: 'Rustydog'
    // }
    // });
    // mailOptions = {
    // from: 'mtclark0518@gmail.com',
    // to: 'mtclark0518@gmail.com',
    // subject: 'sent from my computer code',
    // text: 'this is a test'
    // };
});





// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('error: ' + error)
//     }
//     console.log('success');
//     console.log(info);
// })



//


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server started on ' + PORT);
});