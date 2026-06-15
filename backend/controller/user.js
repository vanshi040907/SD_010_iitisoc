const User = require("../models/user"); 
const Room = require("../models/room");
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
    console.log("hi");
    const {email, password} = req.body;
    const user = await User.matchPassword(email,password);
    if(!user) return  res.status(401).json({
    error: "Invalid email or password"
});;
    
    const token = CreateTokenForUser(user);
    
    
    return res.json({Success:"true",token});


}


    



module.exports = {SigninUser,LoginUser};
