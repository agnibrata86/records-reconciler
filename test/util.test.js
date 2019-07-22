
const util = require('../src/util.js')

const invalidPath = 'lead.json'
const validPath = 'leads.json'
const value1 = undefined
const selector = '_id'
const newRecord = {'_id': 'jkj238238jdsnfsj23', 'email': 'a@b.com', 'firstName': 'John','lastName': 'Smith','address': '888 Mayberry St','entryDate': '2014-05-07T17:34:20+00:00'}
const newRecordDate1 = new Date(newRecord.entryDate).getTime()
const newRecordWithOlderDate = {'_id': 'jkj238238jdsnfsj23', 'email': 'bill@bar.com', 'firstName': 'John','lastName': 'Smith','address': '888 Mayberry St','entryDate': '2014-05-07T17:32:20+00:00'}
const newRecordDate2 = new Date(newRecordWithOlderDate.entryDate).getTime()
const dupObj1 = {'by': [], 'latestRecord': newRecord, 'oldRecord': null}
const dupObj2 = {'by': [], 'latestRecord': newRecordWithOlderDate, 'oldRecord': null}
const value2 = { '_id': 'jkj238238jdsnfsj23','email': 'bill@bar.com','firstName': 'John','lastName': 'Smith','address': '888 Mayberry St','entryDate': '2014-05-07T17:33:20+00:00' }
const selectorsMap = {
    '_id': {1: {'_id': 1,'email': 'a@b.com'},2: {'_id': 2,'email': 'c@b.com'}},
    'email': {'a@b.com': {'_id': 1,'email': 'a@b.com'},'c@b.com': {'_id': 2,'email': 'c@b.com'}}
}
const emptydupSelectors = []
const dupSelectors = ['_id']
const diffDupSels = ['email']
const bothDupSels = ['_id','email']
const delSelectorObj = {'_id': 1,'email': 'a@b.com'}


test('getRecords() - returns empty for invalid path', () => {
    expect(util.getRecords(invalidPath).length).toBe(0);
});

test('getRecords() - returns non-empty for valid path', () => {
    expect(util.getRecords(validPath).length).toBe(10);
});

test('updateDupObjByLatestDate() - dupObj.letestRecord not updated, for invalid value1', () => {
    util.updateDupObjByLatestDate(value1, newRecordDate1, dupObj1, selector)
    expect(dupObj1.by.length).toBe(0);
    expect(dupObj1.latestRecord).toBe(newRecord);
    expect(dupObj1.oldRecord).toBe(null)
});

test('updateDupObjByLatestDate() - dupObj.letestRecord updated with newRecordDate is latest, for valid value2', () => {
    util.updateDupObjByLatestDate(value2, newRecordDate1, dupObj1, selector)
    expect(dupObj1.by.length).toBe(1);
    expect(dupObj1.latestRecord).toBe(newRecord);
    expect(dupObj1.oldRecord).toBe(value2)
});

test('updateDupObjByLatestDate() - dupObj.letestRecord updated with newRecordDate is not latest, for valid value2', () => {
    util.updateDupObjByLatestDate(value2, newRecordDate2, dupObj2, selector)
    expect(dupObj2.by.length).toBe(1);
    expect(dupObj2.latestRecord).toBe(value2);
    expect(dupObj2.oldRecord).toBe(value2)
});

test('delFromOtherSelectorMap() - No change in selectorsMap for empty dupSelectors', () => {
    util.delFromOtherSelectorMap(emptydupSelectors, selector, delSelectorObj, selectorsMap)
    expect(Object.keys(selectorsMap._id).length).toBe(2);
    expect(Object.keys(selectorsMap.email).length).toBe(2);
});

test('delFromOtherSelectorMap() - No change in selectorsMap for _id as dupSelector and selctor', () => {
    util.delFromOtherSelectorMap(dupSelectors, selector, delSelectorObj, selectorsMap)
    expect(Object.keys(selectorsMap._id).length).toBe(2);
    expect(Object.keys(selectorsMap.email).length).toBe(2);
    expect(selectorsMap._id[1]).toBeDefined();
    expect(selectorsMap.email['a@b.com']).toBeDefined();
});

test('delFromOtherSelectorMap() - Delete 1 record from selectorsMap[_id] for email as dupSelector different from selctor', () => {
    util.delFromOtherSelectorMap(diffDupSels, selector, delSelectorObj, selectorsMap)
    expect(Object.keys(selectorsMap._id).length).toBe(1);
    expect(Object.keys(selectorsMap.email).length).toBe(2);
    expect(selectorsMap._id['1']).toBeUndefined();
    expect(selectorsMap.email['a@b.com']).toBeDefined();
});

test('delFromOtherSelectorMap() - Delete 1 record from selectorsMap[_id] for [_id,email] as dupSelectors and _id selctor', () => {
    util.delFromOtherSelectorMap(bothDupSels, selector, delSelectorObj, selectorsMap)
    expect(Object.keys(selectorsMap._id).length).toBe(1);
    expect(Object.keys(selectorsMap.email).length).toBe(2);
    expect(selectorsMap._id['1']).toBeUndefined();
    expect(selectorsMap.email['a@b.com']).toBeDefined();
});