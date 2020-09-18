const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const { userRole } = require("../constant/roles")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            default: function () {
                return uuidv4()
            },
            index: true,
            uuidv4: true
        },
        firstName: {
            type: String,
            trim: true,
            required: true
        },
        lastName: {
            type: String,
            trim: true,
            required: true
        },
        userName: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        roles: {
            type: String,
            enum: Object.values(userRole),
            default: 'user',
            required: true
        },
        isDelete: {
            type: Boolean,
            default: false,
            required: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

userSchema.statics.findByCredentials = async (value, password) => {
    const user = await User.findOne({
        $or: [{
            email: value,
        }, {
            userName: value,
        }]
    })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Unable to Login")
    }
    return user
}

userSchema.methods.GenerateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "secret")
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

const User = mongoose.model("User", userSchema);
module.exports = User