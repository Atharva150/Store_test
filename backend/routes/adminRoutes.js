const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.use(authenticate);
router.use(authorize("ADMIN"));


router.get(
    "/dashboard",
    adminController.getDashboardStats
);

router.post(
    "/users",
    adminController.createUser
);

router.get(
    "/users",
    adminController.getAllUsers
);


router.get(
    "/users/search",
    adminController.searchUsers
);

router.get(
    "/users/:id",
    adminController.getUserById
);

router.get(
    "/owners",
    adminController.getOwners
);

router.post(
    "/stores",
    adminController.createStore
);

router.get(
    "/stores",
    adminController.getAllStores
);

router.get(
    "/stores/search",
    adminController.searchStores
);

router.delete(
    "/users/:id",
    adminController.deleteUser
);

module.exports = router;

