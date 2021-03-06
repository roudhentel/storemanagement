var express = require('express');
var mongoose = require('mongoose');
var Store = require('../models/store');

function StoreRoutes() {
    var router = express.Router();

    router.get('/getAll', function (req, res) {
        Store.find({}, function (err, stores) {
            res.status(200).json(stores);
        });
    });

    router.post('/save', function (req, res) {
        var store = new Store(req.body);
        store.CreateDate = new Date();
        store.save(function (err) {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: 'Successfully added',
                store: store
            });
        });
    });

    router.put('/addRevenue', function (req, res) {
        var salesRev = req.body.salesRev;
        var id = req.body.id;
        Store.update({ _id: id },
            { $push: { "Revenue": salesRev } }, function (err, store) {
                if (err) res.status(500).json({ success: false });

                res.status(200).json({ success: true, store: store });
            });
    });

    router.put('/updateRevenue', function (req, res) {
        var updatedStore = req.body;

        Store.update({ _id: updatedStore.Id, "Revenue.Year": updatedStore.Year },
            { $set: { "Revenue.$.Data": updatedStore.Data } }, function (err, store) {
                if (err) res.status(500).json({ success: false });

                res.status(200).json({ success: true });
            });
    });

    router.put('/edit', function (req, res) {
        var updatedStore = req.body;
        Store.findById(updatedStore._id, function (err, store) {
            if (err) res.status(200).json({ success: false });

            for (let prop in updatedStore) {
                if (prop.toLowerCase() !== "__v" && prop.toLowerCase() !== "_id") {
                    store[prop] = updatedStore[prop] || "";
                }
            }

            store.save(function (_err, _store) {
                if (_err) res.status(200).json({ success: false });

                res.status(200).json({ success: true, store: _store });
            });
        });
    })

    router.delete('/delete', function (req, res) {
        Store.findById(req.query.id).remove().exec((err) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({
                    success: true
                });
            }
        });

        // Store.find({}).remove().exec((err) => {
        //     res.status(200);
        // });
    });

    return router;
}

module.exports = StoreRoutes();