import * as Yup from 'yup'
import Products from '../models/Products';

class ProductController {
    async store(req, res) {
        const schemas = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category: Yup.string().required(),
        })

        try {
            schemas.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { filename: path } = req.file;
        const { name, price, category } = req.body

        const product = await Products.create({
            name,
            price,
            category,
            path,
        })


        return res.status(201).json({ product })
    }

    async index(req, res) {
        const products = await Products.findAll()
        return res.json(products)
    }
}


export default new ProductController()