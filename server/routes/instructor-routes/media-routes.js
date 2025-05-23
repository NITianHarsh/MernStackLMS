import express from "express";
import multer from "multer";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../../helper/cloudinary.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Error uploading file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Asset Id is required" });
    }
    const result = await deleteMediaFromCloudinary(id);
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const results = await Promise.all(
      req.files.map((file) => uploadMediaToCloudinary(file.path))
    );
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log("Error uploading files:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading files" });
  }
});

export default router;
