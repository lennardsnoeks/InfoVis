let sqlite3 = require('sqlite3').verbose();
let express = require('express');
let app = express();

let db = new sqlite3.Database('datasets/dataset.sqlite');

// WORLDMAP PAGE
// e.g localhost:3000/worldmap?years=2013-2014,2014-2015&types=Master
app.get('/worldmap', function(req, res){
    let years = req.query.years;
    let types = req.query.types;
    let fields = req.query.fields;

    let sql_years = "1=1";
    let sql_types = "1=1";
    let sql_fields = "1=1";
    let items = [];

    if(years != null) {
        items = years.split(",");
        sql_years = 'inschrijving IN ' + '("' + items.join('","') + '")';
    }

    if(types != null) {
        items = types.split(",");
        sql_types = 'type IN ' + '("' + items.join('","') + '")';
    }

    if(fields != null) {
        items = fields.split(",");
        sql_fields = 'opleiding IN ' + '("' + items.join('","') + '")';
    }

    let sql = 'SELECT iso, COUNT(*) as amount FROM dataset WHERE ' + sql_years + ' AND ' + sql_types + ' AND ' + sql_fields + ' GROUP BY iso';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// COUNTRY PAGE
app.get('/country/all', function(req, res){
    let sql = 'SELECT DISTINCT land FROM dataset';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/country/:iso', function(req, res){
    let iso = req.params.iso;
    let sql = 'SELECT type, COUNT(*) as amount FROM dataset WHERE iso = ? GROUP BY type';

    db.all(sql, [iso],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/country/:iso/:type', function(req, res){
    let iso = req.params.iso;
    let type = req.params.type;
    let sql = 'SELECT opleiding, COUNT(*) as amount FROM dataset WHERE iso = ? AND type = ? GROUP BY opleiding';

    db.all(sql, [iso, type],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// Get all available years
app.get('/years', function(req, res){
    let sql = 'SELECT DISTINCT inschrijving years FROM dataset';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// Get all available types (Master, Doctoraat, ...)
app.get('/types', function(req, res){
    let sql = 'SELECT DISTINCT type type FROM dataset';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// Get all available fields
app.get('/fields', function(req, res){
    let type = req.params.type;

    let sql = 'SELECT DISTINCT opleiding field FROM dataset';

    db.all(sql, [type],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// Get all fields by specific type
app.get('/fields/:type', function(req, res){
    let type = req.params.type;

    let sql = 'SELECT DISTINCT opleiding field FROM dataset WHERE type = ?';

    db.all(sql, [type],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.listen(3000);