const {Router} = require("express");
const router = Router();
const {SigninUser,LoginUser,UserAllowed,UserEnterRoom, LogoutUser, GetCurrentUser} = require("../controller/user");

router.post("/signin",SigninUser);
router.post("/login",LoginUser);
router.get("/logout",LogoutUser)
router.get("/me", GetCurrentUser);




module.exports = router;