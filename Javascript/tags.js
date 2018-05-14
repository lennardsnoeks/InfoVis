$( document ).ready(function() {
    $('#dropdown-year li').on('click', function(){
        $('#tags').tagsinput('add', $(this).text());
    });
    $('#dropdown-sort-edu li').on('click', function(){
        $('#tags').tagsinput('add', $(this).text());
    });
    $('#dropdown-edu').change(function(){
        $('#tags').tagsinput('add', $(this).val());
    });
});