const url = new URL(window.location.href);
let subject = url.searchParams.get("subject");

$(document).ready(function() {

    $.get('http://localhost:3000/fields', {}, function (data) {
        let items = [];

        if(subject == null){
            subject = data[0]['field'];
        }

        $.each(data, function (i, item) {
            items.push("<option value='" + item["field"] + "'>" + item["field"] + "</option>");
        });

        $('#dropdown-subject').html(items);
        $('#dropdown-subject').selectpicker('refresh');

        $('select[name=ddc]').val(subject);
        $('.selectpicker').selectpicker('refresh');
    });

});