const express = require("express");
const readline = require("readline");
const moment = require("moment");
const fs = require("fs");
const logHelper = require("./../logHelper.js");
const appDefaults = require("./../defaults.js");
var router = express.Router();

const supportedDataQueries = ["summary", "summaryRaw", "overTimeData", "overTimeData10mins", "topItems", "recentItems", "getQueryTypes", "getForwardDestinations", "getAllQueries"];

// Potential buildfail fix for node 5 and below
// polyfill source: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != "function") {
    Object.assign = function(target) {
        "use strict";
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
///// for node 5 and below
// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        value: function(searchElement, fromIndex) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError("\"this\" is null or not defined");
            }
            var o = Object(this);
            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;
            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }
            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;
            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                // c. Increase k by 1.
                // NOTE: === provides the correct "SameValueZero" comparison needed here.
                if (o[k] === searchElement) {
                    return true;
                }
                k++;
            }
            // 8. Return false
            return false;
        }
    });
}
/////////////////////////////////////////////

router.get("/data", function(req, res) {
    // Filter query types so only valid ones pass
    var args = {};
    // to cancel request early if no valid args were provided
    var numValidArgs = 0;
    for (var query in req.query) {
        if (supportedDataQueries.includes(query)) {
            args[query] = req.query[query];
            numValidArgs++;
        }
    }
    // cancel request because no valid args were provided
    if (numValidArgs == 0) {
        res.sendStatus(400);
        return;
    }

    var data = {};
    var promises = [];
    if ("summary" in args) {
        promises.push(logHelper.getSummary());
    }
    if ("summaryRaw" in args) {
        promises.push(logHelper.getSummaryRaw());
    }
    if ("overTimeData" in req.query) {}
    if ("overTimeData10mins" in req.query) {
        promises.push(logHelper.getOverTimeData10mins());
    }
    if ("topItems" in req.query) {
        promises.push(logHelper.getTopItems());
    }
    if ("recentItems" in req.query) {}
    if ("getQueryTypes" in req.query) {
        promises.push(logHelper.getQueryTypes());
    }
    if ("getForwardDestinations" in req.query) {
        promises.push(logHelper.getForwardDestinations());
    }
    if ("getQuerySources" in req.query) {}
    if ("getAllQueries" in req.query) {
        promises.push(logHelper.getAllQueries());
    }
    Promise.all(promises)
        .then(function(values) {
            var data = {};
            for (var i = 0; i < values.length; i++) {
                data = Object.assign(data, values[i]);
            }
            res.json(data);
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(400);
        });
});

router.get("/list", function(req, res) {
    if (!req.user.authenticated) {
        res.sendStatus(401);
    } else if ("list" in req.query && (req.query.list === "white" || req.query.list === "black")) {
        var filepath;
        if (req.query.list === "white") {
            filepath = appDefaults.whiteListFile;
        } else {
            filepath = appDefaults.blackListFile;
        }
        fs.access(filepath, fs.F_OK | fs.R_OK, function(err) {
            if (err) {
                res.status(500);
                res.send("Could not open " + req.query.list + "list file");
            } else {
                var lines = [];
                var lineReader = require("readline")
                    .createInterface({
                        input: require("fs")
                            .createReadStream(filepath)
                    });
                lineReader.on("line", function(line) {
                    if (line === "") {
                        return;
                    }
                    lines.push(line);
                });
                lineReader.on("close", function() {
                    res.json(lines);
                });
            }
        });
    } else {
        res.sendStatus(400);
    }
});

module.exports = router;
