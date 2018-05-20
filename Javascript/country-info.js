let yearsArray = [];

const url = new URL(window.location.href);
let year = url.searchParams.get("year");
let country, iso, type;

// If user navigates with the nav bar to this page, data from first country in database is shown
if (url.searchParams.get("iso") == null) {
    // Get ISO from first country in list
    $.get('http://localhost:3000/countryiso/all', {} , function (data) {
        let item = data[0];
        iso = item["iso"];

        // Get types selected country
        $.get('http://localhost:3000/typesiso/' + iso, {} , function (data) {
            let item = data[0];
            type = item["type"];

            if (url.searchParams.get("country") == null) {
                $.get('http://localhost:3000/country/all', {} , function (data) {
                    let item = data[0];
                    country = item["land"];

                    drawDonut(iso);
                    updateBarChart(type, iso);
                });
            } else {
                country = url.searchParams.get("country");

                drawDonut(iso);
                updateBarChart(type, iso);
            }
        });
    });
} else {
    iso = url.searchParams.get("iso");

    // Get types selected country
    $.get('http://localhost:3000/typesiso/' + iso, {} , function (data) {
        let item = data[0];
        type = item["type"];

        if (url.searchParams.get("country") == null) {
            $.get('http://localhost:3000/country/all', {} , function (data) {
                let item = data[0];
                country = item["land"];

                drawDonut(iso);
                updateBarChart(type, iso);
            });
        } else {
            country = url.searchParams.get("country");

            drawDonut(iso);
            updateBarChart(type, iso);
        }
    });
}

$(document).ready(function() {
    console.log(country, iso, type);

    $('#tags').tagsinput('add', "Alle jaren");

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

        if(year != null) {
            $('#tags').tagsinput('add', year);
        }

        if(country == null) {
            let c = data[0];
            $("#title").html("Studenten informatie over " + c["land"]);
        } else {
            $("#title").html("Studenten informatie over " + country);
        }

        $.each(data, function (i, item) {
            items.push('<option>' + item["land"] + '</option>');
        });

        $('#dropdown-country').html(items);
        $('#dropdown-country').selectpicker('refresh');

        $('select[name=ddc]').val(country);
        $('.selectpicker').selectpicker('refresh');
    });

    // Add tags when user selects them, also add them to internal array. When user clicks search these parameters
    // are used to retrieve the data
    $("#filter-input").on("click", "#dropdown-year li", function(){
        $('#tags').tagsinput('add', $(this).text());
        yearsArray.push($(this).text());
        $('#tags').tagsinput('remove', "Alle jaren");
        year = $(this).text();
    });

    $('#dropdown-country').change(function(){
        country = $(this).val();
    });

    $('#deleteFilters').on('click', function() {
        $('#tags').tagsinput('removeAll');
        $('#tags').tagsinput('add', "Alle jaren");

        yearsArray = [];

        year = "Alle jaren";
    });
});