const express = require("express");
const {protect} = require("../middleware/authmiddleware");
const router = express.Router();
const {addNoti, fetchAllNoti, markReadAll, markReadOne} = require("../controllers/notiControllers");

router.route("/add").post(protect,addNoti);
router.route("/").get(protect,fetchAllNoti);
router.route("/markreadall").put(protect,markReadAll);
router.route("/markreadone").put(protect,markReadOne);

module.exports = router;