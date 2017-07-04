var express = require('express');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
let multer = require('multer');

function FileSystemRoutes() {
    var router = express.Router();
    let upload = multer({ dest: './server/files/' });

    router.post("/addPictures", upload.single('myFile'), function (request, response) {
        if (!request.files) {
            response.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            let tFile = request.files.myFile;
            var storeId = request.query.storeId,
                albumName = request.query.albumName;

            var pathLocation = './public/assets/gallery/' + storeId + "/" + albumName + "/";
            var returnLocation = 'assets/gallery/' + storeId + "/" + albumName + "/";
            if (tFile instanceof Array) {
                // multiple files
                var files = [];
                tFile.forEach(f => {
                    f.mv(pathLocation + f.name, function (err) {
                        if (err) {
                            response.status(200).json({
                                success: false,
                                details: err
                            });
                        }
                    });

                    files.push({ path: returnLocation + f.name, filename: f.name });
                });

                response.status(200).json({
                    success: true,
                    files: files
                });
            } else if (tFile instanceof Object) {
                // single file
                tFile.mv(pathLocation + tFile.name, function (err) {
                    if (err) {
                        response.status(200).json({
                            success: false,
                            details: err
                        });
                    } else {
                        response.status(200).json({
                            success: true,
                            files: [{ path: returnLocation + tFile.name, filename: tFile.name }]
                        });
                    }
                });
            }
        }
    });

    router.get("/getAll", function (request, response) {
        var _ret = [];
        var storeId = request.query.storeId;
        var folderpath = "./public/assets/gallery/" + storeId + "/";
        fs.readdir(folderpath, (err, files) => {
            if (err) {
                response.status(200).json({
                    success: false,
                    rows: []
                });
            } else {
                files.forEach(file => {
                    var stats = fs.statSync(folderpath + file);

                    if (stats.isDirectory()) {
                        _ret.push({
                            name: file,
                            files: []
                        });

                        var _files = fs.readdirSync(folderpath + file);
                        _files.forEach(_file => {
                            var _stats = fs.statSync(folderpath + file + "/" + _file);
                            var extname = path.extname(_file)
                            if (!_stats.isDirectory() && (extname === ".jpg" || extname === '.png' || extname === '.bmp')) {
                                _ret[_ret.length - 1].files.push({ path: "assets/gallery/" + storeId + "/" + file + "/" + _file, filename: _file });
                            }
                        });
                    }
                });

                response.status(200).json({
                    success: true,
                    rows: _ret
                });
            }

        });

    });

    router.delete("/deleteImage", function (request, response) {
        var img = "./public/" + request.query.image;

        fs.unlink(img, (err) => {
            if (err) {
                response.status(200).json({
                    success: false
                });
            }

            response.status(200).json({
                success: true
            });
        });
    });

    router.post("/addAlbum", function (request, response) {
        var albumname = request.body.albumname
        var storeId = request.body.storeId;
        var folderpath = "./public/assets/gallery/" + storeId + "/" + albumname;
        if (!fs.existsSync("./public/assets/gallery/" + storeId)) {
            fs.mkdirSync("./public/assets/gallery/" + storeId);
        }
        fs.mkdir(folderpath, function (err) {
            if (err) {
                response.status(500).json({
                    success: false,
                    details: err
                });
            } else {
                response.status(200).json({
                    success: true
                })
            }
        });
    });

    //router.post("/addImage")

    router.put("/editAlbum", function (request, response) {
        var oldname = "./public/assets/gallery/" + request.body.storeId + "/" + request.body.oldname,
            newname = "./public/assets/gallery/" + request.body.storeId + "/" + request.body.newname;

        fs.rename(oldname, newname, (err) => {
            if (err) {
                response.status(500).json({
                    success: false,
                    details: err
                });
            } else {
                response.status(200).json({
                    success: true
                })
            }
        });
    });

    router.delete("/deleteAlbum", function (request, response) {
        var albumpath = "./public/assets/gallery/" + request.query.storeId + "/" + request.query.albumname;
        rimraf(albumpath, function (err) {
            if (err) {
                response.status(500).json({
                    success: false,
                    details: err
                });
            } else {
                response.status(200).json({
                    success: true
                });
            }
        });
    });

    var deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    return router;
}

module.exports = FileSystemRoutes();