function showLoad(tipInfo) {
    if ($("#tipDiv").size() == 0){
        var eTip = document.createElement('div');
        eTip.setAttribute('id', 'tipDiv');
        eTip.style.position = 'absolute';
        eTip.style.display = 'none';
        eTip.style.textAlign = 'center';
        eTip.style.border = 'solid 0px #D1D1D1';
        eTip.style.backgroundColor = '#4B981D';
        eTip.style.padding = '2px 15px';
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