# Dedup
Reconcilation of records.

## Programming Challenge:

 Take a variable number of identically structured json records and de-duplicate the set.

 An example file of records is given in the accompanying 'leads.json'. Output should be same format, with dups reconciled according to the following rules:

1. The data from the newest date should be preferred

2. duplicate IDs count as dups. Duplicate emails count as dups. Both must be unique in our dataset. Duplicate values elsewhere do not count as dups.

3. If the dates are identical the data from the record provided last in the list should be preferred

 Simplifying assumption: the program can do everything in memory (don't worry about large files)

The application should also provide a log of changes including some representation of the source record, the output record and the individual field changes (value from and value to) for each field.

## Solution:
* STEP 1:
    * `npm install`

* STEP 2:
    * `npm start`

### Output files as below:
* `change.log` - logs all the chnages for reconciliation and chnage of modified fields during the process.
* `reconciled-records.json` - Holds the reconciled records.
