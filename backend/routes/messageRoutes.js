const express = require("express");
const {protect} = require("../middleware/authmiddleware");
const router = express.Router();
const {sendMessage, allMessages} = require("../controllers/messageController");


router.route("/").post(protect,sendMessage);
router.route("/:chatID").get(protect,allMessages);

module.exports = router;