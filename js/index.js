/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();
        $('#toc').appendTo('body');
        if(!$('.toc').length){
            $('.toc-article').hide();
        }
        eventHandler();
    });
    function eventHandler(){
        var topLength = $('.toc').length; 
        var throttled = _.throttle(countCateStyle, 100);
        $(window).scroll(function(){
            if(topLength){
               throttled();
            }
        });
    }
    function countCateStyle(){
        var cateList = $('.toc-item');
        var titleList = $('.post-content').find('h1,h2,h3,h4,h5');
        var tocObj = $('.toc-article');
        var tocOl  = $('.toc');
        var viewHeight = $(window).height();
        if($(document).scrollTop() > 550){
            tocObj.addClass('toc-article-fixed');
        }else{
            tocObj.removeClass('toc-article-fixed');
        }
        for(var i =0,len=titleList.length;i<len;i++){
            var $this = $(titleList[i]);
            var distance = $this.offset().top-$(document).scrollTop();
            var curTocOlTop = parseInt(tocOl[0].style.top) || 0;
            var id;
            var cateObj,cateLiObj;
            if(distance < 60){
                id = $this.attr('id');
                cateObj = $('#toc').find('[href="#'+ id +'"]');
                cateLiObj = cateObj.parents('.toc-item');
                cateList.removeClass('toc-active');
                cateLiObj.addClass('toc-active');
                if((cateLiObj.offset().top - $(document).scrollTop()) > viewHeight/2){
                    tocOl[0].style.top = parseInt(curTocOlTop - 27)+'px';
                }else{
                    tocOl[0].style.top = 0;
                }
                continue;
            }
        }
    }
}(jQuery));