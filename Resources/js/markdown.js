/**
 * Created with PyCharm.
 * User: tonghuashuai
 * Date: 13-10-2
 * Time: 下午4:58
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    showLoad('正在加载...');
    setWidthAndHeight();
    $(window).resize(setWidthAndHeight);
    $('#allowtab').allowtab();
    $('#allowtab').focus();
    closeLoad()
});

function setWidthAndHeight(){
    var height = $('html').height();
    var width = $('html').width() / 2;
    $('#left').css('height', height);
    $('#left').css('width', width);
    $('#allowtab').css('height', height - 20);
    $('#allowtab').css('width', width - 20);

    $('#right').css('height', height);
    $('#right').css('width', width - 35);
}


function getHtmlByText(){
    var text = encodeURIComponent($('#allowtab').val());

    ajaxRequest('/get_html?text=' + text, function(data){
        $('#right').html(data);

    });
}
