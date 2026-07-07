const {Router} = require("express");
const router = Router();
const  {handlecreateRoomId,UserEnterRoom,UserLeaveRoom, Name} = require("../controller/room")

router.post("/createroom",handlecreateRoomId);
router.post("/joinRoom",UserEnterRoom );
router.get("/getmember",Name)
router.get("/leaveRoom",UserLeaveRoom);


module.exports = router;