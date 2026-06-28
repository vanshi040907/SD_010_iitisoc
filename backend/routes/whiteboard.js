const {Router} = require("express");
const router = Router();
const  {EventHandling, Undo , Redo, Get} = require("../controller/whiteboard");

router.post("/event", EventHandling);
router.get("/undo",Undo );
router.post("/redo",Redo);
router.get("/getdata",Get);

module.exports = router;
