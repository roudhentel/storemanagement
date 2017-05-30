var express = require('express');
var mongoose = require('mongoose');
var Role = require('../models/role');

function RoleRoutes() {
    var router = express.Router();

    router.get('/getAll', function (req, res) {
        Role.find({}, function (err, roles) {
            res.status(200).json(roles);
        });
    });

    router.post('/save', function (req, res) {
        var role = new Role(req.body);

        role.save(function (err) {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: 'Successfully added',
                role: role
            });
        });
    });

    router.put('/edit', function (req, res) {
        var updatedRole = req.body;
        Role.findById(updatedRole._id, function (err, role) {
            if (err) res.status(200).json({ success: false });

            for (let prop in role.toObject()) {
                role[prop] = updatedRole[prop] || "";
            }
            
            role.save(function (_err, _role) {
                if (_err) res.status(200).json({ success: false });

                res.status(200).json({ success: true, role: _role });
            });
        });
    })

    router.delete('/delete', function (req, res) {
        Role.findById(req.query.id).remove().exec((err) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({
                    success: true
                });
            }
        });
    });

    return router;
}

module.exports = RoleRoutes();