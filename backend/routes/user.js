const {Router} = require("express");
const router = Router();
const {SigninUser,LoginUser,UserAllowed,UserEnterRoom, LogoutUser} = require("../controller/user");

router.post("/signin",SigninUser);
router.post("/login",LoginUser);
router.get("/logout",LogoutUser)





module.exports = router;