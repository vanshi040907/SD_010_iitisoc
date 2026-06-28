const {Router} = require("express");
const router = Router();
const  {handlecreateRoomId,UserEnterRoom,UserAllowed ,UserLeaveRoom} = require("../controller/room")

router.post("/createroom",handlecreateRoomId);
router.post("/joinRoom",UserEnterRoom );
router.get("/allowed/:roomid",UserAllowed);
router.get("/leaveRoom",UserLeaveRoom);

module.exports = router;