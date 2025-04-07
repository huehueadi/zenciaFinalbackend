import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.JWT_SECRET || 'Key';  

function authenticateJWT(req, res, next) {
  const token = req.headers['authorization']  
  if (!token) {
    return res.status(403).json({ message: 'Access denied, token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; 
    next();
  });
}

export default authenticateJWT