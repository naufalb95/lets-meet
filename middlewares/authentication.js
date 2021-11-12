const { verify } = require('../helpers/jwt')
const { User } = require('../models')

const authentication = async (req, res, next) => {
    
    const token = req.headers.access_token 

    try {
        const payload = verify(token)
        const foundUser = await User.findOne({
            where: {
                id: payload.id,
                email: payload.email
            }
        })
        if (!foundUser) {
            throw new Error ("User not found")
        }
        req.user = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
        }
        next()
    } catch (err) {
        if (err.message === "User not found") {
            res.status(401).json( { msg: "Invalid JWT Token" } )
        } else {
            res.status(401).json( { msg: "Something Wicked Happened" } )
        }
    }
}

module.exports = authentication