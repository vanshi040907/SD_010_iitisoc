const {Router} = require("express");
const router = Router();
const {SigninUser,LoginUser,UserAllowed,UserEnterRoom} = require("../controller/user");

router.post("/signin",SigninUser);
router.post("/login",LoginUser);





module.exports = router;