let express = require('express');
let mongoose = require('mongoose');
let User = require('../models/user');
let bcrypt = require('bcrypt');

function UserRoutes() {
    let router = express.Router();
    let salt = bcrypt.genSaltSync(10);

    router.get('/getAll', function (req, res) {
        User.find({}, function (err, users) {
            res.status(200).json(users);
        });
    });

    router.post('/save', function (req, res) {
        let user = new User(req.body);
        user.CreateDate = new Date();
        user.Password = bcrypt.hashSync(user.Password, salt);
        user.save(function (err) {
            if (err) throw err;
            res.status(200).json({
                success: true,
                message: 'Successfully added',
                user: user
            });
        });
    });

    router.post('/authenticate', function (req, res) {
        User.findOne({ "Username": req.body.Username }, function (err, user) {
            if (err) {
                res.status(500);
            } else {
                if (user) {
                    var success = bcrypt.compareSync(req.body.Password, user.Password);
                    if (success) {
                        
                        res.status(200).json({
                            success: success,
                            token: ""
                        });
                    } else {
                        res.status(200).json({
                            success: success,
                            token: ""
                        });
                    }

                } else {
                    res.status(200).json({
                        success: false,
                        token: ""
                    });
                }

            }
        });
    });

    router.put('/edit', function (req, res) {
        let updatedUser = req.body;
        User.findById(updatedUser._id, function (err, user) {
            if (err) res.status(200).json({ success: false });

            for (let prop in updatedUser) {
                if (prop.toLowerCase() !== "__v" && prop.toLowerCase() !== "_id") {
                    user[prop] = updatedUser[prop] || "";
                }
            }

            user.save(function (_err, _user) {
                if (_err) res.status(200).json({ success: false });

                res.status(200).json({ success: true, user: _user });
            });
        });
    })

    router.delete('/delete', function (req, res) {
        User.findById(req.query.id).remove().exec((err) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({
                    success: true
                });
            }
        });

        // User.find({}).remove().exec((err) => {
        //     res.status(200);
        // });
    });

    return router;
}

module.exports = UserRoutes();