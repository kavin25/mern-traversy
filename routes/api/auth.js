const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

const Response = require("../../utils/Response");

/**
 * @swagger
 * /api/auth:
 *   post:
 *    tags:
 *      - name: User apis
 *    description: Authenticate User
 *    parameters:
 *      - in: body
 *        name: User
 *        description: User to authenticate
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *     '200':
 *       description: Successfully authenticated new user
 */
router.post("/", (req, res) => {
  let response = new Response("", []);
  const { email, password } = req.body;

  // Simple validation
  if (!email | !password) {
    response.message = "Name, Email and Password are required";
    return res.status(400).json(response);
  }

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) {
      response.message = "User does not exist";
      return res.status(400).json(response);
    }

    // validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        response.message = "Invalid password";
        return res.status(400).json(response);
      }
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
    });
  });
});

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *    security:
 *      - ApiKeyAuth: []
 *    tags:
 *      - name: User apis
 *    description: Get user data
 *    responses:
 *     '200':
 *       description: Successfully accessed user data
 */
router.get("/user", auth, (req, res) => {
  let response = new Response("", []);
  User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      response.rows = user;
      return res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
