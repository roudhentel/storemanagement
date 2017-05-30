let mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Role', new Schema({
    Name: String,
    Stores: {
        View: Boolean,
        Add: Boolean,
        Edit: Boolean,
        Delete: Boolean
    },
    Users: {
        View: Boolean,
        Add: Boolean,
        Edit: Boolean,
        Delete: Boolean
    },
    Roles: {
        View: Boolean,
        Add: Boolean,
        Edit: Boolean,
        Delete: Boolean
    },
    Gallery: {
        View: Boolean,
        Add: Boolean,
        Edit: Boolean,
        Delete: Boolean
    },
    BranchPerformance: {
        Revenue: Boolean,
        TransactionCount: Boolean,
        Volume: Boolean,
        ASP: Boolean,
        PriceComparison: Boolean,
        SalesMix: Boolean
    }
}));