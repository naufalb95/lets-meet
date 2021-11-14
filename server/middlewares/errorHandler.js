let message;
let errorHandler = (error, req, res, next) => {
  console.log('ERR:', error);
  switch (error.name) {
    case "SequelizeValidationError":
      message = res.status(400).json({ message: `${error.errors[0].message}` });
      break;
    case "SequelizeUniqueConstraintError":
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
    case "Event Not Found":
      message = res.status(404).json({ message: `Event Not Found` });
      break;
    case "Access Denied":
      message = res.status(403).json({ message: `Not Enough Access` });
      break;
    default:
      message = res.status(500).json({ message: "Internal server error." });
      break;
  }
};

module.exports = errorHandler;
