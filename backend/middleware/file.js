const multer = require("multer");

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mine Type");
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename : (req, file, cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

//multer will try to extract a single file fromt he incoming req and 
//it will try to find on an image property in the req body and it will be our job to 
//provide this

module.exports = multer({storage : storage}).single("image");