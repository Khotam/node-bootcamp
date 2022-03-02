const { v4: uuidv4 } = require('uuid');
// const Logger = require('../config/logger');
const Database = require('../db');
// const AppError = require('../utils/AppError');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// DRY - don't repeat yourself
const signJwtToken = (userId, email, username, userType) => {
    const token = jwt.sign(
        { userId, email, username, userType }, // payload
        'secretword',
        {
            expiresIn: '24h', // 24 hours
        }
    );
    return token;
};

const usersController = {
    register: async (req, res, next) => {
        // 1. Get user data from req.body
        // 2. Encode password. 12345abc => 131bnasbdk12j31kbafbkjanhk => compare(12345abc, 131bnasbdk12j31kbafbkjanhk) => true/false
        // 3. Insert into database
        // 4. Return JWT token => 131bnasbdk12j31kbafbkjanhkasdasdasds123adfsfdas

        try {
            const { email, username, password, type } = req.body;
            const pgClient = Database.getClient();
            await Database.connect();

            const id = uuidv4();
            const hashedPassword = await bcrypt.hash(password, 10);
            await pgClient.query(
                'INSERT INTO users (id, email, username, password, type) VALUES ($1, $2, $3, $4, $5)',
                [id, email, username, hashedPassword, type]
            );

            const token = signJwtToken(id, email, username, type);

            res.status(200).json({ token });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
    login: async (req, res, next) => {
        // 1. Get user data from req.body => email, password
        // 2. Check if user exists with that email and password.
        // 3. YES => token. NO - Register
        // 4. Return JWT token => 131bnasbdk12j31kbafbkjanhkasdasdasds123adfsfdas
        try {
            const { email, password } = req.body;
            const pgClient = Database.getClient();
            await Database.connect();

            const result = await pgClient.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            const user = result.rows[0];
            console.log('user', user);
            if (!user) {
                return next(
                    new AppError(
                        400, // BAD REQUEST - user mistake
                        `There is no user with this email: ${email}`
                    )
                );
            }

            const passwordCorrect = await bcrypt.compare(
                password,
                user.password /* hashedPassword*/
            );
            if (!passwordCorrect) {
                return next(
                    new AppError(
                        400, // BAD REQUEST - user mistake
                        `Password is incorrect`
                    )
                );
            }

            const token = signJwtToken(
                user.id,
                user.email,
                user.username,
                user.type
            );
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        } finally {
            await Database.end();
        }
    },
};

module.exports = usersController;
