function getFeedByUrl(url, id, obj){
    showLoad('正在加载...');
    if (url != null && id != null){
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
    }
    changeBgColor(obj);
    closeLoad();
}

function changeBgColor(obj){
    $('.feed').each(function(){
        $(this).css('background', '');
    });

    obj.style.backgroundColor = '#dddddd';
}

function showLoad(tipInfo) {
    if ($("#tipDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'tipDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.textAlign = 'center';
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.padding = '5px 15px';
        eTip.style.left = ($('html').width() - 190) / 2 + 'px';
        eTip.style.top = ($('html').height() - 10) / 2 + 'px';
        eTip.style.width = '190px';
        eTip.innerHTML = '<span class="loading_logo bold">Only RSS</span>&nbsp;&nbsp;'
            +'<span class="loading">' + tipInfo + '</span>';
        try {
            document.body.appendChild(eTip);
        } catch (e) { }
        $("#tipDiv").css("z-index", "99");
    }

    $('#tipDiv').fadeIn();
}

function closeLoad() {
    $('#tipDiv').fadeOut();
}
function getAllFeedContent(isShowLoading){
    if (isShowLoading){
        showLoad('正在加载...');
    }
    $('#content').empty();
    $.ajax({
        url: '/get_all_feed_content'
    }).done(function (data){
            arrObj = JSON.parse(data);

            for (var i = 0; i < arrObj.length; i++){
                $('#content').append('<div class="item"><div class="item_title"><a href=" ' + arrObj[i].url + ' " target="_blank">'
                    + arrObj[i].title + '</a></div>'
                    + '<div class="item_content">' + arrObj[i].content + '</div>'
                    + '<div class="item_ops">来自:<a href="' + arrObj[i].feed_url + '" target="_blank">'
                    + arrObj[i].feed_title + '</a>'
                    + '&nbsp;&nbsp;<a href="#">收藏</a></div></div>')
            }
        });
    if (isShowLoading){
        closeLoad();
    }
}


function setHeightAndWidth(){
    var height = $('html').height() - $('.header').height() - 30;
    $('#content_container').height(height);

    $("#tipDiv").css('left', ($('html').width() - 170) / 2 + 'px');
    $("#tipDiv").css('top', ($('html').height() - 10) / 2 + 'px');
}

function show_add_feed_container(){
    if ($("#txt_feed_container").css("display") == "none"){
        $("#txt_feed_container").css("display", "block");
    } else {
        $("#txt_feed_container").css("display", "none");
    }

}

function addFeed(){
    showLoad('正在加载...');
    var url = $("#txt_feed").val();
    $("#txt_feed_container").css("display", "none");

    if (url != null){
        $('#content').empty();
        $.ajax({
            url: '/add_feed?url=' + url
        }).done(function (data){
                if (data == "success"){
                    getAllFeedContent(false);
                    getAllFeedList();
                }

                closeLoad();
            });
    }

}

function getAllFeedList(){
    $.ajax({
        url: '/get_all_feed_list'
    }).done(function (data){
            $('#feed_list ul').empty();
            arrObj = JSON.parse(data);
            $('#feed_list ul').append('<li class="feed" style="background-color: #dddddd" onclick="changeBgColor(this)">'
                    + '<div  class="feed_item bold" style="padding-left: 10px;"  onclick="getAllFeedContent(true);">查看所有</div>'
                    + '</li>');
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_list ul').append('<li class="feed" onclick=\"getFeedByUrl(\''
                    + arrObj[i].fields.feed_url + '\', ' + arrObj[i].pk + ', this)\">'
                    + '<div class="feed_item" style="background-image: url(\'' + arrObj[i].fields.icon + '\')">'
                    + arrObj[i].fields.title + '</div></li>')
            }
        });

}