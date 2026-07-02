const express = require("express");
const router = express.Router();

const ownerController = require("../controllers/ownerController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.use(authenticate);
router.use(authorize("OWNER"));

router.get(
    "/dashboard",
    ownerController.getDashboard
);

router.get(
    "/ratings",
    ownerController.getUsersWhoRated
);

router.get(
    "/average-rating",
    ownerController.getAverageRating
);


// router.get(
//     "/ratings",
//     ownerController.getStoreRatings
// );

module.exports = router;


