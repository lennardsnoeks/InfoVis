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

    let sql = 'SELECT iso, land, COUNT(*) as amount FROM dataset WHERE ' + sql_years + ' AND ' + sql_types + ' AND ' + sql_fields + ' GROUP BY iso';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// COUNTRY PAGE
app.get('/country/all', function(req, res){
    let sql = 'SELECT DISTINCT land, iso FROM dataset ORDER BY land ASC';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/countrytype', function(req, res){
    let iso = req.query.iso;
    let years = req.query.years;
    let items = [];

    let sql_years = "1=1";

    if(years.length > 0) {
        items = years.split(",");
        sql_years = 'inschrijving IN ' + '("' + items.join('","') + '")';
    }

    let sql = 'SELECT type, COUNT(*) as amount FROM dataset WHERE iso = "' + iso + '" AND ' + sql_years + ' GROUP BY type';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/name/:iso', function(req, res) {
    let iso = req.params.iso;

    let sql = 'SELECT DISTINCT land FROM dataset WHERE iso = ?';

    db.all(sql, [iso],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/countrytypes/:iso', function(req, res) {
    let iso = req.params.iso;

    let sql = 'SELECT DISTINCT type FROM dataset WHERE iso = ?';

    db.all(sql, [iso],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/countryfields', function(req, res){
    let iso = req.query.iso;
    let type = req.query.type;
    let years = req.query.years;
    let items = [];

    let sql_years = "1=1";

    if(years.length > 0) {
        items = years.split(",");
        sql_years = 'inschrijving IN ' + '("' + items.join('","') + '")';
    }

    let sql = 'SELECT opleiding, COUNT(*) as amount FROM dataset WHERE iso = "' + iso + '" AND type = "'
        + type + '" AND ' + sql_years + ' GROUP BY opleiding ORDER BY COUNT(*) DESC';

    db.all(sql, [],(err, rows) => {
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

app.get('/amountyearscountrytype', function(req, res){
    let iso = req.query.iso;
    let types = req.query.types;
    let items = [];

    let sql_types = "1=1";

    if(types.length > 0) {
        items = types.split(",");
        sql_types = 'type IN ' + '("' + items.join('","') + '")';
    }

    let sql = 'SELECT inschrijving as year, COUNT(*) as amount FROM dataset WHERE iso = "' + iso + '" AND ' + sql_types + ' GROUP BY year';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.get('/amountyearsworldtype', function(req, res){
    let types = req.query.types;
    let items = [];

    let sql_types = "1=1";

    if(types.length > 0) {
        items = types.split(",");
        sql_types = 'type IN ' + '("' + items.join('","') + '")';
    }

    let sql = 'SELECT inschrijving as year, COUNT(*) as amount FROM dataset WHERE ' + sql_types + ' GROUP BY year';

    db.all(sql, [],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

// Get count for each year for certain country
app.get('/amountyearsworld', function(req, res) {
    let sql = 'SELECT inschrijving as year, COUNT(*) as amount FROM dataset GROUP BY year';

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

// Get all available types for certain country (Master, Doctoraat, ...)
app.get('/typesiso/:iso', function(req, res){
    let iso = req.params.iso;

    let sql = 'SELECT DISTINCT type FROM dataset WHERE iso = ?';

    db.all(sql, [iso],(err, rows) => {
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

// Get amount of males and females of a field
app.get('/gender/count/:field', function(req, res){
    let field = req.params.field;

    let sql = 'SELECT land as country, COUNT(CASE WHEN geslacht = ? THEN 1 END) male, COUNT(CASE WHEN geslacht = ? THEN 1 END) female FROM dataset WHERE opleiding = ?';

    db.all(sql, ['M', 'V', field],(err, rows) => {
        if (err) {
            throw err;
        }

        let male  = { gender: 'Man', amount: rows[0].male };
        let female = { gender: 'Vrouw', amount: rows[0].female };
        let data = [male, female];
        res.send(JSON.parse(JSON.stringify(data))); //replace with your data
    });
});

app.get('/gender/:field', function(req, res) {
    let field = req.params.field;

    let sql = 'SELECT land as country, COUNT(CASE WHEN geslacht = ? THEN 1 END) male, COUNT(CASE WHEN geslacht = ? THEN 1 END) female FROM dataset WHERE opleiding = ? GROUP BY country';

    db.all(sql, ['M', 'V', field],(err, rows) => {
        if (err) {
            throw err;
        }

        res.send(JSON.parse(JSON.stringify(rows))); //replace with your data
    });
});

app.listen(3000);