function getFeedByUrl(url){
    $.ajax({
        url: '/get_feed_content?url=' + url
    }).done(function (data){
            arrObj = JSON.parse(data);
            for (var i = 0; i < arrObj.length; i++){
                $('#content').append('<div>' + arrObj[i].title + '</div>')
            }
        });
}