function getItem(id, obj, isShowLoading){
    if (isShowLoading == null || isShowLoading){
        showLoad('正在加载...');
    }
    var url = '';
    if (id == null){
        id = 0;
    }
    $('#temp_feed_id').val(id);
    url = '/get_feed_content?id=' + id;

    ajaxRequest(url, parseContent);

    if (obj != null){
        changeBgColor(obj);
    }

    if (isShowLoading == null || isShowLoading){
        closeLoad();
    }
}


function parseContent(data){
    var arrObj = JSON.parse(data);
    $('#content_container').empty();
    $('#content_container').animate({scrollTop: '0px'}, 80);
    for (var i = 0; i < arrObj.length; i++){
        $('#content_container').append('<div class="item" onclick="delItem('
            + arrObj[i].id
            + ', document.getElementById(\''
            + arrObj[i].id
            + '\'))"><div class="unread" id="'
            + arrObj[i].id
            + '">&nbsp;</div><div class="item_title"><a href=" '
            + arrObj[i].url + ' " target="_blank">'
            + arrObj[i].title + '</a></div>'
            + '<div class="item_content">' + arrObj[i].content + '</div>'
            + '<div class="item_ops">来自:<a href="' + arrObj[i].feed_url + '" target="_blank">'
            + arrObj[i].feed_title + '</a>'
            + '&nbsp;&nbsp;<a href="#">收藏</a></div></div>')
    }
    $('#content_container').append('<div class="next" id="next_page" onclick="getMore(0, $(this))">加载更多</div>')
}

function getMore(unreadCount, obj){
    //showLoad('正在加载...');
    if (obj != null){
        obj.html('正在加载...');
        obj.removeAttr('onclick');
    }
    var id = $('#temp_feed_id').val();
    if (unreadCount == null){
        unreadCount = 0;
    } else {
        unreadCount = $('.unread').size();
    }

    var url = '/get_feed_content?id=' + id + '&unreadCount=' + unreadCount;

    ajaxRequest(url, function parseContent(data){
        var arrObj = JSON.parse(data);
        for (var i = 0; i < arrObj.length; i++){
            $('#content_container').append('<div class="item" onclick="delItem('
                + arrObj[i].id
                + ', document.getElementById(\''
                + arrObj[i].id
                + '\'))"><div class="unread" id="'
                + arrObj[i].id
                + '">&nbsp;</div><div class="item_title"><a href=" '
                + arrObj[i].url + ' " target="_blank">'
                + arrObj[i].title + '</a></div>'
                + '<div class="item_content">' + arrObj[i].content + '</div>'
                + '<div class="item_ops">来自:<a href="' + arrObj[i].feed_url + '" target="_blank">'
                + arrObj[i].feed_title + '</a>'
                + '&nbsp;&nbsp;<a href="#">收藏</a></div></div>')
        }
        if (obj != null){
            obj.fadeOut('normal', function(){
                obj.remove();
            });
        }

        $('#content_container').append('<div class="next" id="next_page" onclick="$(this).click(function(){});;getMore(' + unreadCount + ', $(this))">加载更多</div>');
        //closeLoad();
    });
}


function changeBgColor(obj){
    $('.feed').each(function(){
        $(this).css('background', '');
    });

    if(obj.style != null){
        obj.style.backgroundColor = '#dddddd';
    } else {
        obj.css('background', '#dddddd');
    }

}


function showAddFeedContainer(){
    if ($("#txt_feed_container").css("display") == "none"){
        $("#txt_feed_container").css("display", "block");
        $("#txt_feed").focus();
    } else {
        $("#txt_feed_container").css("display", "none");
    }

}

function addFeed(){
    showLoad('正在加载...');
    var url = $("#txt_feed").val();
    $("#txt_feed_container").css("display", "none");

    if (url != null){
        ajaxRequest('/add_feed?url=' + url, function (data){
                if (data == "success"){
                    getItem(null, $('#get_all'), false);
                    getAllFeedList();
                }
                $("#txt_feed").val("");
                closeLoad();
            });
    }

}

function delFeed(feedId){

}

function getAllFeedList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_list ul').empty();
            var arrObj = JSON.parse(data);
            $('#feed_list ul').append('<li class="feed" id="get_all" style="background-color: #dddddd">' +
                '<div class="feed_item bold"  onclick="getItem(null, $(\'#get_all\'), true);"' +
                ' style="padding-left: 10px;">查看所有</div></li>');
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_list ul').append('<li class="feed" onclick=\"getItem(' + arrObj[i].pk + ', this)\">' +
                    '<div class="feed_item" style="background-image: url(\'' + arrObj[i].fields.icon + '\')">' +
                    arrObj[i].fields.title + '</div></li>')
            }
            getItem(null, $('#get_all'), false);
            closeLoad();
        });

}


function getAllFeedManageList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_manage_list ul').empty();
            var arrObj = JSON.parse(data);
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_manage_list ul').append('<li class="feed">' +
                    '<div class="feed_manage_item" style="background-image: url(\'' + arrObj[i].fields.icon + '\'); width:500px;">' +
                    '<input type="checkbox" name="feed_id" value="' +
                    arrObj[i].pk + '"/>'+
                    arrObj[i].fields.title + '</div>' +
                        '<div><a href="javascript:vaid(0);">删除</a></div></li><div class="clear"></div>')
            }
            closeLoad();
        });

}

//设置未读状态
function setStatus(){
    $('.unread').each(function(){
        if ($(this).offset() != null && $(this).offset().top != null && $(this).offset().top <= 300 && this.className != 'read'){
            delItem(this.id, this);
        }
    });

    if ($('#next_page') != null && $('#next_page').offset() != null && $('#next_page').offset().top <= $('html').height()){
//        $('#next_page').fadeOut('normal', function(){
//            $('#next_page').click();
//            //$('#next_page').remove();
//        });
        $('#next_page').click();
    }
}

function delItem(id, obj){
    ajaxRequest('/del_item?id=' + id, null, function(req, msg, errorThrown){
        if (req.status != 404){
            showErr();
        }
    });
    if (obj != null){
        obj.className = 'read';
    }
}

function delAllItem(){
    showLoad('正在加载...');
    ajaxRequest('/del_item', function(data){
        getItem(null, $('#get_all'), false);
    }, function(req, msg, errorThrown){
        if (req.status != 404){
            showErr();
        }
    });

    closeLoad();
}


function updateItem(){
    ajaxRequest('/update_content');

}

function showTitleMode(){
    $('.item_content').fadeOut();
}

function showContentMode(){
    $('.item_content').fadeIn();
}

function getHtmlByText(){
    var text = encodeURIComponent($('#input').val());

    ajaxRequest('/get_html?text=' + text, function(data){
        $('#output').html(data);
    });
}