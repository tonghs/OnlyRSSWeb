function getFeedByUrl(url, id, obj){
    $('#content').empty();
    $.ajax({
        url: '/get_feed_content?url=' + url + '&id=' + id
    }).done(function (data){
            arrObj = JSON.parse(data);

            for (var i = 0; i < arrObj.length; i++){
                $('#content').append('<div class="item"><div class="item_title"><a href=" ' + arrObj[i].url + ' " target="_blank">'
                    + arrObj[i].title + '</a></div>'
                    + '<div class="item_content">' + arrObj[i].content + '</div>'
                    + '<div class="item_ops"><a href="' + arrObj[i].feed_url + '" target="_blank">来自:'
                    + arrObj[i].feed_title + '</a>'
                    + '&nbsp;&nbsp;<a href="#">收藏</a></div></div>')
            }
        });
    $('.feed').each(function(){
        $(this).css('background', '');
    });

    obj.style.backgroundColor = '#dddddd';
}


function goto(url){

}