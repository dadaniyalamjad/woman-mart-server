const Category = require("../model/categoryModel")

module.exports = {
    categoryCreate: async (req, res) => {
        category = new Category(req.body)

        try {
            await category.save()
            res.status(201).send(category)
        }
        catch (err) {
            res.status(400).send(err)
        }
    },

    getCategory: async (req, res) => {
        const category = await Category.find({
            isDelete: false
        })
        try {
            if (category.length > 0) {
                res.status(200).send(category)
            } else {
                res.status(404).json({ message: "No Category in the database" })
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    },

    updateCategory: async (req, res) => {
        let id = req.params.id;
        let category = await Category.findOne({ id: id })
        if (!category) {
            res.status(400).json({
                error: "Category not found"
            })
        } else {
            const updates = Object.keys(req.body)
            const allowUpdates = ["name"]
            const isValidOperator = updates.every((update) => allowUpdates.includes(update))
            if(!isValidOperator) {
                return res.status(400).send({
                    error:"Invalid Updates"
                })
            }

            try {
                updates.forEach((update) => (category[update] = req.body[update]))
                await category.save()
                res.status(200).send(category)
            }
            catch (err) {
                res.status(500).send(err)
            }
        }
    },

    categoryDelete: async (req,res) => {
        let id = req.params.id
        let category = await Category.findOne({id:id});
        category.isDelete =  !category.isDelete

        try {
            await category.save()
            res.status(200).send(category)
        }
        catch (err) {
            res.status(500).send(err)
        }
    }
}