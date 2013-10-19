function getItem(id, obj, isShowLoading){
    if (isShowLoading == null || isShowLoading){
        showLoad('正在加载...');
    }
    var url = '';
    if (id == null){
        id = 0;
    }
    if (id == 0){
        getFeedCount();
    }
    $('#temp_feed_id').val(id);
    url = '/get_feed_content?id=' + id;
    $('#content_container').animate({scrollTop: '0px'}, 10);
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
            + arrObj[i].feed_title + '</a>')
    }
    $('#content_container').append('<div class="next" id="next_page" onclick="getMore(0, $(this))">加载更多</div>')
}

function getMore(unreadCount, obj){
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
                + arrObj[i].feed_title + '</a>')
        }
        if (obj != null){
            obj.fadeOut('normal', function(){
                obj.remove();
                $('#content_container').append('<div class="next" id="next_page" onclick="getMore(' + unreadCount + ', $(this))">加载更多</div>');

            });
        }

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

function delFeed(feedId, obj){
    showLoad('正在加载...');
    ajaxRequest('/del_feed?id=' + feedId,function(data){
        if (data == "success"){
            obj.parent().parent().fadeOut('normal', function(){
                obj.parent().parent().remove();
                closeLoad();
            });
        }
    })
}

function getAllFeedList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_list ul').empty();
            var arrObj = JSON.parse(data);
            $('#feed_list ul').append('<li class="feed" id="get_all" style="background-color: #dddddd">' +
                '<div class="feed_item bold"  onclick="getItem(null, $(\'#get_all\'), true);"' +
                ' style="padding-left: 10px;">查看所有</div></li>');
            for (var i = 0; i < arrObj.length; i++){
                var title = arrObj[i].fields.title;
                var titleTemp = title.replace(/[^\x00-\xff]/g,"**");
                if (title!= null && titleTemp.length > 20){
                    title = title.substring(0, 9) + '...';
                }
                $('#feed_list ul').append('<li class="feed" onclick=\"getItem(' + arrObj[i].pk + ', this)\">' +
                    '<div class="feed_item" id="' + arrObj[i].pk +
                    '" style="background-image: url(\'' + arrObj[i].fields.icon + '\')"' +
                    'title="' + arrObj[i].fields.title + '">' + title + '</div></li>');
            }
            getFeedCount();
            getItem(null, $('#get_all'), false);
            closeLoad();
        });

}


function getAllFeedManageList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_manage_list ul').empty();
            var arrObj = JSON.parse(data);
            for (var i = 0; i < arrObj.length; i++){
                var url = arrObj[i].fields.feed_url;
                $('#feed_manage_list ul').append('<li class="feed">' +
                    '<div class="feed_manage_item" style="background-image: url(\'' + arrObj[i].fields.icon + '\'); min-width:350px;">' +
                    '<input type="checkbox" class="feed_id" name="feed_id" value="' +
                    arrObj[i].pk + '"/>'+
                    arrObj[i].fields.title + '</div>' +
                    '<div style="min-width:450px;"><a href="' + url + '">' + url +
                    '</a></div><div><a href="javascript:void(0);" onclick="delFeed(' + arrObj[i].pk +
                    ', $(this));">删除</a></div></li><div class="clear"></div>')
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
        $('#next_page').click();
    }
}

function delItem(id, obj){
    ajaxRequest('/del_item?id=' + id);
    if (obj != null){
        obj.className = 'read';
    }
}

function delAllItem(){
    showLoad('正在加载...');
    ajaxRequest('/del_item', function(data){
        getItem(null, $('#get_all'), false);
        $('.feed_item').css('font-weight', 'normal');
    });

    closeLoad();
}


function updateItem(){
    ajaxRequest('/update_content', function(data){
        getFeedCount();
    });

}


function getFeedCount(){
    ajaxRequest('/get_feed_count', function(data){
        var arrObj = JSON.parse(data);
        $('.feed_item').not('.bold').css('font-weight', 'normal');
        for (var i = 0; i < arrObj.length; i++){
            var id = arrObj[i].feed;
            var count = parseInt(arrObj[i].count);

            if (count > 0){
                $('#' + id).css('font-weight', 'bold')
            }
        }
    });
}

function logout(){
    ajaxRequest('/logout', function(data){
        if (data == 'success'){
            window.location.href = '/';
        }
    });
}



function delAll(){
    showLoad('正在加载...');
    ajaxRequest('/del_feed',function(data){
        if (data == "success"){
           $('.feed').fadeOut('normal', function(){
                $('.feed').remove();
                closeLoad();
            });
        }
    })
}

function delBat(){
    showLoad('正在加载...');
    var ids_str = '';
    var ids = new Array();
    var i = 0;
    $('[name="feed_id"]').each(function(){
        if (this.checked){
            ids_str += $(this).val() + ',';
            ids[i++] = $(this).val();
        }
    })

    ids_str += '0';
    ajaxRequest('/del_feed_bat?ids_str=' + ids_str,function(data){
        if (data == "success"){
            for (var j = 0; j <=i; j++){
                $('[value="' + ids[j] + '"]').parent().parent().fadeOut('normal', function(){
                    $('[value="' + ids[j] + '"]').parent().parent().remove();
                });
            }
            closeLoad();
        }
    })
}

