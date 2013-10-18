/**
 * Created by tonghuashuai on 13-10-5.
 */
$(document).ready(function(){
    showLoad('正在加载...');
    getAllFeedManageList();
});


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
