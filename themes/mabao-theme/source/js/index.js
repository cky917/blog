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
        $(window).scroll(function(){
            var titleList = $('.post-content').find('h1,h2,h3,h4,h5');
            for(var i =0,len=titleList.length;i<len;i++){
                var $this = $(titleList[i]);
                var distance = $this.offset().top-$(document).scrollTop();
                var id;
                var cateObj;

                if(distance < 60){
                    id = $this.attr('id');
                    cateObj = $('#toc').find('[href="#'+ id +'"]');
                    $('.toc-item').removeClass('toc-active');
                    cateObj.parents('.toc-item').addClass('toc-active');
                }
            }
        });
    }

}(jQuery));