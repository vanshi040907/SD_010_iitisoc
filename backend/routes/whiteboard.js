const {Router} = require("express");
const router = Router();
const  {EventHandling, Undo , Redo} = require("../controller/whiteboard");

router.post("/event", EventHandling);
router.get("/undo",Undo );
router.get("/redo",Redo);

module.exports = router;
