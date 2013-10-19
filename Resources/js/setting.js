/**
 * Created by tonghuashuai on 13-10-5.
 */
$(document).ready(function(){
    showLoad('正在加载...');
    getAllFeedManageList();
    getOpmlUrl();
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
