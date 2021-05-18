import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    req.decoded = jwt.verify(token, process.env.JWT_SECRET);

    return next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: 'Expired Token.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'Invalid Token.',
    });
  }
};

export default verifyToken;
