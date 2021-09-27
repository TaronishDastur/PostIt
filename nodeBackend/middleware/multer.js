const multer = require("multer");

const MIMETYPE = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/jpg": "jpg",
};

// tell multer where to store the file
// key1 destination => fun arg req, file, callback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // check if the filetype is valid
    let error = null;
    if (!MIMETYPE[file.mimetype]) {
      error = new Error("File save error : Incorrect file type");
    }
    //callback func (err, destination folder)
    cb(error, "");
  },
  filename: (req, file, cb) => {
    // set the name of the file = normalize it by removing spaces and making lowercase
    const name = file.originalname.toLowerCase().split(" ").join("_");
    // get mime type of file
    const ext = MIMETYPE[file.mimetype];
    // construct the file name using date now for unique name
    cb(null, name + "_" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("image");
