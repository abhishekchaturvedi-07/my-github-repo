
// call user which got set in User model
const User = require('../models/user')
//setup aws to send ses
const AWS = require('aws-sdk')
//JWT
const jwt = require('jsonwebtoken')
// Params Helper
const {registerEmailParams} = require('../helpers/email')

// short ID 
const shortId = require('shortid')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const ses = new AWS.SES({apiVersion: '2010-12-01'})

exports.registerController = (req, res) => {
    // res.json({
    //     data: 'you hit register endpoint middlewaress...'
    // })
    // console.log('Register Controller: ', req.body)
    const { name, email, password } = req.body;


    // Check if user exists in database --> findOne for particular user
    User.findOne({
        email
    }).exec((user, err)=>{
        if(user){
            return res.status(400).json({
                error: 'Email is laready registered'
            })
        }
        // Not exist then generate token with user name email and password
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m'
        })

        // Send Email
        //Helper Params
        const params = registerEmailParams(email,token)

        const sendEmailOnRegister = ses.sendEmail(params).promise();

        sendEmailOnRegister
            .then(data => {
                console.log('email submitted to SES', data);
                res.json({
                    message: `Email has been sent to ${email}, Follow the instructions to complete your registration`
                });
            })
            .catch(error => {
                console.log('ses email on register', error);
                res.json({
                    message: `We could not verify your email. Please try again`
                });
            });


    })
} 

exports.registerActivate = (req, res) => {
    const { token } = req.body;
    // console.log(token);
    
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
    
    // If token expires
        if (err) {
            return res.status(401).json({
                error: 'Expired link. Try again'
            });
        }

        const { name, email, password } = jwt.decode(token);
        const username = shortId.generate();

        User.findOne({ email }).exec((err, user) => {
            // if no user
            if (user) {
                return res.status(401).json({
                    error: 'Email is taken'
                });
            }

            // register new user
            const newUser = new User({ username, name, email, password });
            // save new user
            newUser.save((err, result) => {
                
                if (err) {
                    return res.status(401).json({
                        error: 'Error saving user in database. Try later'
                    });
                }
                return res.json({
                    message: 'Registration success. Please login.'
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    console.table({ email, password });
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please register.'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            });
        }
        // generate token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
};