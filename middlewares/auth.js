const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const auth = {
    // authorization => error: 401 (Unauthorized)
    checkToken: (req, res, next) => {
        const bearerToken = req.headers.authorization;
        const jwtToken = bearerToken && bearerToken.split(' ')[1]; // "Bearer,abc" => ["Bearer", "abc"] => "abc"
        if (!jwtToken) {
            const error = new AppError(401, 'No token available');
            return next(error);
        }

        let jwtPayload;
        try {
            jwtPayload = jwt.verify(jwtToken, 'secretword');
        } catch (error) {
            const err = new AppError(500, 'jwt token yaroqsiz');
            return next(err);
        }
        req.user = jwtPayload;
        next();
    },
    // authentication => error: 403 (Forbidden)
    checkUserType: (userType /* admin */) => (req, res, next) => {
        const user = req.user;
        console.log('user', user);
        const hasPermission =
            user.userType /* client */ === userType; /* admin */
        if (!hasPermission) {
            const err = new AppError(
                403,
                'User has no needed permissions to execute this operation'
            );
            return next(err);
        }
        next();
    },
};

module.exports = auth;
