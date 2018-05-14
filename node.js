let sqlite3 = require('sqlite3').verbose();
let express = require('express');
let app = express();

let db = new sqlite3.Database('datasets/dataset.sqlite');

// WORLDMAP PAGE
// e.g localhost:3000/worldmap?years=2013-2014,2014-2015&type=Master
app.get('/worldmap', function(req, res){
    let years = req.query.years;
    let type = req.query.type;
    let field = req.query.field;

    let sql_years = "1=1";
    let sql_type = "1=1";
    let sql_field = "1=1";
    let items = [];
    let count = 0;

    if(years != null) {
        items = years.split(",");
        sql_years = 'inschrijving IN ' + '("' + items.join('","') + '")';
        count = count + 1;
    }

    if(type != null) {
        items = type.split(",");
        sql_type = 'type IN ' + '("' + items.join('","') + '")';
        count = count + 1;
    }

    if(field != null) {
        items = field.split(",");
        sql_field = 'opleiding IN ' + '("' + items.join('","') + '")';
        count = count + 1;
    }

    let sql = 'SELECT iso, COUNT(*) as amount FROM dataset WHERE ' + sql_years + ' AND ' + sql_type + ' AND ' + sql_field + ' GROUP BY iso';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// COUNTRY PAGE
app.get('/country/all', function(req, res){
    let sql = 'SELECT DISTINCT land land, iso iso FROM dataset';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/country/:iso/:year', function(req, res){
    let country = req.params.iso;
    let year = req.params.year + "-" + (parseInt(req.params.year) + 1);

    let sql = 'SELECT type type, opleiding opl FROM dataset WHERE iso = ? AND inschrijving = ?';

    db.all(sql, [country, year],(err, rows) => {
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