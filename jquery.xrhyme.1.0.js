/*
 * jQuery X-Rhyme v 1.0
 *
 * Nice work for horizontal websites :>
 *
 * Copyright (c) 2011, lancee LY
 *
 * http://xrhy.me/
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

!(function($) {

    "use strict"

    $.xrhyme = function(xcontent, options) {
    
        // Reference this object 
        var me = this;
        
        // Private method
        var fn = {};
        
        me.$x_cont = $(xcontent).addClass('x_container');
        
        // Add a reverse reference to the DOM object
        me.$x_cont.data('X-Rhyme', me);
        me.$x_wrap = me.$x_cont.parent().addClass('x_wrapper');
        
        // Initialization
        fn.init = function() {
            me.options = $.extend({}, $.xrhyme.defaults, options);
            
            // Sum of each horizontal item's width
            me.width = 0;
            
            // Preserve the offset of each horizontal item
            me.offset = {};            
            me.$x_cont.children().each(function(i) {
                $(this).addClass('x_item');
                if(me.options.anchorMode) {
                    var hash = $(this).attr('id');
                    if(hash)me.offset[hash] = me.width;
                }else{
                    me.offset[i] = me.width;
                }
                me.width += $(this).outerWidth(true);
            });
            
            // Reset width of horizontal container 
            me.$x_cont.width(me.width);
            fn.resetContent();
            
            // Left and right ends flag
            me.endsFlag = 0;
            
            if(me.options.navigationSelector) {
                $(me.options.navigationSelector).each(function(i) {
                    var k = me.options.anchorMode ? $(this).attr('href').replace('#','') : i;
                    $(this).on('click', function(e) {
                    
                        // Smooth scrolling to an anchor
                        me.$x_wrap.stop().animate({ scrollLeft: me.offset[k] },
                        {
                            queue: false, 
                            duration: me.options.animationTime, 
                            easing: me.options.easing, 
                            complete: function() {
                                me.endsFlag = fn.endsFlag();
                                if($.isFunction(me.options.animeComplete))
                                    me.options.animeComplete.call(me, k, i);
                            }
                        });
                        (e.preventDefault)?e.preventDefault():e.returnValue = false;
                    });
                });
            }
            
            window.onresize = fn.resetContent;
            document.onkeydown = fn.keyScroll;
            if($.browser.mozilla) {
                document.addEventListener('DOMMouseScroll', fn.mouseWheel, false);
            }else{
                document.onmousewheel = fn.mouseWheel;
            }
        };
        
        // Return a number as endsFlag, it may be 0(leftEnd) 1(rightEnd) or value > 1
        fn.endsFlag = function() {
            return me.$x_wrap.scrollLeft()?
            (me.$x_cont.outerWidth(true) /( me.$x_wrap.scrollLeft() + $(window).width())):
            me.$x_wrap.scrollLeft();
        }
        
        // Fire the custom function 
        // if scroll-left-end touch the border of each horizontal item
        // then update both ends (of horizontal container) flag
        fn.frontier = function() {
            var flag = 2;
            return function(speed){
                me.endsFlag = fn.endsFlag();
                if($.isFunction(me.options.animeComplete)) {
                    if(flag > 1) {
                        var lt = me.$x_wrap.scrollLeft() - speed/2;
                        var rt = me.$x_wrap.scrollLeft() + speed/2;
                        for (i in me.offset) {
                        
                            // It will be negative within
                            if((me.offset[i] - lt)*(me.offset[i] - rt) < 0) {
                                me.options.animeComplete.call(me, i, speed);
                                break;
                            }
                        }
                    }
                    flag = me.endsFlag;
                }
            }
        }();
        
        // Reset width of horizontal container on window resize
        fn.resetContent = function() {
        
            // Update step size for keyboard scrolling control
            me.perWidth = me.$x_wrap.width() / 10;
            var plus_width = $(window).width() - $('.x_item:last').outerWidth(true);
            if(plus_width>0)
            me.$x_cont.width(me.width + plus_width);
        };
        
        // Scrolling page with mousewheel
        fn.mouseWheel = function(e) {
            e = e || window.event;
            var speed = e.detail ? e.detail * 40 : e.wheelDelta * (-1);
            speed *= me.options.wheelSpeed;
            var left = speed + me.$x_wrap.scrollLeft();
            me.$x_wrap.scrollLeft(left);
            fn.frontier(speed);
            return false;
        };
        
        // Scrolling page with keyboard
        fn.keyScroll = function(e) {
            e = e || window.event;
            switch(e.keyCode) {
                case 37:
                me.$x_wrap.scrollLeft(me.$x_wrap.scrollLeft() - me.perWidth),
                fn.frontier(-me.perWidth);
                break;
                case 39:
                me.$x_wrap.scrollLeft(me.$x_wrap.scrollLeft() + me.perWidth),
                fn.frontier(+me.perWidth);
                break;
                default:
                return;
            }
            
        };
        
        fn.init();
        
    };
    
    // X-Rhyme default settings
    $.xrhyme.defaults = {
        
        // String of css selector for custom navigation, for instance: '#Nav li a'
        navigationSelector : '',
        
        // The navigationSelector should be end with 'a'
        // links to anchor within horizontal items flow, so can be scrolling
        anchorMode : false,
        
        // Percentage of mouseWheel speed(120), it's better between 0 & 1
        wheelSpeed : 0.5,
        
        // Using easing function for scrolling transition, requires the easing plugin
        easing : 'swing',
        
        // Milliseconds of scrolling transition
        animationTime : 600,
        
        // Custom function, fire when the scrolling transition Completed
        animeComplete : ''
    };
    
    $.fn.xrhyme = function(options, callback) {
        var xrhyme = $(this).data('X-Rhyme');
        
        // Prevent multiple initializations
        return this.each(function(i) {
            if((typeof(options)).match('object|undefined')) {
                if(!xrhyme) {
                    (new $.xrhyme(this, options));
                }else{}
                
            }else{
                // If options is not a object...
            }
        });
        
    };
	
})(jQuery);