const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token exists (User is not logged in)
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify the token using your secret key
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded payload ({ userId, role }) directly to req.user
        req.user = decoded; 
        
        // 5. Move to the next function (the controller)
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};