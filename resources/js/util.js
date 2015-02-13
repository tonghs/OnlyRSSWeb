function logout(){
    ajaxRequest('/logout', function(data){
        if (data == 'success'){
            window.location.href = '/';
        }
    });
}


function setHeightAndWidth(){
    //var height = $('html').height() - $('.header').height() - 30;
    var height = $('html').height() - $('#ops').height() - 30;
    $('#content_container').height(height);
    $('#feed_list').height(height);
    $("#tipDiv").css('left', ($('html').width() - 170) / 2 + 'px');
}

function keyboardHandler(keyCode, fun){
    if (event.keyCode == keyCode){
        fun();
    }
}

function ajaxRequest(url, fun, funErr, isShowLoad){
    if (isShowLoad != false){
        showLoad();
    }
    $.ajax({
        url: url,
        error: function(){
            closeLoad();
            funErr != null ? funErr() : showErr()
        },
        success: function(data){
            fun(data);
            closeLoad();
        } 
    });
}

function ajaxRequestPost(url, data, fun, funErr, isShowLoad){
    if (isShowLoad != false){
        showLoad();
    }

    $.ajax({
        type: 'POST',
        data: data,
        url: url,
        error: function(){
            closeLoad();
            funErr != null ? funErr() : showErr()
        },
        success: function(data){
            fun(data);
            closeLoad();
        } 
    });
}

function showErr(req, msg, errorThrown){
    if (req.status != 404){
        showMsg("出错了，请重试...");
    }

}

function showLoad(tipInfo) {
    if ($("#alertDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'alertDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.textAlign = 'center';
        eTip.style.padding = '5px 15px';
        eTip.style.left = ($('html').width() - 190) / 2 + 'px';
        eTip.style.top = ($('html').height() / 2) - 150 + 'px';
        eTip.style.height = '70px';
        eTip.style.lineHeight = '35px';
        eTip.style.width = '190px';
        eTip.innerHTML = '<div class="spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> <div class="rect6"></div> <div class="rect7"></div> <div class="rect8"></div></div><div class="loading_logo bold">Only RSS</div>';
        try {
            document.body.appendChild(eTip);
        } catch (e) { }
        $("#alertDiv").css("z-index", "99");
        $('#alertDiv').fadeIn();
    }

}

function closeLoad() {
    $('#alertDiv').fadeOut(function(){
        $('#alertDiv').remove();
    });
}

function showMsg(msg, isShowLogo, autoClose) {
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
        eTip.style.top = ($('html').height() / 2) - 150 + 'px';
        eTip.style.height = '70px';
        eTip.style.lineHeight = '35px';
        eTip.style.width = '190px';
        eTip.style.boxShadow = '0px 0px 1px 1px #aaaaaa';
        html = ''
        if (isShowLogo){
            html += '<div class="loading_logo bold">Only RSS</div>';
        }
        eTip.innerHTML = html + '<span class="loading">' + msg + '</span>';
        try {
            document.body.appendChild(eTip);
        } catch (e) { }
        $("#alertDiv").css("z-index", "99");
    }

    $('#alertDiv').fadeIn();
    if (!autoClose){
        t = setTimeout("$('#alertDiv').fadeOut(function(){$('#alertDiv').remove();});clearTimeout(t);",3000);
    }
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
