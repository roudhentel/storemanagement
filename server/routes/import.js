let express = require('express');
let multer = require('multer');
let dateFormat = require('dateformat');
let exceljs = require('exceljs');
let fs = require('fs');
let Store = require('../models/store');

function ImportRoutes() {
    let router = express.Router();
    let upload = multer({ dest: './server/files/' });

    router.post('/upload', upload.single('myFile'), function (req, res) {
        if (!req.files) {
            res.status(400).json({ success: false, message: "No file(s) were uploaded." });
        } else {
            let tFile = req.files.myFile;
            let filename = "importedExcel" + dateFormat(new Date(), "yyyymmddhhMMssTT") + ".xlsx";
            tFile.mv('./server/files/' + filename, function (err) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: err
                    });
                } else {
                    let wb = new exceljs.Workbook();
                    let store = new Store();

                    wb.xlsx.readFile('./server/files/' + filename).then(function (result, error) {
                        if (!error) {
                            let ws = wb.getWorksheet("Details");
                            let row = ws.getRow(2);
                            store.Details.Id = row.values[1];
                            store.Details.Name = row.values[2];
                            store.Details.Address1 = row.values[3];
                            store.Details.Address2 = row.values[4];
                            store.Details.City = row.values[5];
                            store.Details.Province = row.values[6];
                            store.Details.Area = row.values[7];
                            store.Details.FloorArea = row.values[8];
                            store.Details.Classification = row.values[9];
                            store.Details.OperatingHours = row.values[10];
                            store.Details.StoreHead = row.values[11];
                            store.Details.ContactNo = row.values[12];

                            ws = wb.getWorksheet("Info");
                            row = ws.getRow(2);
                            store.Info.Region = row.values[1];
                            store.Info.ParkingSlot = row.values[2];
                            store.Info.Type = row.values[3];
                            store.Info.DeliveryNo = row.values[4];
                            store.Info.NoOfYears = row.values[5];
                            store.Info.NoOfPersonel = row.values[6];
                            store.Info.AnnivDate = row.values[7];
                            store.Info.Delivery = row.values[8];
                            store.Info.Longitude = row.values[9];
                            store.Info.Latitude = row.values[10];

                            let ignore1stRow = true;
                            ws = wb.getWorksheet("QuickFacts");
                            ws.eachRow(function (row, rowno) {
                                if (!ignore1stRow) {
                                    store.QuickFacts.push(row.values[1]);
                                }
                                ignore1stRow = false;
                            });

                            ignore1stRow = true;
                            ws = wb.getWorksheet("MajorEstablishment");
                            ws.eachRow(function (row, rowno) {
                                if (!ignore1stRow) {
                                    store.MajorEstablishments.push(row.values[1]);
                                }
                                ignore1stRow = false;
                            });

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Competitors");
                            ws.eachRow(function (row, rowno) {
                                if (!ignore1stRow) {
                                    store.Competitors.push(row.values[1]);
                                }
                                ignore1stRow = false;
                            });

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Community");
                            ws.eachRow(function (row, rowno) {
                                if (!ignore1stRow) {
                                    store.Community.push(row.values[1]);
                                }
                                ignore1stRow = false;
                            });

                            // remove file
                            fs.unlink('./server/files/' + filename, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("deleted file: " + filename);
                                }
                            });

                            store.save(function (err) {
                                if (err) {
                                    res.status(500).json({
                                        success: false
                                    });
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        store: store
                                    });
                                }
                            });

                        } else {
                            res.status(500).json({
                                success: false
                            });
                        }
                    });
                }
            })
        }
    });

    return router;
}

module.exports = ImportRoutes();