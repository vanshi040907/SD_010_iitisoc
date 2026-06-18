const { ValidateToken } = require("../service/auth");
function  restrictToLoggedinUser(req,res,next) {
     const useruid = req.cookies?.uid;
    if(!useruid) return res.status(401).json({ error: "Login required" });
    const user = ValidateToken(useruid);
    if(!user) return res.status(401).json({ error: "Login required" });
    req.user=user;
    next();
}
module.exports = {
    restrictToLoggedinUser,
};