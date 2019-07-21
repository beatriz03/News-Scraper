$.getJSON("/articles", function (data) {
    for (var i = 0; i < 11; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "<br />");
    }
    $("#articles").append("<button type = 'button' class = 'btn btn-outline-warning' data-id='" + data._id + "' id='clearArticles'>Clear Articles</button>");
});


$(document).on('click', '#clearnote', function() {
    $('#titleinput').empty();
    $('#bodyinput').empty();
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: 'DELETE',
        url: '/articles/' + thisId
    })
        .then(function (data) {
            console.log(data);

        });
});

$(document).on('click', '#savenote', function () {
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: 'POST',
        url: '/articles/' + thisId,
        data: {
            title: $('#titleinput').val(),
            body: $('#bodyinput').val(),
        }
    })
        .then(function (data) {
            console.log(data);

            if (data.note) {
                $('#notesDiv').val(data.note.title);
                $('#notesDiv').val(data.note.body);

            }
        });
});



$(document).on('click', '#clearArticles', function() {
    $('#articles').empty();
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: 'DELETE',
        url: '/articles/' + thisId
    })
        .then(function (data) {
            console.log(data);

        });
});