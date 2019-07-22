const fs = require('fs')
const process = require('process')
const logger = require('./logger.js')
const util = require('./util.js')

// filepath to the leads.json
const FILEPATH = process.argv[2]
// user defined selectors
const SELECTORS = ['_id', 'email']
// initializing all the selectorsMap
const selectorsMap = util.initMap(SELECTORS)
// run the app
start()

/**
 * Start of the application
 */
function start() {

    // gets all the records to be reconciled.
    const records = util.getRecords(FILEPATH)
    if (records.length == 0) {
        return false
    }

    // iterate all the records to deDup
    let recordNumber = 0
    for (let record of records) {
        logger.info(`New record with recordNumber[${recordNumber}] : `, record)
        const dupObj = util.getDuplicateObj(record, recordNumber, SELECTORS, selectorsMap)
        util.deDup(dupObj, selectorsMap, SELECTORS)
        recordNumber++
    }

    // logging the reconciled records
    logger.info('*********************************************')
    logger.info(selectorsMap[SELECTORS[0]])

    // writing reconciled records to reconciled-records.json
    const output = {
        'leads' : Object.values(selectorsMap[SELECTORS[0]])
    }
    fs.writeFileSync('reconciled-records.json', JSON.stringify(output, null, 4));
    return true
}
