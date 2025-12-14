const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/role.middleware");
const {
  addSweet,
  getSweets
} = require("../controllers/sweets.controller");

router.get("/", getSweets);
router.post("/", protect, isAdmin, addSweet);

module.exports = router;
