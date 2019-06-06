const express = require("express");
const api = require("./api");
const web = require("./web");

const port = 8080;

module.exports = {
    startServer: function() {
        const app = express();
        app.use(express.json());

        api.setupApiServer(app);
        web.setupWebServer(app);

        app.listen(port, function() {
            console.log(`listening on port ${port}..`);
        });
    }
}