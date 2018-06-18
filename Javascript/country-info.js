let yearsArray = [];
let typesArray = [];

const url = new URL(window.location.href);
let iso = url.searchParams.get("iso");
let iso2 = "";
let years = url.searchParams.get("years");
let country, type;

$(document).ready(function() {
    if(years != null && years.length > 0) {
        yearsArray = years.split(",");
        for (let i in yearsArray) {
            $('#tagsDivide').tagsinput('add', yearsArray[i]);
        }
    } else {
        $('#tagsDivide').tagsinput('add', "Alle jaren");
    }

    // If user navigates with the nav bar to this page, data from first country in database is shown
    if (iso == null) {
        // Get ISO from first country in list
        $.get('http://localhost:3000/country/all', {} , function (data) {
            iso = data[0]['iso'];
            drawVisualisation(iso, yearsArray);
            fillDropdownEvolution(iso);
        });
    } else {
        drawVisualisation(iso, yearsArray);
        fillDropdownEvolution(iso);
    }

    // Dynamically fill years
    $.get('http://localhost:3000/years', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="javascript:void(0)">' + item["years"] + '</a></li>');
        });

        $('#dropdown-year').append(items.join(''));
    });

    // Dynamically fill countries
    $.get('http://localhost:3000/country/all', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push("<option value='" + item["iso"] + "'>" + item["land"] + "</option>");
        });

        $('#dropdown-country').html(items);
        $('#dropdown-country').selectpicker('refresh');

        $('#dropdown-country-2').html(items);
        $('#dropdown-country-2').selectpicker('refresh');

        $('select[name=ddc]').val(iso);
        $('.selectpicker').selectpicker('refresh');
    });

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input-divide").on("click", "#dropdown-year li", function(){
        $('#tagsDivide').tagsinput('add', $(this).text());
        yearsArray.push($(this).text());
        $('#tagsDivide').tagsinput('remove', "Alle jaren");

        drawVisualisation(iso, yearsArray);

        if($('#comparison-row').css('display') === 'block')
        {
            drawVisualisation2(iso, yearsArray);
        }
    });

    $('#dropdown-country').change(function(){
        iso = $(this).val();

        drawVisualisation(iso, yearsArray);
        fillDropdownEvolution(iso);
    });

    $('#dropdown-country-2').change(function(){
        iso2 = $(this).val();

        $('#comparison-row').css("display", "block");
        $('#bottom-info').css("display", "flex");

        drawVisualisation2(iso, yearsArray);
    });

    $('#deleteComparison').on('click', function() {
        $('#comparison-row').css("display", "none");
        $('#bottom-info').css("display", "none");

        iso2 = "";

        drawEvolution(iso, iso2, typesArray);
    });

    $('#deleteFiltersDivide').on('click', function() {
        $('#tagsDivide').tagsinput('removeAll');
        $('#tagsDivide').tagsinput('add', "Alle jaren");

        yearsArray = [];

        drawVisualisation(iso, yearsArray);

        if($('#comparison-row').css('display') === 'block')
        {
            drawVisualisation2(iso, yearsArray);
        }
    });

    $('#tagsDivide').on('itemRemoved', function(event) {
        let index = $.inArray(event.item, yearsArray);
        if(index !== -1) {
            yearsArray.splice(index, 1);

            if(yearsArray.length === 0) {
                $('#tagsDivide').tagsinput('add', "Alle jaren");
            }

            drawVisualisation(iso, yearsArray);

            if($('#comparison-row').css('display') === 'block')
            {
                drawVisualisation2(iso, yearsArray);
            }
        }
    });

    // EVOLUTION PART OF COUNTRY INFO

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input-evolution").on("click", "#dropdown-sort-edu li", function(){
        $('#tagsEvolution').tagsinput('add', $(this).text());
        typesArray.push($(this).text());
        $('#tagsEvolution').tagsinput('remove', "Elk type opleiding");

        drawEvolution(iso, iso2, typesArray)
    });

    $('#tagsEvolution').on('itemRemoved', function(event) {
        let index = $.inArray(event.item, typesArray);
        if(index !== -1) {
            typesArray.splice(index, 1);

            if(typesArray.length === 0) {
                $('#tagsEvolution').tagsinput('add', "Elk type opleiding");
            }

            drawEvolution(iso, iso2, typesArray)
        }
    });

    $('#deleteFiltersEvolution').on('click', function() {
        $('#tagsEvolution').tagsinput('removeAll');
        $('#tagsEvolution').tagsinput('add', "Elk type opleiding");

        typesArray = [];

        drawEvolution(iso, iso2, typesArray)
    });
});

function fillDropdownEvolution(iso) {
    $('#tagsEvolution').tagsinput('remove', "Elk type opleiding");
    $('#tagsEvolution').tagsinput('add', "Elk type opleiding");

    $("#dropdown-sort-edu").empty();

    // Dynamically add types for dropdown evolution
    $.get('http://localhost:3000/countrytypes/' + iso, {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="javascript:void(0)">' + item["type"] + '</a></li>');
        });

        $('#dropdown-sort-edu').append(items.join(''));
    });
}