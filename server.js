const serveStatic = require("serve-static");
const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");
const ini = require("ini");
const cookieParser = require("cookie-parser");
const spawn = require("child_process")
    .spawn;
const exec = require("child_process")
    .exec;
const readline = require("readline");
const moment = require("moment");
const apiRoute = require("./routes/api.js");
const frontEnd = require("./routes/front.js");
const helper = require("./helper.js");


var PiServer = function() {
    this.app = express();
    this.server = require("http")
        .Server(this.app);
    this.io = socketIo(this.server);
    this.app.set("view engine", "pug");
    this.app.use(bodyParser.urlencoded({
        extended: true
    }));

    var secret = helper.hashPassword(helper.hashPassword(helper.hashPassword("" + (Math.random() * Date.now()))));
    var cookieSecret = helper.hashPassword(helper.hashPassword(helper.hashPassword("" + (Math.random() * Date.now())) + secret));

    this.app.use("/static", serveStatic(__dirname + "/static"));
    this.app.use(cookieParser(cookieSecret));

    this.app.use(function(req, res, next) {
        helper.verifyAuthCookie(req, res, next);
    });
    this.app.use("/api", apiRoute);
    this.app.get("/", frontEnd.home.get);
    this.app.get("/home", frontEnd.home.get);
    this.app.get("/settings", frontEnd.settings.get);
    this.app.get("/taillog", frontEnd.taillog.get);
    this.app.get("/login", frontEnd.login.get);
    this.app.post("/login", frontEnd.login.post);
    this.app.get("/logout", frontEnd.logout.get);
    this.app.get("/queries", frontEnd.queries.get);
    this.app.get("/list", frontEnd.list.get);

    this.app.post("/scripts/pi-hole/php/add.php", function(req, res) {
        if (!req.user.authenticated) {
            res.sendStatus(401);
            res.end();
            return;
        }
        var domain = req.body.domain;
        var list = req.body.list;
        var token = req.body.token;
        if (domain && list) {
            if (list === "white") {
                exec("sudo pihole -w -q " + domain);
                res.end();
                return;
            } else if (list === "black") {
                exec("sudo pihole -b -q " + domain);
                res.end();
                return;
            } else {
                console.log("unknwon list type:" + list);
            }
        }
        res.sendStatus(404);

    });

    this.io = socketIo(this.server);

    this.io.on('connection', function(socket) {
        console.log('a user connected');
    });

};

PiServer.prototype.load = function() {
    this.app.locals.settings = require("./defaults.js");
    this.app.locals.piHoleConfig = ini.parse(fs.readFileSync(this.app.locals.settings.setupVars, "utf-8"));
};

PiServer.prototype.start = function() {
    this.server.listen(this.app.locals.settings.port, function() {
            console.log("Server listening on port " + this.app.locals.settings.port + "!");
        }
        .bind(this));
    /*this.app.listen(this.app.locals.settings.port, function() {
            console.log("Server listening on port " + this.app.locals.settings.port + "!");
        }
        .bind(this));*/
};

module.exports = PiServer;
