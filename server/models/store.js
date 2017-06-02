let mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Store', new Schema({
    Details: {
        Id: String,
        Name: String,
        Address1: String,
        Address2: String,
        City: String,
        Province: String,
        Area: String,
        FloorArea: String,
        Classification: String,
        OperatingHours: String,
        StoreHead: String,
        ContactNo: String
    },
    Info: {
        Region: String,
        ParkingSlot: String,
        Type: String,
        DeliveryNo: String,
        NoOfYears: Number,
        NoOfPersonel: Number,
        AnnivDate: Date,
        Delivery: Boolean,
        Longitude: Number,
        Latitude: Number
    },
    QuickFacts: [],
    MajorEstablishments: [],
    Competitors: [],
    Community: []
}));