let yearsArray = [];
let typesArray = [];
let fieldsArray = [];

$(document).ready(function() {
    fillWorldmap();

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
    });

    $("#filter-input").on("click", "#dropdown-sort-edu li", function(){
        $('#tags').tagsinput('add', $(this).text());
        typesArray.push($(this).text());
    });

    $('#dropdown-edu').change(function(){
        $('#tags').tagsinput('add', $(this).val());
        fieldsArray.push($(this).val());
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
    });

    $('#tags').on('itemRemoved', function(event) {
        console.log(yearsArray);
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
        console.log(yearsArray);
    });
});

function fillWorldmap() {

}