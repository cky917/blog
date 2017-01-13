/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();
        $('#toc').appendTo('body');
        eventHandler();
    });

    function eventHandler(){
       
        countCateStyle();
        $(window).scroll(function(){
            countCateStyle();
        });
    }
    function countCateStyle(){
        var cateList = $('.toc-item');
        var titleList = $('.post-content').find('h1,h2,h3,h4,h5');
        var tocObj = $('.toc-article');
        if($(document).scrollTop() > 550){
            tocObj.addClass('toc-article-fixed');
        }else{
            tocObj.removeClass('toc-article-fixed');
        }
        for(var i =0,len=titleList.length;i<len;i++){
            var $this = $(titleList[i]);
            var distance = $this.offset().top-$(document).scrollTop();
            var id;
            var cateObj,cateLiObj;
            if(distance < 60){
                id = $this.attr('id');
                cateObj = $('#toc').find('[href="#'+ id +'"]');
                cateLiObj = cateObj.parents('.toc-item');
                cateList.removeClass('toc-active');
                cateLiObj.addClass('toc-active');
                continue;
            }
        }
    }
}(jQuery));