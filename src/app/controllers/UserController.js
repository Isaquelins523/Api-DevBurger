import { v4 } from 'uuid'

import User from '../models/User'

import * as yup from 'yup'



class UserController {
    async store(req, res) {
        const schemas = yup.object({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
            admin: yup.boolean()

        })

        try {
            schemas.validateSync(req.body, { abortEarly: false })
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { name, email, password, admin } = req.body

        const userExists = await User.findOne({
            where: {
                email,
            }
        })

        if (userExists) {
            return res.status(409).json({ error: 'User already exists' })
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin
        })

        return res.status(201).json({
            id: user.id,
            name,
            email,
            admin
        })
    }
}

export default new UserController()