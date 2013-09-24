$(document).ready(function(){
    showLoad('正在加载...');
    $(window).resize(setHeightAndWidth);
    setHeightAndWidth();
    getAllFeedList();
    getItem(null, $('#get_all'), false);
    closeLoad();
});

