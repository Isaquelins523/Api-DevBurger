import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionCOntroller {
    async store(req, res) {
        const schemas = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        })

        const isValid = await schemas.isValid(req.body)

        const emailOrPasswordIncorrect = () => {
            res.status(401).json({ error: 'Make sure your email or pessword are correct' })
        }

        if (!isValid) {
            return emailOrPasswordIncorrect()
        }

        const { email, password } = req.body

        const user = await User.findOne({
            where: {
                email,
            }
        })

        if (!user) {
            return emailOrPasswordIncorrect()
        }

        const isSamePassword = await user.comparePassword(password)

        if (!isSamePassword) {
            return emailOrPasswordIncorrect()
        }

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            token: jwt.sign({ id: user.id, name: user.name}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            })
        })
    }
}

export default new SessionCOntroller()