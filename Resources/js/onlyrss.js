$(document).ready(function(){
    console.log('this is a test statement.');
    showLoad('正在加载...');
    $(window).resize(setHeightAndWidth);
    setHeightAndWidth();
    getAllFeedList();
    setInterval(updateItem, 300000);
});