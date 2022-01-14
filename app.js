const express = require('express');
const app = express();

require ("dotenv").config();

app.listen(4000, () => console.log("listening at port 4000"));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

app.post('/api', (request, response) => {
    console.log("got the request!");
    console.log(request.body);
    response.json({
        status:'success',
        latitude: request.body.lat,
        longitude: request.body.lon

    });
})

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.API_KEY}).base(process.env.BASE_KEY);

var DATA = [];
var value;

const data = base('data');

base('data').select({
    maxRecords: 999,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
        DATA.push({
            id: record.id,
            name: record.get("Name"),
            url: record.get("URL"),
            time: record.get("Load Time"),
            item1: record.get("item1"),
            item2: record.get("item2")
        })
    });

    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
    console.log(DATA);
});

function newEntry() {
    var value = document.getElementById("name").value;

    const createRecord = async (fields) => {
        const createdRecord = await data.create(fields);
        console.log(createdRecord)
       }
       
       createRecord({
           Name: value
       });
  }