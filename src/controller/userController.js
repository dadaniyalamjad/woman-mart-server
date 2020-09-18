const User = require("../model/userModel")

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
    }
}
