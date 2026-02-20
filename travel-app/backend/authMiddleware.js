const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    console.log("Middleware invoked");

    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader);

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.replace('Bearer ', '')
        : null;

    if (!token) {
        console.error("Token missing");
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        if (!decoded.userId) {
            console.error("userId missing in token");
            return res.status(403).json({ message: 'Invalid token payload: userId missing' });
        }

        req.userId = decoded.userId;
        console.log("Extracted userId:", req.userId);
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        } else {
            return res.status(403).json({ message: 'Authentication failed' });
        }
    }
};

module.exports = authenticateUser;
