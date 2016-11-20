/* globals require module */
"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
module.exports = function(connectionString) {
    mongoose.connect(connectionString);
};