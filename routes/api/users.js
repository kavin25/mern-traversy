const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const Response = require("../../utils/Response");

/**
 * @swagger
 * /api/users:
 *   post:
 *    tags:
 *      - name: User apis
 *    description: Register New User
 *    produces: application/json
 *    parameters:
 *      - in: body
 *        name: User
 *        description: User to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *     '200':
 *       description: Successfully registered new user
 */
router.post("/", (req, res) => {
  let response = new Response("", []);
  const { name, email, password } = req.body;

  // Simple validation
  if (!name | !email | !password) {
    response.message = "Name, Email and Password are required";
    return res.status(400).json(response);
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user) {
      response.message = "User with email already exists";
      return res.status(400).json(response);
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                response.rows = {
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                };
                return res.json(response);
              }
            );
          })
          .catch((err) => {});
      });
    });
  });
});

module.exports = router;
