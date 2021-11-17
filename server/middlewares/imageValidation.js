const imageValidation = async (req, res, next) => {
  try {

    if (!req.file) {
      next()
    } else {
      if (req.file.size > 255000) {
        throw ({ name: `fileTooBig` })
      }

      if (
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/jpg" &&
        req.file.mimetype !== "image/jpeg"
      ) {
        throw ({ name: `wrongFormat` })
      }

      next()

    }

  } catch (error) {
    next(error)
  }
}


module.exports = imageValidation