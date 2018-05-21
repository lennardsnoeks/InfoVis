let yearsArray = [];

const url = new URL(window.location.href);
let iso = url.searchParams.get("iso");
let years = url.searchParams.get("years");
let country, type;

$(document).ready(function() {
    if(years != null && years.length > 0) {
        yearsArray = years.split(",");
        for (let i in yearsArray) {
            $('#tags').tagsinput('add', yearsArray[i]);
        }
    } else {
        $('#tags').tagsinput('add', "Alle jaren");
    }

    // If user navigates with the nav bar to this page, data from first country in database is shown
    if (iso == null) {
        // Get ISO from first country in list
        $.get('http://localhost:3000/country/all', {} , function (data) {
            iso = data[0]['iso'];
            drawVisualisation(iso, yearsArray);
        });
    } else {
        drawVisualisation(iso, yearsArray);
    }

    // Dynamically fill years
    $.get('http://localhost:3000/years', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="#">' + item["years"] + '</a></li>');
        });

        $('#dropdown-year').append(items.join(''));
    });

    // Dynamically fill countries
    $.get('http://localhost:3000/country/all', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            if(item['iso'] == iso) {
                $("#title").html("Studenten informatie over " + item["land"]);
            }

            items.push("<option value='" + item["iso"] + "'>" + item["land"] + "</option>");
        });

        $('#dropdown-country').html(items);
        $('#dropdown-country').selectpicker('refresh');

        $('select[name=ddc]').val(iso);
        $('.selectpicker').selectpicker('refresh');
    });

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input").on("click", "#dropdown-year li", function(){
        $('#tags').tagsinput('add', $(this).text());
        yearsArray.push($(this).text());
        $('#tags').tagsinput('remove', "Alle jaren");

        drawVisualisation(iso, yearsArray);
    });

    $('#dropdown-country').change(function(){
        iso = $(this).val();

        let text =$("#dropdown-country option:selected").text();
        $("#title").html("Studenten informatie over " + text);

        drawVisualisation(iso, yearsArray);
    });

    $('#deleteFilters').on('click', function() {
        $('#tags').tagsinput('removeAll');
        $('#tags').tagsinput('add', "Alle jaren");

        yearsArray = [];

        drawVisualisation(iso, yearsArray);
    });

    $('#tags').on('itemRemoved', function(event) {
        let index = $.inArray(event.item, yearsArray);
        if(index !== -1) {
            yearsArray.splice(index, 1);

            if(yearsArray.length == 0) {
                $('#tags').tagsinput('add', "Alle jaren");
            }

            drawVisualisation(iso, yearsArray);
        }
    });
});