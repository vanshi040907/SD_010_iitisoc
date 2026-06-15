const JWT = require("jsonwebtoken");
const secret = "anything";
const User = require("../models/user"); 
function CreateTokenForUser(User) {
    const payload = {
        id:User._id,
        email:User.email,
    }
    const token = JWT.sign(payload,secret);
    return token;


}
function ValidateToken(token) {
    const payload = JWT.verify(token,secret);
    return payload;
    

}
module.exports = {CreateTokenForUser,ValidateToken};