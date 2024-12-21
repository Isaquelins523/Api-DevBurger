import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

export default function authMiddleware(request, response, next) {

    const authToken = request.headers.authorization;

    if (!authToken) {

        return response.status(401).json({ error: 'Token not provid'})
    }

    const token = authToken.split(' ').at(1)
    

    try {

        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if (err) {
                throw new Error();
            }

            request.userId = decoded.id
            request.userName = decoded.name

        })

    } catch (err) {
        console.error(err)
        return response.status(401).json({ error: 'Token is invalid' })
    }

    return next();
}