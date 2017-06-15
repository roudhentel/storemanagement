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
                    let listStore = [];

                    wb.xlsx.readFile('./server/files/' + filename).then(function (result, error) {
                        if (!error) {
                            let ignore1stRow = true;
                            let ws = wb.getWorksheet("Details");
                            if (ws) {
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        let store = new Store();
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
                                        store.Details.Region = row.values[13];
                                        store.Details.ParkingSlot = row.values[14];
                                        store.Details.Type = row.values[15];
                                        store.Details.DeliveryNo = row.values[16];
                                        store.Details.NoOfYears = row.values[17];
                                        store.Details.NoOfPersonel = row.values[18];
                                        store.Details.AnnivDate = row.values[19];
                                        store.Details.Delivery = row.values[20];
                                        store.Details.Location = row.values[21];

                                        listStore.push(store);
                                    }

                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("QuickFacts");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.QuickFacts.push(row.values[2]);
                                        }
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("MajorEstablishment");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.MajorEstablishments.push(row.values[2]);
                                        }
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Competitors");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.Competitors.push(row.values[2]);
                                        }
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Community");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.Community.push(row.values[2]);
                                        }
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Revenue");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.Revenue.push({
                                                Year: row.values[2] || "",
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
                                    }
                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Sales");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.Sales.push({
                                                Date: row.values[2] || "",
                                                AmSales: row.values[3] || "",
                                                PmSales: row.values[4] || "",
                                                TotalSales: row.values[5] || "",
                                                AmAvg: row.values[6] || "",
                                                PmAvg: row.values[7] || "",
                                                WalkIn: row.values[8] || "",
                                                Hri: row.values[9] || "",
                                                Hds: row.values[10] || "",
                                                Remarks: row.values[11] || ""
                                            });
                                        }
                                    }

                                    ignore1stRow = false;
                                });
                            }

                            ignore1stRow = true;
                            ws = wb.getWorksheet("Transaction");
                            if (ws) {
                                let store = undefined;
                                ws.eachRow(function (row, rowno) {
                                    if (!ignore1stRow) {
                                        store = listStore.find(obj => obj.Details.Id.toString().toLowerCase() === row.values[1].toString().toLowerCase());
                                        if (store) {
                                            store.Transaction.push({
                                                Date: (row.values[2] instanceof Object ? row.values[2].result : row.values[2]) || "",
                                                AmTransaction: (row.values[3] instanceof Object ? row.values[3].result : row.values[3]) || "",
                                                PmTransaction: (row.values[4] instanceof Object ? row.values[4].result : row.values[4]) || "",
                                                TotalTransaction: (row.values[5] instanceof Object ? row.values[5].result : row.values[5]) || "",
                                                AmAvg: (row.values[6] instanceof Object ? row.values[6].result : row.values[6]) || "",
                                                PmAvg: (row.values[7] instanceof Object ? row.values[7].result : row.values[7]) || "",
                                                TransactionValue: (row.values[8] instanceof Object ? row.values[8].result : row.values[8]) || ""
                                            });
                                        }
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

                            saveStore(listStore, 0, res);

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

    let saveStore = function (listStore, idx, res) {
        if (idx < listStore.length) {
            listStore[idx].save(function (err) {
                if (err) {
                    res.status(500).json({
                        success: false
                    });
                } else {
                    saveStore(listStore, ++idx, res);
                }
            });
        } else {
            res.status(200).json({
                success: true,
                listStore: listStore
            });
        }
    }

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