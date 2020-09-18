const mongoose = require('mongoose')
const { v4:uuid4 } = require('uuid')

const brandSchema = new mongoose.Schema(
    {
        id: {
            type:String,
            required:true,
            default: function() {
                return uuid4()
            },
            uuidv4: true,
            index:true
        },
        name: {
            type:String,
            required:true,
            trim:true
        },
        categoryId: {
            type:String,
            required:true,
        },
        isDelete: {
            type:Boolean,
            default:false,
            required:true
        }
    },
    {
        toJSON: {virtuals:true},
        timestamps:true
    }
)

const Brand = mongoose.model("Brand",brandSchema)
module.exports = Brand