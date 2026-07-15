const {Router} = require("express");
const router = Router();
const  {handlecreateRoomId,UserEnterRoom,UserLeaveRoom, Name, Allowance,Denial} = require("../controller/room")

router.post("/createroom",handlecreateRoomId);
router.post("/joinRoom",UserEnterRoom );
router.get("/getmember",Name)
router.get("/leaveRoom",UserLeaveRoom);
router.post("/allowed",Allowance);
router.post("/deny",Denial);


module.exports = router;