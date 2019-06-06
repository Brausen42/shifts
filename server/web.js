const express = require("express");

module.exports = {
    setupWebServer: function(expressApp) {
        expressApp.use(express.static('client'));
    }
}


