const {Router} = require("express");
const router = Router();
const  {handlecreateRoomId,UserEnterRoom,UserAllowed} = require("../controller/room")

router.get("/createroom/:roomid",handlecreateRoomId);
router.post("/enterroom",UserEnterRoom );
router.get("/allowed/:roomid",UserAllowed);



module.exports = router;