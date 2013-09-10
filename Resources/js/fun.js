function getFeedByUrl(url, id, obj){
    showLoad('正在加载...');
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
    closeLoad();
}

function showLoad(tipInfo) {
    if ($("#tipDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'tipDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.padding = '5px 15px';
        eTip.style.left = ($('html').width() - 140) / 2 + 'px';
        eTip.style.top = ($('html').height() - 10) / 2 + 'px';
        eTip.style.width = '140px';

        eTip.innerHTML = '<span class="loading_logo">Only RSS</span>&nbsp;&nbsp;'
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

function setHeightAndWidth(){
    var height = $('html').height() - $('.header').height() - 15;
    $('.right').height(height);

    $("#tipDiv").css('left', ($('html').width() - 170) / 2 + 'px');
    $("#tipDiv").css('top', ($('html').height() - 10) / 2 + 'px');
}