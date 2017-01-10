var express = require("express");
const readline = require("readline");
const moment = require("moment");

var router = express.Router();
router.get("/data", function (req, res) {
    if ("summary" in req.query) {
        var testData = {
            ads_blocked_today : 10,
            dns_queries_today : 200,
            ads_percentage_today : 10.2,
            domains_being_blocked : 20
        };
        res.json(testData);
    }
    if (req.query.summaryRaw !== undefined) {
        res.write("BBBBB");
    }
    if (req.query.overTimeData !== undefined) {}
    if ("overTimeData10mins" in req.query) {
        var lineReader = require("readline").createInterface({
                input : require("fs").createReadStream(req.app.locals.settings.logFile)
            });
        var data = {
            domains_over_time : {},
            ads_over_time : {}

        };
        lineReader.on("line", function (line) {
            if (typeof line === "undefined" || line.trim() === "" || line.indexOf(": query[A") === -1) {
                return;
            }
            var time = moment(line.substring(0, 16), "MMM DD hh:mm:ss");
            var hour = time.hour();
            var minute = time.minute();
            time = (minute - minute % 10) / 10 + 6 * hour;
            if (Math.random() < 0.5) {
                if (time in data.ads_over_time) {
                    data.ads_over_time[time]++;
                } else {
                    data.ads_over_time[time] = 1;
                }
            }
            if (time in data.domains_over_time) {
                data.domains_over_time[time]++;
            } else {
                data.domains_over_time[time] = 1;
            }
        });
        lineReader.on("close", function () {
            res.json(data);
        });
    }
    if (req.query.topItems !== undefined) {}
    if (req.query.recentItems !== undefined) {}
    if (req.query.getQueryTypes !== undefined) {}
    if (req.query.getForwardDestinations !== undefined) {}
    if (req.query.getQuerySources !== undefined) {}
    if ("getAllQueries" in req.query) {
        var lineReader = require("readline").createInterface({
                input : require("fs").createReadStream(req.app.locals.settings.logFile)
            });
        var lines = [];
        lineReader.on("line", function (line) {
            if (typeof line === "undefined" || line.trim() === "" || line.indexOf(": query[A") === -1) {
                return;
            } else {
                var _time = line.substring(0, 16);
                var expl = line.trim().split(" ");
                var _domain = expl[expl.length - 3];
                var tmp = expl[expl.length - 4];
                var _status = Math.random() < 0.5 ? "Pi-holed" : "OK"
                    var _type = tmp.substring(6, tmp.length - 1);
                var _client = expl[expl.length - 1];
                var data = {
                    time : moment(_time, "MMM DD hh:mm:ss").toISOString(),
                    domain : _domain,
                    status : _status,
                    type : _type,
                    client : _client
                };

                lines.push(data);
            }
        });
        lineReader.on("close", function () {
            res.json({
                data : lines
            });
        });
    }
});
router.get("/list", function (req, res) {
    if (!req.user.authenticated) {
        res.sendStatus(401);
        return;
    }
    if ("list" in req.query && (req.query.list === "white" || req.query.list === "black")) {
        const filepath = "/etc/pihole/" + req.query.list + "list.txt";
        fs.access(filepath, fs.constants.F_OK | fs.constants.R_OK, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                lines = [];
                var lineReader = require("readline").createInterface({
                        input : require("fs").createReadStream("/etc/pihole/" + req.query.list + "list.txt")
                    });
                lineReader.on("line", function (line) {
                    if (line === undefined || line === "") {
                        return;
                    }
                    lines.push(line);
                });
                lineReader.on("close", function () {
                    res.json(lines);
                });
            }
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;