const User = require("../models/user"); 
const {CreateTokenForUser,ValidateToken} = require("../service/auth")
async function SigninUser(req,res) {
    const {userName,email, password} = req.body;
    await User.create({
        userName,
        email,
        password,

    });
    return res.json({Success:"true"});


}
async function LoginUser(req,res) {
    const {email, password} = req.body;
    const user = User.matchPassword(email,password);
    if(!user) return res.json({error:"invalid email or password"});
    return
    const token = CreateTokenForUser(user);
    
    
    return res.json({Success:"true"},token);


}
module.exports = {SigninUser,LoginUser};
