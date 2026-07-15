const {Router} = require("express");
const router = Router();
const  {EventHandling, Undo , Redo, Get, Update} = require("../controller/whiteboard");
const { restrictToLoggedinUser,requiredEditorAccess} = require("../middleware/auth");

router.post("/event",requiredEditorAccess, EventHandling);
router.get("/undo",requiredEditorAccess,Undo );
router.get("/redo",requiredEditorAccess,Redo);
router.get("/getdata",Get);
router.post("/update",requiredEditorAccess,Update)

module.exports = router;
