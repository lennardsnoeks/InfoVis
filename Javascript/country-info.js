let yearsArray = [];

const url = new URL(window.location.href);
const year = url.searchParams.get("year");
let country = url.searchParams.get("country");
const iso = url.searchParams.get("iso");

$(document).ready(function() {
    $("#title").html("Studenten informatie over " + country);

    $('#tags').tagsinput('add', country);
    $('#tags').tagsinput('add', year);

    // Dynamically fill years
    $.get('http://localhost:3000/years', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<li><a href="#">' + item["years"] + '</a></li>');
        });

        $('#dropdown-year').append(items.join(''));
    });

    // Dynamically fill countries
    $.get('http://localhost:3000/countries/all', {}, function (data) {
        let items = [];

        $.each(data, function (i, item) {
            items.push('<option>' + item["field"] + '</option>');
        });

        $('#dropdown-country').html(items);
        $('#dropdown-country').selectpicker('refresh');
    });

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input").on("click", "#dropdown-year li", function(){
        $('#tags').tagsinput('add', $(this).text());
        yearsArray.push($(this).text());
        $('#tags').tagsinput('remove', "Alle jaren");
    });

    $('#dropdown-country').change(function(){
        $('#tags').tagsinput('remove', country);
        $('#tags').tagsinput('add', $(this).val());
        country = $(this).val();
    });
});