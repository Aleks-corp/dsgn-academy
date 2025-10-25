import path from "path";
import multer from "multer";

const tempPash = path.resolve("temp");

const storage = multer.diskStorage({
  destination: tempPash,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const limits = {
  fileSize: 1024 * 1024 * 2,
};

const uploadFile = multer({ storage, limits });
export default uploadFile;
