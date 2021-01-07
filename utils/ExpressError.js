const { STATES } = require("mongoose");

class ExpressError extends Error {
    constructor(statusCode, message, detail) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.detail = detail;
    }
}

module.exports = ExpressError;