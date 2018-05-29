let yearsArray = [];
let typesArray = [];
let fieldsArray = [];
let evolutionArray = [];

$(document).ready(function () {
    $('#tags').tagsinput('add', "Alle jaren");
    $('#tags').tagsinput('add', "Elk type opleiding");
    $('#tags').tagsinput('add', "Alle opleidingen");
    $('#tagsEvolution').tagsinput('add', "Elk type opleiding");

    // Dynamically fill years
    $.get('http://localhost:3000/years', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="javascript:void(0)">' + item["years"] + '</a></li>');
        });

        $('#dropdown-year').append(items.join(''));
    });

    // Dynamically fill types
    $.get('http://localhost:3000/types', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="javascript:void(0)">' + item["type"] + '</a></li>');
        });

        $('#dropdown-sort-edu').append(items.join(''));
        $('#dropdown-sort-edu-evo').append(items.join(''));
    });

    // Dynamically fill fields
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
    $("#filter-input").on("click", "#dropdown-year li", function () {
        $('#tags').tagsinput('add', $(this).text());
        $('#tags').tagsinput('remove', "Alle jaren");

        let year = $(this).text();
        if ($.inArray(year, yearsArray) === -1) {
            yearsArray.push(year);
        }

        fillWorldmap();
    });

    $("#filter-input").on("click", "#dropdown-sort-edu li", function () {
        $('#tags').tagsinput('add', $(this).text());
        $('#tags').tagsinput('remove', "Elk type opleiding");

        let type = $(this).text();
        if ($.inArray(type, typesArray) === -1) {
            typesArray.push(type);
        }

        fillWorldmap();
    });

    $('#dropdown-edu').change(function () {
        $('#tags').tagsinput('add', $(this).val());
        $('#tags').tagsinput('remove', "Alle opleidingen");

        /*let field = $(this).text();
        if($.inArray(field, fieldsArray) === -1) {*/
        let field = $(this).val();
        if ($.inArray(field, fieldsArray) === -1) {
            fieldsArray.push(field);
        }

        $("option:selected").prop("selected", false);

        fillWorldmap();
    });

    // Delete the tags and filters, reset the original data
    $('#deleteFilters').on('click', function () {
        $('#tags').tagsinput('removeAll');
        $('#tags').tagsinput('add', "Alle jaren");
        $('#tags').tagsinput('add', "Elk type opleiding");
        $('#tags').tagsinput('add', "Alle opleidingen");

        yearsArray = [];
        typesArray = [];
        fieldsArray = [];

        fillWorldmap();
    });

    $('#tags').on('itemRemoved', function (event) {
        removeTag(event.item, yearsArray, "Alle jaren");
        removeTag(event.item, typesArray, "Elk type opleiding");
        removeTag(event.item, fieldsArray, "Alle opleidingen");
    });

    $('#table-country').bootstrapTable({});

    fillWorldmap();
    drawEvolution(typesArray);

    // Evolution stuff

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input-evolution").on("click", "#dropdown-sort-edu-evo li", function () {
        $('#tagsEvolution').tagsinput('add', $(this).text());
        evolutionArray.push($(this).text());
        $('#tagsEvolution').tagsinput('remove', "Elk type opleiding");

        drawEvolution(evolutionArray)
    });

    $('#tagsEvolution').on('itemRemoved', function (event) {
        let index = $.inArray(event.item, evolutionArray);
        if (index !== -1) {
            evolutionArray.splice(index, 1);

            if (evolutionArray.length === 0) {
                $('#tagsEvolution').tagsinput('add', "Elk type opleiding");
            }

            drawEvolution(evolutionArray)
        }
    });

    $('#deleteFiltersEvolution').on('click', function () {
        $('#tagsEvolution').tagsinput('removeAll');
        $('#tagsEvolution').tagsinput('add', "Elk type opleiding");

        evolutionArray = [];

        drawEvolution(evolutionArray)
    });

    $("#kaart").on('focus', function () {
        $("#table-wrapper").css("display", "none");
        $("#worldmap-wrapper").css("display", "block");
        fillWorldmap();
    });

    $("#tabel").on('focus', function () {
        $("#worldmap-wrapper").css("display", "none");
        $("#table-wrapper").css("display", "block");
    });
});

function removeTag(item, array, defaultTag) {
    let index = $.inArray(item, array);
    if (index !== -1) {
        array.splice(index, 1);

        if (array.length === 0) {
            $('#tags').tagsinput('add', defaultTag);
        }

        fillWorldmap();
    }
}

function fillWorldmap() {
    let apiCall = 'http://localhost:3000/worldmap?';

    if (yearsArray.length > 0) {
        apiCall = apiCall + "years=" + yearsArray.join() + "&";
    }

    if (typesArray.length > 0) {
        apiCall = apiCall + "types=" + typesArray.join() + "&";
    }

    if (fieldsArray.length > 0) {
        apiCall = apiCall + "fields=" + fieldsArray.join() + "&";
    }

    $.get(apiCall, {}, function (data) {
        let max = Math.max.apply(Math, data.map(function (item) {
            return item["amount"];
        }));

        if (max == "-Infinity") {
            $('#max').html("0");
        } else {
            $('#max').html(max);
        }

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

        // Modify data to represent flags
        data.forEach(function (d) {
            /*d.iso = "<img class='icon' src='flags/" + d.iso + ".svg'/>";*/
            let link = "http://localhost:63342/InfoVis/country-info.html?"
                + "iso=" + d.iso
                + "&years=" + yearsArray.join();

            d.land = "<a href=" + link + ">" + d.land + "</a>";
            d.iso = "<img class='icon' src='flags/" + d.iso + ".svg' width='35' height='20'/>";
        });

        fillTable(data);
    });
}

function fillTable(data) {
    $('#table-country').bootstrapTable("load", data);
    $('#table-country').bootstrapTable("load", {});
    $('#table-country').bootstrapTable("load", data);
}

function createMap(dataset) {
    $('#worldmap').empty();

    let amount;
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
                amount = "0";

                if (data != null) {
                    amount = data.students;
                }

                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Students: <strong>', amount, '</strong>',
                    '</div>'].join('');
            }
        },
        done: function (datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function (geography) {
                if (parseInt(amount) !== 0) {
                    window.location.href = "http://localhost:63342/InfoVis/country-info.html?"
                        + "iso=" + geography.properties.iso
                        + "&years=" + yearsArray.join()
                }
            });

        }
    });

    map.legend();

    window.addEventListener('resize', function () {
        map.resize();
    });
}