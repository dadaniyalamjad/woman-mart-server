const Brand = require("../model/brandModel")

module.exports = {
    brandCreate: async(req,res) => {
        brand = new Brand(req.body)

        try {
            await brand.save()
            res.status(200).send(brand)
        }
        catch(err) {
            res.status(400).send(err)
        }
    },
    getBrand: async(req,res) => {
        const brand = await Brand.find({
            isDelete: false
        });
        try {
            if (brand.length > 0) {
                res.status(200).send(brand)
            } else {
                res.status(404).json({ message: "No Brand in the database" })
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    },
    updateBrand: async(req,res) => {
        let id = req.params.id
        let brand = await Brand.findOne({
            id:id,
            isDelete:false
        })

        if(!brand) {
            res.status(400).json({
                error:"Brand not found"
            })
        }
        else {
            const updates = Object.keys(req.body)
            const allowUpdates = ["name"]
            const isValidOperator = updates.every((update) => allowUpdates.includes(update))
            if (!isValidOperator) {
                return res.status(400).send({
                    error: "Invalid Updates"
                })
            }

            try {
                updates.forEach((update) => (brand[update] = req.body[update]))
                await brand.save()
                res.status(200).send(brand)
            }
            catch (err) {
                res.status(500).send(err)
            }
        }
    },

    deleteBrand: async(req,res) => {
        let id = req.params.id
        let brand = await Brand.findOne({
            id:id,
            isDelete:false
        })
        brand.isDelete = !brand.isDelete
        try {
            await brand.save()
            res.status(200).send(brand)
        }
        catch(err) {
            res.status(500).send(err)
        }
    }
}