const { verify } = require('../helpers/jwt')
const { User } = require('../models')

const authentication = async (req, res, next) => {
    console.log(req.originalUrl);
    const token = req.headers.access_token 

    try {
        const payload = verify(token)
        const foundUser = await User.findOne({
            where: {
                id: payload.id,
                email: payload.email
            }
        })
        req.user = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
        }
        next()
    } catch (err) {
        console.log(err.message);
        if(err.message === "invalid signature") {
            res.status(401).json( { message: "Invalid JWT Token" } )
        } else {
            res.status(401).json( { message: "Something Wicked Happened" } )
        }
    }
}

module.exports = authentication