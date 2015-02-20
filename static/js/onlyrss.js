$(document).ready(function(){
    showLoad('正在加载...');
    $(window).resize(setHeightAndWidth);
    setHeightAndWidth();
    getAllFeedList();
    setInterval(getFeedCount, 300000);
});

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
    $('#content_container').empty();
    ajaxRequest(url, parseContent);

    if (obj != null){
        changeBgColor(obj);
    }
}

function render(o){
    $('#content_container').append('<div class="item" id="item_'
        + o.id
        + '"onclick="delItem('
        + o.id
        + ', document.getElementById(\''
        + o.id
        + '\'))"><div class="unread" onclick="hide('
        + o.id
        + ');" id="'
        + o.id
        + '"><a href="javascript:void(0);">x</a></div><div class="item_title"><a href=" '
        + o.url + ' " target="_blank">'
        + dealTitle(o.title) + '</a></div>'
        + '<div class="item_content">' + o.content + '</div>'
        + '<div class="item_ops">来自: <a href="' + o.feed_url + '" target="_blank">'
        + o.feed_title + '</a>')
}

function parseContent(data){
    var arrObj = JSON.parse(data);
    for (var i = 0; i < arrObj.length; i++){
        render(arrObj[i]);
    }
   	renderImg();
    closeLoad();
}


function dealTitle(title){
    return title == '' ? '----' : title
}

function hide(id){
    $("#item_" + id).fadeOut(function(){
        $("#item_" + id).css('height', 0)
    });
}

function renderImg(){
    $('img').each(function(){
        $(this).attr('src', $(this).attr('src_no'));
        $(this).removeAttr('src_no');
    });
}

function getMore(){
    var id = $('#temp_feed_id').val();
    var url = '/get_feed_content?id=' + id;

    ajaxRequest(url, function parseContent(data){
        var arrObj = JSON.parse(data);
if (arrObj.length == 0 && $('.unread').size() == 0){
            var id = $('#temp_feed_id').val();
            if (id == '0' || id == '') {
                $('.feed_item').css('font-weight', 'normal');
            } else {
                $('#' + id).css('font-weight', 'normal');
            }

        }

        for (var i = 0; i < arrObj.length; i++){
            if($('#' + arrObj[i].id).size() <= 0){
                render(arrObj[i]);
            }
        }
        renderImg();
    });
}


function changeBgColor(obj){
    $('.feed').each(function(){
        $(this).css('background', '');
    });

    if(obj.style != null){
        obj.style.backgroundColor = '#E8E9EB';
    } else {
        obj.css('background', '#E8E9EB');
    }

}

function showAddFeedContainer(){
    $.blockUI({ 
            message: $('#txt_feed_container'), 
            css: { 
                top:        '50%',
                left:       '50%',
                textAlign:  'center',
                width: '300px',
                background:'none'
            } 
    }); 
    $('.blockOverlay').attr('title','单击关闭').click($.unblockUI); 
}

function addFeed(){
    var url = $("#txt_feed").val();

    if (url != null){
        ajaxRequest('/add_feed?url=' + escape(url), function (data){
                if (data == "success"){
                    getItem(null, $('#get_all'), false);
                    getAllFeedList();
                }
                $("#txt_feed").val("");
                closeLoad();
        });

        $.unblockUI();
    }
}

function delFeed(feedId, obj){
    ajaxRequest('/del_feed?id=' + feedId, function(data){
        if (data == "success"){
            obj.parent().parent().fadeOut('normal', function(){
                obj.parent().parent().remove();
                closeLoad();
            });
        }
    });
}

function getAllFeedList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_list ul').empty();
            var arrObj = JSON.parse(data);
            $('#feed_list ul').append('<li class="feed" id="get_all" style="background-color: #E8E9EB">' +
                '<div class="feed_item bold"  onclick="getItem(null, $(\'#get_all\'), true);"' +
                ' ">查看所有</div></li>');
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
                var url_txt = '';
                var max_length = 60;
                if (url.length > max_length){
                    url_txt = url.substr(0, max_length) + '...';
                } else {
                    url_txt = url;
                }
                $('#feed_manage_list ul').append('<li class="feed_li">' +
                    '<div class="feed_manage_item li" style="background-image: url(\'' + arrObj[i].fields.icon + '\'); min-width:330px;">' +
                    '<input type="checkbox" class="feed_id" name="feed_id" value="' +
                    arrObj[i].pk + '"/>'+
                    arrObj[i].fields.title + '</div>' +
                    '<div class="li" style="min-width:450px;"><a title="' + url +  '" href="' + url + '">' + url_txt +
                    '</a></div><div class="li"><a href="javascript:void(0);" onclick="delFeed(' + arrObj[i].pk +
                    ', $(this));">删除</a></div><div class="clear"></div></li>')
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

    obj = $('#content_container')
    if(obj.get(0).scrollHeight - obj.scrollTop() <= $('html').height()){
        getMore();
    };

}

function delItem(id, obj){
    ajaxRequest('/del_item?id=' + id, function(){
        if (obj != null){
            obj.className = 'read';
        }
    }, null, false);

}

function delAllItem(){
    ajaxRequest('/del_item', function(data){
        getItem(null, $('#get_all'), false);
        $('.feed_item').css('font-weight', 'normal');
    });

    closeLoad();
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


function delAll(){
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

