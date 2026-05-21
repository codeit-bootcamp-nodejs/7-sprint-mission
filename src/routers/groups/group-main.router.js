import express from "express";
import multer from "multer";
import { GroupCRUD, storage } from "../../modules/groups/groups-main.js";

const router = express.Router();

const upload = multer({ storage: storage });
const groupController = new GroupCRUD();

router.post("/", upload.single("image"), groupController.createGroup);
router.get("/", groupController.getGroups);
router.get("/:groupId", groupController.getGroupDetail);
router.patch("/:groupId", groupController.patchGroup);
router.delete("/:groupId", groupController.deleteGroup);
export default router;
