'use strict'
const log4js = require('log4js')
log4js.configure({
    "appenders": {
        "fileAppender": {
            "type": "file",
            "filename": "change.log"
        }
    },
    "categories": {
        "default": {
            "appenders": ["fileAppender"],
            "level": "INFO"
        }
    }
})
const looger = log4js.getLogger()
module.exports = looger