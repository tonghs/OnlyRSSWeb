$(document).ready(function(){
    showLoad('正在加载...');
    $(window).resize(setHeightAndWidth);
    setHeightAndWidth();
    $.ajax({
        url: '/get_all_feed_list'
    }).done(function (data){
            arrObj = JSON.parse(data);
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_list ul').append('<li class="feed" onclick=\"getFeedByUrl(\''
                    + arrObj[i].fields.feed_url + '\', ' + arrObj[i].pk + ', this)\">'
                    + '<div class="feed_item">'
                    + arrObj[i].fields.title + '</div></li>')
            }
        });

    $('#content').empty();
    $.ajax({
        url: '/get_all_feed_content'
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
    closeLoad();
});