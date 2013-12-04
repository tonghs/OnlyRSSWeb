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

function parseContent(data){
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
    $('#content_container').append('<div class="next" id="next_page" onclick="getMore(0, $(this))">加载更多</div>');
   	//showImg();
    closeLoad();
}

function showImg(){
    $('img').each(function(){
        $(this).attr('src', $(this).attr('src_no'));
        $(this).removeAttr('src_no');
    });
}

function getMore(unreadCount, obj){
    if (obj != null){
        obj.html('正在加载...');
        obj.removeAttr('onclick');
    }
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
                + arrObj[i].feed_title + '</a>');
            }
        }
        if (obj != null){
            obj.fadeOut('normal', function(){
                obj.remove();
                $('#content_container').append('<div class="next" id="next_page" onclick="getMore(' + unreadCount + ', $(this))">加载更多</div>');

            });
        }
        //showImg();
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
    ajaxRequest('/del_item?id=' + id, function(){
        if (obj != null){
            obj.className = 'read';
        }
    });

}

function delAllItem(){
    showLoad('正在加载...');
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

function showLoad(tipInfo) {
    if ($("#tipDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'tipDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.textAlign = 'center';
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.padding = '0 15px 3px 15px';
        eTip.style.left = ($('html').width() - 190) / 2 + 'px';
        eTip.style.top = '0px';
        eTip.style.width = '190px';
        eTip.innerHTML = '<span class="loading_logo bold">Only RSS</span>&nbsp;&nbsp;'
            +'<span class="loading">' + tipInfo + '</span>';
        try {
            document.body.appendChild(eTip);
        } catch (e) { }
        $("#tipDiv").css("z-index", "99");
    }

    $('#tipDiv').slideDown();
}

function closeLoad() {
    $('#tipDiv').slideUp();
}


function setHeightAndWidth(){
    var height = $('html').height() - $('.header').height() - 30;
    $('#content_container').height(height);

    $("#tipDiv").css('left', ($('html').width() - 170) / 2 + 'px');
}

function keyboardHandler(keyCode, fun){
    if (event.keyCode == keyCode){
        fun();
    }
}

function ajaxRequest(url, fun, funErr){
     $.ajax({
        url: url,
        error: funErr != null ? funErr : showErr,
        success: fun
    });
}

function ajaxRequestPost(url, data, fun, funErr){
     $.ajax({
        type: 'POST',
        data: data,
        url: url,
        error: funErr != null ? funErr : showErr,
        success: fun
    });
}

function showErr(req, msg, errorThrown){
    if (req.status != 404){
        showMsg("出错了，请重试...");
    }

}

function showMsg(msg) {
    closeLoad();
    if ($("#alertDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'alertDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.textAlign = 'center';
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.padding = '5px 15px';
        eTip.style.left = ($('html').width() - 190) / 2 + 'px';
        eTip.style.top = ($('html').height() / 2) - 50 + 'px';
        eTip.style.height = '50px';
        eTip.style.lineHeight = '50px';
        eTip.style.width = '190px';
        eTip.innerHTML = '<span class="loading">' + msg + '</span>';
        try {
            document.body.appendChild(eTip);
        } catch (e) { }
        $("#alertDiv").css("z-index", "99");
    }

    $('#alertDiv').fadeIn();
    t=setTimeout("$('#alertDiv').fadeOut();clearTimeout(t);",3000)
}

jQuery.cookie = function(name, value, options) {
	if (typeof value != 'undefined') {
		options = options || {};
		if (value === null) {
			value = '';
			options = $.extend({}, options);
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		var path = options.path ? '; path=' + (options.path) : '';
		var domain = options.domain ? '; domain=' + (options.domain) : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
};
