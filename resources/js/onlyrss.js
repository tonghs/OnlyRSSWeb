$(document).ready(function(){
    showLoad('正在加载...');
    $(window).resize(setHeightAndWidth);
    setHeightAndWidth();
    getAllFeedList();
    setInterval(getFeedCount, 300000);
});