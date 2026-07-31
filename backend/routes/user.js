const {Router} = require("express");
const router = Router();
const {SigninUser,LoginUser,UserAllowed,UserEnterRoom, LogoutUser, GetCurrentUser} = require("../controller/user");
const { restrictToLoggedinUser,requiredEditorAccess} = require("../middleware/auth");

router.post("/signin",SigninUser);
router.post("/login",LoginUser);
router.get("/logout",restrictToLoggedinUser,LogoutUser)
router.get("/me", GetCurrentUser);




module.exports = router;