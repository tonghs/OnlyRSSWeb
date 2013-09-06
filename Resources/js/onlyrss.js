$(document).ready(function(){
    $.ajax({
        url: '/get_all_feed_list'
    }).done(function (data){
            arrObj = JSON.parse(data);
            for (var i = 0; i < arrObj.length; i++){
                $('#feed_list ul').append('<li onclick=\"getFeedByUrl(\''
                    + arrObj[i].fields.url + '\', ' + arrObj[i].pk + ')\">'
                    + arrObj[i].fields.title + '</li>')
            }
        });
});