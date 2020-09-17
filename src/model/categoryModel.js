const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

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

categorySchema.virtual("Brand", {
    ref: "Brand",
    localField: "id",
    foreignField: "categoryId"
})

const Category = mongoose.model("Category", categorySchema)

module.exports = Category