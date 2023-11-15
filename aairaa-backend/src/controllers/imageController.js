const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const {spawn} = require('child_process');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'cnn_model/face-images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    limits: {
        fileSize: 10000000
    }
});


const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'cnn_model/guest-images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
    limits: {
        fileSize: 10000000
    }
});

const upload = multer({ storage: storage,limits: {
    fileSize: 10000000
}}).single('file');

const upload2 = multer({ storage: storage2,limits: {
    fileSize: 10000000
}}).single('file');

const uploadImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        console.log(req.file)
        return res.status(200).send(req.file)
    })
}

const deleteImage = async (req, res) => {
    const { filename } = req.body;
    try {
        await unlinkAsync(path.join('cnn_model/face-images/', filename));
        return res.status(200).send("File deleted successfully");
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error deleting file");
    }
}

const getallImages  =  async(req,res) => {  
    const directoryPath = path.join(__dirname, '../cnn_model/face-images/');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan files!",
                error: err
            });
        }
        let fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: directoryPath + file,
            });
        });
        return res.status(200).send(fileInfos);
    });
}

module.exports = {
    upload,upload2,
    uploadImage,
    deleteImage,
    getallImages
}
