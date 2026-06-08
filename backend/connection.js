const mongoose = require("mongoose");
async function connectmongoose(url) {
    return mongoose.connect(url);
}
module.exports={connectmongoose};