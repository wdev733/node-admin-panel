const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const appDefaults = require("./defaults.js");
const cookieSplitter = require("cookie");
const cookieParser = require("cookie-parser");
const os = require("os");
const setupVars = require("./setupVars.js");
const url = require("url");

/**
 * module providing common helper function
 * @exports helper
 * @module helper
 */
var helper = {};
/**
 * creates the default hash of the password for the admin panel
 * @method hashPassword
 * @param {String} pwd - string to hash
 * @returns {String} hash - returns the hash
 * @memberof module:helper
 * @static
 */
helper.hashPassword = function(pwd) {
    const tempHash = crypto.createHash("sha256", "utf8")
        .update(pwd)
        .digest("hex");
    return crypto.createHash("sha256", "utf8")
        .update(tempHash)
        .digest("hex");
};

/**
 * creates the default hash of the provided string with a salt
 * @method hashWithSalt
 * @param {String} pwd - password
 * @param {String} salt - the salt
 * @returns {String} hash - returns the hash
 * @memberof module:helper
 * @static
 */
helper.hashWithSalt = function(pwd, salt) {
    const tempHash = crypto.createHash("sha256", "utf8")
        .update(pwd)
        .update(salt)
        .digest("hex");
    return crypto.createHash("sha256", "utf8")
        .update(tempHash)
        .update(salt)
        .digest("hex");
};
helper.express = {};

/**
 * Verifies the provided cookie
 * @alias express.verifyAuthCookie
 * @method express.verifyAuthCookie
 * @memberof module:helper.express
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Function} next - next callback
 * @static
 */
helper.express.verifyAuthCookie = function(req, res, next) {
    if (req.signedCookies.auth) {
        helper.jwtVerify(req.signedCookies.auth, function(err, decoded) {
            if (decoded) {
                req.user = {
                    "authenticated": true,
                    "csrfToken": decoded.csrfToken,
                    "token": helper.hashWithSalt(decoded.csrfToken, appDefaults.csrfSecret)
                };
            } else {
                req.user = {
                    "authenticated": false
                };
            }
            next();
        });
    } else {
        req.user = {
            "authenticated": false
        };
        next();
    }
};

/**
 * Verifies the csrf token in the request body
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Function} next - next callback
 */
helper.express.csrfMiddleware = function(req, res, next) {
    if (req.body.token) {
        if (req.body.token === helper.hashWithSalt(req.user.csrfToken, appDefaults.csrfSecret)) {
            next();
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400);
    }
};

/**
 * Verifies cors information
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Function} next - next callback
 */
helper.express.corsMiddleware = function(req, res, next) {
    const ipv4 = setupVars.hasOwnProperty("IPV4_ADDRESS") ? setupVars["IPV4_ADDRESS"].split("\/")[0] : server.address()
        .address;
    const authorizedHostnames = [
        ipv4,
        os.hostname(),
        "pi.hole",
        "localhost",
        "127.0.0.1"
    ];
    if (process.env.VIRTUAL_HOST) {
        authorizedHostnames.push(process.env.VIRTUAL_HOST);
    }
    var serverHost = req.hostname;
    if (serverHost && authorizedHostnames.indexOf(serverHost) === -1) {
        res.sendStatus(401);
        return;
    }
    if (req.headers.origin) {
        var originHeader = req.headers.origin;
        if (originHeader.indexOf(":") >= 0) {
            originHeader = url.parse(originHeader)
                .hostname;
        }
        if (authorizedHostnames.indexOf(originHeader) === -1) {
            res.sendStatus(401);
            return;
        }
        res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    next();
};

/**
 * Verifies the provided jwt token
 * @param {String} token - the token to check
 * @param {Function} callback - the callback to call
 */
helper.jwtVerify = function(token, callback) {
    jwt.verify(token, appDefaults.jwtSecret, {
        "subject": "admin",
        "issuer": "pihole",
        "audience": "piholeuser"
    }, callback);
};
module.exports = helper;
