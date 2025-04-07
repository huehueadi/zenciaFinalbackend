import jwt from 'jsonwebtoken';
const verifyToken = (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, 'Key');
      // Token is valid
      return res.status(200).json({
        message: 'Token valid',
        userId: decoded.id
       
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.error('Verification error:', error);
      return res.status(500).json({ message: 'Server error during token verification' });
    }
}


export default verifyToken