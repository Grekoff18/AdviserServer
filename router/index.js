const Router = require("express").Router;
const router = new Router();
const userController = require("../controllers/user-controller");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refreshToken", userController.refreshToken);
router.get("/users", userController.getAllUsers);

module.exports = router;