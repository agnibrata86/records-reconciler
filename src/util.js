
const fs = require('fs')
const logger = require('./logger.js')

/**
 * 
 * @param {String} filepath File path to records json
 */
exports.getRecords = function (filepath) {
    let records = []
    try {
        records = JSON.parse(fs.readFileSync(filepath)).leads
    } catch (error) {
        logger.error(error)
    }
    return records
}

/**
 * Initializing the selectorsMap.
 * e.g: 
 * {
 *   '_id': {
 *     'a@b.com': {'_id': 1,'email': 'a@b.com'},
 *     'c@d.com': {'_id': 2,'email': 'c@d.com'}
 *   },
 *   'email': {
 *     '1': {'_id': 1,'email': 'a@b.com'},
 *     '2': {'_id': 2,'email': 'c@d.com'}
 *   }
 * }
 * 
 * @param {Array} SELECTORS array of selectors e.g ['_id', 'email']
 */
exports.initMap = function (SELECTORS) {
    const hashMap = {}
    for (let selector of SELECTORS) {
        hashMap[selector] = {}
    }
    return hashMap
}

/**
 * Returns the dupObj to be reconciled for selector and latestRecord to be updated.
 * 
 * @param {Object} record each record from the leads.json
 * @param {Number} recordNumber recordnumner for each new record input
 * @param {Array} SELECTORS e.g ['_id', 'email']
 * @param {Map} selectorsMap map of selectors as described in initMap()
 */
exports.getDuplicateObj = function (record, recordNumber, SELECTORS, selectorsMap) {
    const dupObj = {
        'by': [],
        'latestRecord': record,
        'oldRecord': null
    }

    const recordDate = new Date(record.entryDate).getTime()
    for (let selector of SELECTORS) {
        const key = record[selector]
        const selectedMap = selectorsMap[selector]
        const value = selectedMap[key]
        this.updateDupObjByLatestDate(value, recordDate, dupObj, selector)
    }
    
    this.printChangeLog(recordNumber, dupObj)
    return dupObj
}

 /**
 * Update the dupObject based on latest entryDate and dupObj.by['_id' or 'email' or both]
 * 
 * @param {Object} value found duplicate record
 * @param {Number} recordDate newRecord entryDtae
 * @param {Object} dupObj duplicate Obj to be updated
 * @param {String} selector either '_id' or 'email'
 */
exports.updateDupObjByLatestDate = function (value, recordDate, dupObj, selector) {
    if (value !== undefined && value !== null) {
        dupObj['oldRecord'] = value
        const valueDate = new Date(value.entryDate).getTime()
        if (valueDate > recordDate) {
            dupObj.latestRecord = value
        }
        dupObj.by.push(selector)
    }
}

/**
 * It prints all the change log.
 * 
 * @param {Number} recordNumber New record number
 * @param {Object} dupObj Duplicate Object that is found
 */
exports.printChangeLog = function (recordNumber, dupObj) {
    logger.info(`Reconcilation for recordNumber[${recordNumber}] is as below: `)
    if (dupObj.by.length == 0) {
        logger.info(`NEW RECORD with recordNumber[${recordNumber}] is unique.`)
        logger.info('=========================================================')
    } else {
        logger.info(`Latest CHANGE in record for duplicate selector - ${dupObj.by}:`)
        for(let key of dupObj.by) {
            logger.info(dupObj.latestRecord[key] + ' for entryDate - ' + dupObj.latestRecord.entryDate)
        }
        for (let key of Object.keys(dupObj.latestRecord)) {
            const oldValue = dupObj.oldRecord[key]
            const newValue = dupObj.latestRecord[key]
            if (oldValue !== newValue) {
                logger.info(`Value for changed key: [${key}] from ${oldValue} to ${newValue}`)
            }
        }
        logger.info('=========================================================')
    }
}

/**
 * Dedups all the selectorMap with the latest record.
 * 
 * @param {Object} dupObj found dupObject with dupObj.by and latestRecord to be updated.
 * @param {Map} selectorsMap map of selectors as described in initMap()
 * @param {Array} SELECTORS e.g ['_id', 'email']
 */
exports.deDup = function (dupObj, selectorsMap, SELECTORS) {
    const dupSelectors = dupObj.by
    const record = dupObj.latestRecord
    const delSelector = dupSelectors[0]
    let delSelectorObj = null
    if (delSelector !== undefined) {
        const delSelectorKey = record[delSelector]
        delSelectorObj = selectorsMap[delSelector][delSelectorKey]
    }

    for (let selector of SELECTORS) {
        let keyInRcd = record[selector]
        this.delFromOtherSelectorMap(dupSelectors, selector, delSelectorObj, selectorsMap)
        selectorsMap[selector][keyInRcd] = record
    }
}

/**
 * Delets the duplicate record from all the selectorsMap[non-dupSelector]
 * 
 * @param {Array} dupSelectors all the, duplicate by selectors. Found from dupObj.by
 * @param {String} selector each selector ['_id' or 'email']
 * @param {Object} delSelectorObj helper to find key of selectorsMap[non-dupSelector] to be deleted.
 * @param {Map} selectorsMap map of selectors as described in initMap()
 */
exports.delFromOtherSelectorMap = function (dupSelectors, selector, delSelectorObj, selectorsMap) {
    /** 
     * If number of dupSelectors is empty, do nothing.
     * Else remove entry from all the selectorsMap[non-dupSelector].
     */
    if (dupSelectors.length !== 0) {
        for (let dupSelector of dupSelectors) {
            if (dupSelector !== selector) {
                const delKey = delSelectorObj[selector]
                delete selectorsMap[selector][delKey]
            }
        }
    }
}