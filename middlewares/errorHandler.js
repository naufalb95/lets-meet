let message;
let errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "SequelizeValidationError":
      message = res.status(400).json({ message: `${error.errors[0].message}` });
      break;
    case "Need Email":
      message = res.status(400).json({ message: `Email is required` });
      break;
    case "Need Password":
      message = res.status(400).json({ message: `Password is required` });
      break;
    case "failed login":
      message = res.status(401).json({ message: `Invalid email / password` });
      break;
    default:
      message = res.status(500).json({ message: "Internal server error." });
      break;
  }
};

module.exports = errorHandler;
