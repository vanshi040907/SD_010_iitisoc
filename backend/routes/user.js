const {Router} = require("express");
const router = Router();
const {SigninUser,LoginUser} = require("../controller/user");

router.post("/signin",SigninUser);
router.post("/login",LoginUser);




module.exports = router;