import * as Yup from 'yup'
import Products from '../models/Products';
import Category from '../models/Category'
import User from '../models/User';


class ProductController {
    async store(req, res) {
        const schemas = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        })

        try {
            schemas.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if (!isAdmin) {
            return res.status(401).json()
        }

        const { filename: path } = req.file;
        const { name, price, category_id, offer } = req.body

        const product = await Products.create({
            name,
            price,
            category_id,
            path,
            offer,
        })


        return res.status(201).json({ product })
    }

    async update(req, res) {
        const schemas = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        })

        try {
            schemas.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(req.userId)

        if (!isAdmin) {
            return res.status(401).json()
        }

        const { id } = req.params;

        const findProduct = await Products.findByPk(id)

        if (!findProduct) {
            return res.status(400).json({ error: 'Make sure your product ID is correct' })
        }

        let path;

        if (req.file) {
            path = req.file.filename
        };


        const { name, price, category_id, offer } = req.body

        await Products.update({
            name,
            price,
            category_id,
            path,
            offer,
        }, {
            where: {
                id,
            }
        })


        return res.status(200).json()
    }

    async index(req, res) {

        try {
            const products = await Products.findAll({
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }]
            })
            return res.json(products)

        } catch (err) {
            req.status(400).json({ error: err.error })
        }
    }
}


export default new ProductController()