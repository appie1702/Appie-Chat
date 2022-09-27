const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authmiddleware");
const {accessChat, fetchChats, createGroupChat, renameGrp, addToGrp, removeFromGrp} = require("../controllers/chatControllers");


router.route('/').post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGrp);
router.route("/groupadd").put(protect, addToGrp);
router.route("/groupremove").put(protect, removeFromGrp);

module.exports = router;