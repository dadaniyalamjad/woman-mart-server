const User = require("../model/userModel")
const sender = require("../utils/email")
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)

module.exports = {
    userCreate: async (req, res) => {
        user = new User(req.body)
        try {
            await user.save()
            const token = await user.GenerateAuthToken()
            res.status(201).send({ user })
        }
        catch (err) {
            res.status(400).send(err)
        }
    },

    userLogin: async (req, res) => {
        const user = await User.findByCredentials(
            req.body.value,
            req.body.password
        )
        const token = await user.GenerateAuthToken();
        try {
            res.status(200).send({ user })
        }
        catch (err) {
            res.status(400).json({
                error: "Login Failed"
            })
        }
    },

    userLogout: async (req, res) => {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        try {
            await req.user.save()
            res.send()
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    userLogoutAllDevices: async (req, res) => {
        req.user.tokens = []
        try {
            await req.user.save()
            res.send()
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    userUpdate: async (req, res) => {
        let id = req.params.id;
        let checkUserEmail = await User.findOne({
            email: req.body.email
        })

        let checkUserName = await User.findOne({
            userName: req.body.userName
        })

        if (checkUserEmail) {
            if (checkUserEmail.id !== id) {
                return res.status(400).json({
                    error: "Email Already Exists"
                })
            }
        }

        if (checkUserName) {
            if (checkUserName.id !== id) {
                return res.status(400).json({
                    error: "Username already exists"
                })
            }
        }

        let user = await User.findOne({
            id: id
        })

        if (!user) {
            res.status(400).json({
                error: "Record not found"
            })
        }
        else {
            const updates = Object.keys(req.body);
            const allowUpdates = [
                "firstName", "lastName", "userName", "email", "password", "roles",
            ];
            const isValidOperator = updates.every((update) =>
                allowUpdates.includes(update)
            );
            if (!isValidOperator) {
                return res.status(400).send({ error: "Invalid Updates!" });
            }
            try {
                updates.forEach((update) => (user[update] = req.body[update]));
                await user.save()
                res.status(200).send(user)
            }
            catch (err) {
                res.status(500).send(err)
            }
        }
    },

    userProfile: async (req, res) => {
        let id = req.params.id
        let user = await User.findOne({
            id: id
        })

        try {
            res.status(200).send(user)
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    getAllUser: async (req, res) => {
        const users = await User.find({ isDelete: false })
        try {
            if (users.length > 0) {
                res.status(200).send(users)
            }
            else {
                res.status(404).json({ message: "No user in database" })
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    userDelete: async (req, res) => {
        let id = req.params.id
        let user = await User.findOne({
            id: id
        })
        user.isDelete = !user.isDelete
        try {
            await user.save()
            res.status(200).send(user)
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    messageCreate: async (req, res) => {
        try {
            let recevierUserID = req.query.id
            // let id = req.query.id
            const message = req.body.message
            let recvierUser = await User.find({
                id: recevierUserID
            });
            await sender.email_sender(message, recvierUser, "reply_email.ejs");
            res.status(200).send(user)
        }
        catch (err) {
            res.status(400).send(err);
        }
    },

    messageSend: async (req, res) => {
        const message = req.body.message;
        const sendTo = req.body.to;
        client.messages.create({
            body: message,
            from: '+12184323042',
            to: sendTo
        })
            .then(message => console.log("message", message))
            .catch(err => console.log("err", err))
    }
}
