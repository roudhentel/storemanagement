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
                            let row = {};
                            if (ws) {
                                row = ws.getRow(2);
                                if (row) {
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
                                }
                            }

                            ws = wb.getWorksheet("Info");
                            if (ws) {
                                row = ws.getRow(2);
                                if (row) {
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
                                }
                            }

                            let ignore1stRow = true;
                            ws = wb.getWorksheet("QuickFacts");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.QuickFacts.push(row.values[1]);
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("MajorEstablishment");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.MajorEstablishments.push(row.values[1]);
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Competitors");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.Competitors.push(row.values[1]);
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Community");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.Community.push(row.values[1]);
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("SalesRevenue");
                            if (ws) {
                                var newData = {
                                    Year: "",
                                    Data: []
                                }
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        newData.Year = newData.Year === "" ? (row.values[1] || "") : newData.Year;

                                        newData.Data.push({
                                            Description: row.values[2] || "",
                                            January: row.values[3] || "",
                                            February: row.values[4] || "",
                                            March: row.values[5] || "",
                                            April: row.values[6] || "",
                                            May: row.values[7] || "",
                                            June: row.values[8] || "",
                                            July: row.values[9] || "",
                                            August: row.values[10] || "",
                                            September: row.values[11] || "",
                                            October: row.values[12] || "",
                                            November: row.values[13] || "",
                                            December: row.values[14] || ""
                                        });
                                    }
                                    ignore1stRow = false;
                                });

                                store.Revenue.push(newData);
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("SalesStat");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.SalesStat.push({
                                            Type: row.values[1] || "",
                                            January: row.values[2] || "",
                                            February: row.values[3] || "",
                                            March: row.values[4] || "",
                                            April: row.values[5] || "",
                                            May: row.values[6] || "",
                                            June: row.values[7] || "",
                                            July: row.values[8] || "",
                                            August: row.values[9] || "",
                                            September: row.values[10] || "",
                                            October: row.values[11] || "",
                                            November: row.values[12] || "",
                                            December: row.values[13] || ""
                                        });
                                    }

                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("DailySales");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store.DailySales.push({
                                            Date: row.values[1] || "",
                                            AmSales: row.values[2] || "",
                                            PmSales: row.values[3] || "",
                                            TotalSales: (row.values[4] instanceof Object ? row.values[4].result : row.values[4]) || "",
                                            AmAvg: (row.values[5] instanceof Object ? row.values[5].result : row.values[5]) || "",
                                            PmAvg: (row.values[6] instanceof Object ? row.values[6].result : row.values[6]) || "",
                                            Remarks: row.values[7] || ""
                                        });
                                    }

                                    ignore1stRow = false;
                                });
                            }

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

    router.post('/salesRevenue', upload.single('myFile'), function (req, res) {
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

                    wb.xlsx.readFile('./server/files/' + filename).then(function (result, error) {
                        if (!error) {
                            let ws = wb.getWorksheet("SalesRevenue");
                            let ignore1stRow = true;
                            if (ws) {
                                var newData = {
                                    Year: "",
                                    Data: []
                                }
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        newData.Year = newData.Year === "" ? (row.values[1] || "") : newData.Year;

                                        newData.Data.push({
                                            Description: row.values[2] || "",
                                            January: row.values[3] || "",
                                            February: row.values[4] || "",
                                            March: row.values[5] || "",
                                            April: row.values[6] || "",
                                            May: row.values[7] || "",
                                            June: row.values[8] || "",
                                            July: row.values[9] || "",
                                            August: row.values[10] || "",
                                            September: row.values[11] || "",
                                            October: row.values[12] || "",
                                            November: row.values[13] || "",
                                            December: row.values[14] || ""
                                        });
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

                                res.status(200).json({
                                    success: true,
                                    row: newData
                                });
                            }
                        } else {
                            res.status(500).json({
                                success: false
                            });
                        }
                    });
                }
            });
        }
    });

    return router;
}

module.exports = ImportRoutes();