import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];   
      jwt.verify(token, 'mysecretkey', (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'UNAUTHORIZED' }); 
        }
        req.user = user; 
        next(); 
      });
    } else {
      res.status(401).json({ message: 'UNAUTHORIZED' });
    }
};
export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'FORBIDDEN' });
      }
      next();
    };
};

export default authenticateJWT