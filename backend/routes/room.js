const { Router } = require("express");
const router = Router();
const { handlecreateRoomId, UserEnterRoom, UserLeaveRoom, Name, Allowance, Denial, MyRooms } = require("../controller/room")

router.post("/createroom", handlecreateRoomId);
router.post("/joinRoom", UserEnterRoom);
router.get("/getmember", Name)
router.get("/leaveRoom", UserLeaveRoom);
router.post("/allowed", Allowance);
router.post("/deny", Denial);
router.get("/myrooms", MyRooms);

module.exports = router;