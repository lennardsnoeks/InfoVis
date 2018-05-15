let yearsArray = [];
let typesArray = [];
let fieldsArray = [];

$(document).ready(function() {
    // Dynamically fill years
    $.get('http://localhost:3000/years', {}, function (data) {
        let items = [];

        $.each(data, function(i, item) {
            items.push('<li><a href="#">' + item["years"] + '</a></li>');
        });

        $('#dropdown-year').append( items.join('') );
    });

    // Dynamically fill types
    $.get('http://localhost:3000/types', {}, function (data) {
        let items = [];

        $.each(data, function(i, item) {
            items.push('<li><a href="#">' + item["type"] + '</a></li>');
        });

        $('#dropdown-sort-edu').append( items.join('') );
    });

    // Dynamically fill fields
    $('#dropdown-edu').append('<option>1</option>');
    $.get('http://localhost:3000/fields', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<option>' + item["field"] + '</option>');
        });

        $('#dropdown-edu').html(items);
        $('#dropdown-edu').selectpicker('refresh');
    });

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input").on("click", "#dropdown-year li", function(){
        $('#tags').tagsinput('add', $(this).text());
        yearsArray.push($(this).text());
        fillWorldmap();
    });

    $("#filter-input").on("click", "#dropdown-sort-edu li", function(){
        $('#tags').tagsinput('add', $(this).text());
        typesArray.push($(this).text());
        fillWorldmap();
    });

    $('#dropdown-edu').change(function(){
        $('#tags').tagsinput('add', $(this).val());
        fieldsArray.push($(this).val());
        fillWorldmap();
    });

    // Initiate the retrieval of data
    $('#searchFilters').on('click', function() {

    });

    // Delete the tags and filters, reset the original data
    $('#deleteFilters').on('click', function() {
        $('#tags').tagsinput('removeAll');
        yearsArray = [];
        typesArray = [];
        fieldsArray = [];

        fillWorldmap();
    });

    $('#tags').on('itemRemoved', function(event) {
        let index = $.inArray(event.item, yearsArray);
        if(index !== -1) {
            yearsArray.splice(index, 1);
        }
        index = $.inArray(event.item, typesArray);
        if(index !== -1) {
            typesArray.splice(index, 1);
        }
        index = $.inArray(event.item, fieldsArray);
        if(index !== -1) {
            fieldsArray.splice(index, 1);
        }

        fillWorldmap();
    });

    fillWorldmap();
});

function fillWorldmap() {
    let apiCall = 'http://localhost:3000/worldmap?';

    if(yearsArray.length > 0) {
        apiCall = apiCall + "years=" + yearsArray.join() + "&";
    }

    if(typesArray.length > 0) {
        apiCall = apiCall + "types=" + typesArray.join() + "&";
    }

    if(fieldsArray.length > 0) {
        apiCall = apiCall + "fields=" + fieldsArray.join() + "&";
    }

    $.get(apiCall, {}, function (data) {
        let max = Math.max.apply(Math, data.map(function (item) {
            return item["amount"];
        }));

        let sum = d3.sum(data, function(d){return parseFloat(d.amount);});

        let paletteScale = d3.scale.linear()
            .domain([0, max])
            .range(["#ffffff", "#ff0006"]);

        let dataset = {};

        data.forEach(function (item) {
            // item example value ["USA", 70]
            let iso = item["iso"];
            let amount = item["amount"];

            dataset[iso] = {students: amount, fillColor: paletteScale(amount)};
        });

        createMap(dataset);
    });
}

function createMap(dataset) {
    $('#worldmap').empty();

    let map = new Datamap({
        element: document.getElementById('worldmap'),
        // countries don't listed in dataset will be painted with this color
        responsive: 'true',
        setProjection: function (element) {
            let projection = d3.geo.equirectangular()
                .center([0, 0])
                .scale((element.offsetWidth - 200) / 2 / Math.PI)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            let path = d3.geo.path()
                .projection(projection);
            return {path: path, projection: projection};
        },
        fills: {defaultFill: '#ffffff'},
        data: dataset,
        geographyConfig: {
            borderColor: '#000000',
            borderWidth: 0.5,
            highlightBorderWidth: 0.8,
            highlightBorderColor: '#000000',
            // don't change color on mouse hover
            highlightFillColor: function (geo) {
                return geo['fillColor'] || '#ffffff';
            },
            popupTemplate: function (geo, data) {
                let amount = "0";

                if(data != null) {
                    amount = data.students;
                }

                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Students: <strong>', amount, '</strong>',
                    '</div>'].join('');
            }
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                window.location.href = "http://localhost:63342/Project_Info_Vis/countryinfo.html?"
                    + "iso=" + geography.properties.iso
                    + "&country=" + geography.properties.name
            });
        }
    });

    window.addEventListener('resize', function (event) {
        map.resize();
    });
}