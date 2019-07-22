

const recordsJson = `{"leads":[{"_id":"jkj238238jdsnfsj23","email":"foo@bar.com","firstName":"John","lastName":"Smith","address":"123 Street St","entryDate":"2014-05-07T17:30:20+00:00"},{"_id":"edu45238jdsnfsj23","email":"mae@bar.com","firstName":"Ted","lastName":"Masters","address":"44 North Hampton St","entryDate":"2014-05-07T17:31:20+00:00"},{"_id":"wabaj238238jdsnfsj23","email":"bog@bar.com","firstName":"Fran","lastName":"Jones","address":"8803 Dark St","entryDate":"2014-05-07T17:31:20+00:00"},{"_id":"jkj238238jdsnfsj23","email":"coo@bar.com","firstName":"Ted","lastName":"Jones","address":"456 Neat St","entryDate":"2014-05-07T17:32:20+00:00"},{"_id":"sel045238jdsnfsj23","email":"foo@bar.com","firstName":"John","lastName":"Smith","address":"123 Street St","entryDate":"2014-05-07T17:32:20+00:00"},{"_id":"qest38238jdsnfsj23","email":"foo@bar.com","firstName":"John","lastName":"Smith","address":"123 Street St","entryDate":"2014-05-07T17:32:20+00:00"},{"_id":"vug789238jdsnfsj23","email":"foo1@bar.com","firstName":"Blake","lastName":"Douglas","address":"123 Reach St","entryDate":"2014-05-07T17:33:20+00:00"},{"_id":"wuj08238jdsnfsj23","email":"foo@bar.com","firstName":"Micah","lastName":"Valmer","address":"123 Street St","entryDate":"2014-05-07T17:33:20+00:00"},{"_id":"belr28238jdsnfsj23","email":"mae@bar.com","firstName":"Tallulah","lastName":"Smith","address":"123 Water St","entryDate":"2014-05-07T17:33:20+00:00"},{"_id":"jkj238238jdsnfsj23","email":"bill@bar.com","firstName":"John","lastName":"Smith","address":"888 Mayberry St","entryDate":"2014-05-07T17:33:20+00:00"}]}`
const records = JSON.parse(recordsJson).leads
const startNow = new Date().getTime()
console.log(`Programme start @ ${startNow}`)
const outrecords = []
// console.log(`records.length = ${records.length}`)

for (let i = 0; i < records.length; i ++) {
    const record = records[i]
    let isDup = false
    // console.log(`record Num = [${i}] is getting checked.`)
    if (outrecords.length === 0) {
        outrecords.push(record)
        // console.log(`Pushing the first record[${i}] - `, record)
        continue
    }
    for (let j = 0; j < outrecords.length; j++) {
        const outrecord = outrecords[j]
        const outrecordDate = new Date(outrecord.entryDate).getTime()
        const recordDate = new Date(record.entryDate).getTime()
        if (record._id === outrecord._id && record.email === outrecord.email) {
            if (outrecordDate <= recordDate) {
                outrecords[j] = record
                // console.log(`For same id[${record._id}] and email[${record.email}] reconciling \n outrecords[${j}] - `, outrecord,` \n with \n records[${i}] - `,record,` \n on \n latest date[${record.entryDate}]`)
            } else {
                // console.log(`No change for outrecords[${j}] - `,outrecord,` \n with \n records[${i}] - `,record)
            }
            isDup = true
            break
        } else if (record._id === outrecord._id) {
            if (outrecordDate <= recordDate) {
                outrecords[j] = record
                // console.log(`For same id[${record._id}] reconciling outrecords[${j}] - `, outrecord,` \n with \n records[${i}] - `,record,` \n on \n latest date[${record.entryDate}]`)
            } else {
                // console.log(`No change for outrecords[${j}] - `,outrecord,` \n with \n records[${i}] - `,record)
            }
            isDup = true
            break
        } else if (record.email === outrecord.email) {
            if (outrecordDate <= recordDate) {
                outrecords[j] = record
                // console.log(`For same email[${record.email}] reconciling outrecords[${j}] - `, outrecord,` \n with \n records[${i}] - `,record,` \n on \n latest date[${record.entryDate}]`)
            } else {
                // console.log(`No change for outrecords[${j}] - `,outrecord,` \n with \n records[${i}] - `,record)
            }
            isDup = true
            break
        }
    }

    if (!isDup) {
        outrecords.push(record)
        // console.log(`Pushing the new unique record[${i}] - `, record)
    }
}

const endNow = new Date().getTime()
console.log(`Programme start @ ${endNow}`)
// console.log(outrecords)
