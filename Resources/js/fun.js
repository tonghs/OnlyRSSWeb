function getFeedByUrl(url, id){
    $.ajax({
        url: '/get_feed_content?url=' + url + '&id=' + id
    }).done(function (data){
            arrObj = JSON.parse(data);
            $('#content').empty();
            for (var i = 0; i < arrObj.length; i++){
                $('#content').append('<div>' + arrObj[i].fields.title + '</div>'
                    + '<div>' + arrObj[i].fields.content + '</div>')
            }
        });
}