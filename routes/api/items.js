const router = require("express").Router();

const Item = require("../../models/Item");

const Response = require("../../utils/Response");
const auth = require("../../middleware/auth");

/**
 * @swagger
 * /api/items:
 *   get:
 *    tags:
 *      - name: Items APIs
 *    description: Get All Items
 *    responses:
 *     '200':
 *       description: Successfully got all response
 */
router.get("/", (req, res) => {
  let response = new Response("", []);
  Item.find()
    .sort({ date: -1 })
    .then((items) => {
      // res.json(items);
      response.message = "Success";
      response.rows = items;
      return res.json(response);
    })
    .catch((err) => {
      response.message = err.toString();
      return res.json(response);
    });
});

/**
 * @swagger
 * /api/items:
 *  post:
 *    security:
 *      - ApiKeyAuth: []
 *    tags:
 *      - name: Items APIs
 *    produces: application/json
 *    parameters:
 *      - in: body
 *        name: Item
 *        description: Item to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: string
 *    description: Create an Item
 *    responses:
 *      '200':
 *        description: Successfully created an Item
 */
router.post("/", auth, (req, res) => {
  let response = new Response("", []);
  const newItem = new Item({
    name: req.body.name,
  });

  newItem
    .save()
    .then((item) => {
      // res.json(item);
      response.message = "Created Post Successfully";
      response.rows = item;
      return res.json(response);
    })
    .catch((err) => {
      response.message = err.toString();
      return res.json(response);
    });
});

/**
 * @swagger
 * /api/items/{id}:
 *  delete:
 *    security:
 *      - ApiKeyAuth: []
 *    tags:
 *      - name: Items APIs
 *    responses:
 *      '200':
 *        description: Successfully deleted the Item
 *      '404':
 *        description: Item with ID could not be found
 *    description: >
 *      Delete an Item <br>
 *      Each item is identified by an **id**
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The Item ID
 */
router.delete("/:id", auth, (req, res) => {
  const response = new Response("", []);
  Item.findById(req.params.id)
    .then((item) => {
      item
        .remove()
        .then(() => {
          response.message = "Deleted Post Successfully";
          return res.json(response);
        })
        .catch((err) => {
          response.message = err.toString();
          return res.json(response);
        });
    })
    .catch((err) => {
      response.message = "Item with ID does not exist";
      return res.status(404).json(response);
    });
});

module.exports = router;
