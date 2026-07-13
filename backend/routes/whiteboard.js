const {Router} = require("express");
const router = Router();
const  {EventHandling, Undo , Redo, Get, Update} = require("../controller/whiteboard");

router.post("/event", EventHandling);
router.get("/undo",Undo );
router.get("/redo",Redo);
router.get("/getdata",Get);
router.post("/update",Update)

module.exports = router;
