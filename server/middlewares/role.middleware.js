const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Please Login First"
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to access this route"
                });
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};

export default authorizeRoles;