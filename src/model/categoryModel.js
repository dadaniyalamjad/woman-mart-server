const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const validator = require('validator')


const categorySchema = new mongoose.Schema(
    {
        id: {
            type:String,
            required:true,
            default: function () {
                return uuidv4();
            },
            uuidv4: true,
            index:true
        },
        name: {
            type:String,
            required:true,
            trim:true
        },
        isDelete: {
            type:Boolean,
            default:false,
            required:true,
        }
    },
    {
        toJSON: {virtuals:true},
        timestamps:true
    }
)

const Category = mongoose.model("Category", categorySchema)

module.exports = Category