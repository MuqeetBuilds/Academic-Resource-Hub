// Role-based authorization middleware
// Usage: router.post('/upload', auth, roleAuth('senior'), uploadResource);
module.exports = function (...allowedRoles) {
    return (req, res, next) => {
        // auth middleware must run first to set req.user
        if (!req.user) {
            return res.status(401).json({ msg: 'Authorization denied' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied. You do not have permission to perform this action.' });
        }

        next();
    };
};
