function getItem(id, obj, isShowLoading){
    if (isShowLoading == null || isShowLoading){
        showLoad('正在加载...');
    }

    $('#content_container').empty();
    var url = '';
    if (id != null){
        url = '/get_feed_content?id=' + id;
    } else {
        url = '/get_all_feed_content';
    }

    ajaxRequest(url, parseContent);

    if (obj != null){
        changeBgColor(obj);
    }

    if (isShowLoading == null || isShowLoading){
        closeLoad();
    }
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

function getAllFeedList(){
    ajaxRequest('/get_all_feed_list', function (data){
            $('#feed_list ul').empty();
            var arrObj = JSON.parse(data);
            $('#feed_list ul').append('<li class="feed" id="get_all" style="background-color: #dddddd">'
                    + '<div class="feed_item bold"  onclick="getItem(null, $(\'#get_all\'), true);"'
                    + ' style="padding-left: 10px;"'
                    + '>查看所有</div>'
                    + '</li>');
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_list ul').append('<li class="feed" onclick=\"getItem(' + arrObj[i].pk + ', this)\">'
                    + '<div class="feed_item" style="background-image: url(\'' + arrObj[i].fields.icon + '\')">'
                    + arrObj[i].fields.title + '</div></li>')
            }
        });

}

//设置未读状态
function setStatus(){
    $('.unread').each(function(){
        if ($(this).offset().top <= 300 && this.className != 'read'){
            delItem(this.id, this);
        }
    });
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
            + arrObj[i].feed_title + '</a>'
            + '&nbsp;&nbsp;<a href="#">收藏</a></div></div>')
    }
}

function updateItem(){
    ajaxRequest('/update_content');

}