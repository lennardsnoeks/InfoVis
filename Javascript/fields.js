$(document).ready(function() {
    let typeform = document.getElementById('type-form');

    $.get('http://localhost:3000/types', {}, function (data) {
        data.forEach(function (item) {
            typeform.options[typeform.options.length] = new Option(item["type"], item["type"]);
        });

        typeChanged();
    });
});

function typeChanged() {
    let fieldform = document.getElementById('field-form');
    let type = document.getElementById("type-form").value;

    clearFormOptions(fieldform);

    $.get('http://localhost:3000/fields/' + type, {}, function (data) {
        console.log(data);
        data.forEach(function (item) {
            fieldform.options[fieldform.options.length] = new Option(item["field"], item["field"]);
        });
    });
}

function fieldChanged() {

}

function clearFormOptions(form) {
    for(let i = form.options.length - 1 ; i >= 0 ; i--) {
        form.remove(i);
    }
}
