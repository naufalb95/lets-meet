"use strict"

const axios = require('axios')
const FormData = require('form-data')

const imageKit = async (req, res, next) => {
    try {
        if (!req.file) {
            next()
        } else {
            const form = new FormData()
            const privateKey = 'private_y7tUK9sj4RjIKwAqLBOn0UZLtLs=' + ':';
            const convertedKey = Buffer.from(privateKey).toString('base64');
            const convertedFile = Buffer.from(req.file.buffer).toString('base64');
            form.append('file', convertedFile)
            form.append('fileName', req.file.originalname)
            const response = await axios({
                url: "https://upload.imagekit.io/api/v1/files/upload",
                method: "POST",
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Basic ${convertedKey}`
                },
                data: form,
            })
            if (response) {
                req.body.imgUrl = response.data.url
                next();
            }
        }
    } catch (err) {
        next(err)
    }
}

module.exports = imageKit