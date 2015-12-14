$.getJSON('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&maxResults=10&playlistId=PLSi28iDfECJPJYFA4wjlF5KUucFvc0qbQ&key=AIzaSyCuv_16onZRx3qHDStC-FUp__A6si-fStw', function(obj) {
    //data is the JSON string

var width = $(window).width();
var height = $(window).height(); 
var sum = Math.pow( $(window).width(), 2 ) + Math.pow( $(window).height(), 2);//Pitagora for diagonally
var diag =Math.pow( sum, 1/2 );
console.log(diag); //diagonally of the device

if(width >= 768 || height >= 768){//because the instructions don't speciffy what happens when the device has a screen width or height between 768px and 481px, devices with width or height < 768px have been treated like a mobile phone
    console.log("tablet");

    var Parser = {  
        template: '<section class="mbr-section mbr-section--relative" id="msg-box4-4" style="background-color: rgb(184, 49, 47);"><div class="mbr-section__container mbr-section__container--isolated container"><div class="row"><div class="mbr-box mbr-box--fixed mbr-box--adapted"><div class="mbr-box__magnet mbr-box__magnet--top-right mbr-section__left col-sm-6"><figure class="mbr-figure mbr-figure--adapted mbr-figure--caption-inside-bottom"><a  href="{{detailUrl}}"><img class="mbr-figure__img" alt="" src="{{thumbnailsUrl}}"></a></figure></div><div class="mbr-box__magnet mbr-class-mbr-box__magnet--center-left col-sm-6 mbr-section__right"><div class="mbr-section__container mbr-section__container--middle"><div class="mbr-header mbr-header--auto-align mbr-header--wysiwyg"><a href="{{titleUrl}}" class="mbr-header__text">{{title}}</a><p class="mbr-header__subtext">{{publishedAt}}</p></div></div><div class="mbr-section__container mbr-section__container--middle"><div class="mbr-article mbr-article--auto-align mbr-article--wysiwyg"><p class="minimize">{{description}}</p></div></div></div></div></div></div></section>',
        compile: function(template, data) {
            template = template.replace(/\{\{detailUrl\}\}/g, "tabletDetail/"+data.snippet.resourceId.videoId+"/"+data.snippet.resourceId.videoId+".html")
            .replace(/\{\{thumbnailsUrl\}\}/g, data.snippet.thumbnails.high.url)
            .replace(/\{\{titleUrl\}\}/g, "tabletDetail/"+data.snippet.resourceId.videoId+"/"+data.snippet.resourceId.videoId+".html")
            .replace(/\{\{title\}\}/g, data.snippet.title)
            .replace(/\{\{publishedAt\}\}/g, "Published on "+dateCustomFormat(data.snippet.publishedAt))
            .replace(/\{\{description\}\}/g,data.snippet.description);
            
            return template;
        },
        parse: function(obj) {
            var tpl = '', i = 0, len = 0, html = '';
            for(i = 0, len = obj.length; i < len; i++) {
                tpl = this.template;
                html += this.compile(tpl, obj[i]);       
            }
            return html;
        }
    };

    document.getElementById('result').innerHTML = Parser.parse(obj.items);
           
    jQuery(function(){//trimming the text in each section

        var minimized_elements = $('p.minimize');
        console.log(minimized_elements);
        
        for(var i=0; i < minimized_elements.length; i++){
            var t = $( minimized_elements[i] ).text();        
            if(t.length <= 80) continue;
            else
            $(minimized_elements[i]).html(
                t.slice(0,80)+'<span>... </span>');
        }
    });
} else {
    console.log("mobile");
        var Parser = {  
            template: '<section class="mbr-section mbr-section--relative" id="msg-box4-4" style="background-color: rgb(184, 49, 47);"><div class="mbr-section__container mbr-section__container--isolated container"><div class="row"><div class="mbr-box mbr-box--fixed mbr-box--adapted"><div class="mbr-box__magnet mbr-class-mbr-box__magnet--center-left col-sm-6 mbr-section__left"><div class="mbr-section__container mbr-section__container--middle"><div class="mbr-header mbr-header--auto-align mbr-header--wysiwyg"><a href="{{titleUrl}}" class="mbr-header__text">{{title}}</a><p class="mbr-header__subtext">{{publishedAt}}</p></div></div></div><div class="mbr-box__magnet mbr-box__magnet--top-left mbr-section__right col-sm-6"><figure class="mbr-figure mbr-figure--adapted mbr-figure--caption-inside-bottom"><a href="{{detailUrl}}"><img class="mbr-figure__img" alt="" src="{{thumbnailsUrl}}"></figure></div></div></div></div></section>',
            compile: function(template, data) {
                template = template.replace(/\{\{titleUrl\}\}/g, "mobileDetail/"+data.snippet.resourceId.videoId+".html")
                .replace(/\{\{title\}\}/g, data.snippet.title)
                .replace(/\{\{publishedAt\}\}/g, "Published on "+dateCustomFormat(data.snippet.publishedAt))
                .replace(/\{\{detailUrl\}\}/g, "mobileDetail/"+data.snippet.resourceId.videoId+".html")
                .replace(/\{\{thumbnailsUrl\}\}/g, data.snippet.thumbnails.high.url);
                
                return template;
            },
            parse: function(obj) {
                var tpl = '', i = 0, len = 0, html = '';
                for(i = 0, len = obj.length; i < len; i++) {
                    tpl = this.template;
                    html += this.compile(tpl, obj[i]);           
                }  
                return html;
            }
        };

    document.getElementById('result').innerHTML = Parser.parse(obj.items);
}
});

(function($){

    $.extend($.easing, {
        easeInOutCubic : function(x, t, b, c, d){
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    });

    $.fn.outerFind = function(selector){
        return this.find(selector).addBack(selector);
    };

    (function($,sr){
        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function (func, threshold, execAsap) {
            var timeout;

            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap) func.apply(obj, args);
                    timeout = null;
                };

                if (timeout) clearTimeout(timeout);
                else if (execAsap) func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }
        // smartresize 
        jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    })(jQuery,'smartresize');

    (function(){
        
        var scrollbarWidth = 0, originalMargin, touchHandler = function(event){
            event.preventDefault();
        };

        function getScrollbarWidth(){
            if (scrollbarWidth) return scrollbarWidth;
            var scrollDiv = document.createElement('div');
            $.each({
                top : '-9999px',
                width  : '50px',
                height : '50px',
                overflow : 'scroll', 
                position : 'absolute'
            }, function(property, value){
                scrollDiv.style[property] = value;
            });
            $('body').append(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            $('body')[0].removeChild(scrollDiv);
            return scrollbarWidth;
        }

    })();

    $.isMobile = function(type){
        var reg = [];
        var any = {
            blackberry : 'BlackBerry',
            android : 'Android',
            windows : 'IEMobile',
            opera : 'Opera Mini',
            ios : 'iPhone|iPad|iPod'
        };
        type = 'undefined' == $.type(type) ? '*' : type.toLowerCase();
        if ('*' == type) reg = $.map(any, function(v){ return v; });
        else if (type in any) reg.push(any[type]);
        return !!(reg.length && navigator.userAgent.match(new RegExp(reg.join('|'), 'i')));
    };

    var isSupportViewportUnits = (function(){
        // modernizr implementation
        var $elem = $('<div style="height: 50vh; position: absolute; top: -1000px; left: -1000px;">').appendTo('body');
        var elem = $elem[0];
        var height = parseInt(window.innerHeight / 2, 10);
        var compStyle = parseInt((window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)['height'], 10);
        $elem.remove();
        return compStyle == height;
    }());

    $(function(){

        $('html').addClass($.isMobile() ? 'mobile' : 'desktop');

        // .mbr-navbar--sticky
        $(window).scroll(function(){
            $('.mbr-navbar--sticky').each(function(){
                var method = $(window).scrollTop() > 10 ? 'addClass' : 'removeClass';
                $(this)[method]('mbr-navbar--stuck')
                    .not('.mbr-navbar--open')[method]('mbr-navbar--short');
            });
        });

        // .mbr-hamburger
        $(document).on('add.cards change.cards', function(event){
            $(event.target).outerFind('.mbr-hamburger:not(.mbr-added)').each(function(){
                $(this).addClass('mbr-added')
                    .click(function(){
                        $(this)
                            .toggleClass('mbr-hamburger--open')
                            .parents('.mbr-navbar')
                            .toggleClass('mbr-navbar--open')
                            .removeClass('mbr-navbar--short');
                    }).parents('.mbr-navbar').find('a:not(.mbr-hamburger)').click(function(){
                        $('.mbr-hamburger--open').click();
                    });
            });
        });
        $(window).smartresize(function(){
            if ($(window).width() > 991)
                $('.mbr-navbar--auto-collapse .mbr-hamburger--open').click();
        }).keydown(function(event){
            if (27 == event.which) // ESC
                $('.mbr-hamburger--open').click();
        });

        if ($.isMobile() && navigator.userAgent.match(/Chrome/i)){ // simple fix for Chrome's scrolling
            (function(width, height){
                var deviceSize = [width, width];
                deviceSize[height > width ? 0 : 1] = height;
                $(window).smartresize(function(){
                    var windowHeight = $(window).height();
                    if ($.inArray(windowHeight, deviceSize) < 0)
                        windowHeight = deviceSize[ $(window).width() > windowHeight ? 1 : 0 ];
                    $('.mbr-section--full-height').css('height', windowHeight + 'px');
                });
            })($(window).width(), $(window).height());
        } else if (!isSupportViewportUnits){ // fallback for .mbr-section--full-height
            $(window).smartresize(function(){
                $('.mbr-section--full-height').css('height', $(window).height() + 'px');
            });
            $(document).on('add.cards', function(event){
                if ($('html').hasClass('mbr-site-loaded') && $(event.target).outerFind('.mbr-section--full-height').length)
                    $(window).resize();
            });
        }

        // .mbr-section--16by9 (16 by 9 blocks autoheight)
        function calculate16by9(){
            $(this).css('height', $(this).parent().width() * 9 / 16);
        }
        $(window).smartresize(function(){
            $('.mbr-section--16by9').each(calculate16by9);
        });
        $(document).on('add.cards change.cards', function(event){
            var enabled = $(event.target).outerFind('.mbr-section--16by9');
            if (enabled.length){
                enabled
                    .attr('data-16by9', 'true')
                    .each(calculate16by9);
            } else {
                $(event.target).outerFind('[data-16by9]')
                    .css('height', '')
                    .removeAttr('data-16by9');
            }
        });


        // .mbr-parallax-background
        if ($.fn.jarallax && !$.isMobile()){
            $(document).on('destroy.parallax', function(event){
                $(event.target).outerFind('.mbr-parallax-background')
                    .jarallax('destroy')
                    .css('position', '');
            });
            $(document).on('add.cards change.cards', function(event){
                $(event.target).outerFind('.mbr-parallax-background')
                    .jarallax()
                    .css('position', 'relative');
            });
        }

        // .mbr-fixed-top
        var fixedTopTimeout, scrollTimeout, prevScrollTop = 0, fixedTop = null, isDesktop = !$.isMobile();
        $(window).scroll(function(){
            if (scrollTimeout) clearTimeout(scrollTimeout);
            var scrollTop = $(window).scrollTop();
            var scrollUp  = scrollTop <= prevScrollTop || isDesktop;
            prevScrollTop = scrollTop;
            if (fixedTop){
                var fixed = scrollTop > fixedTop.breakPoint;
                if (scrollUp){
                    if (fixed != fixedTop.fixed){
                        if (isDesktop){
                            fixedTop.fixed = fixed;
                            $(fixedTop.elm).toggleClass('is-fixed');
                        } else {
                            scrollTimeout = setTimeout(function(){
                                fixedTop.fixed = fixed;
                                $(fixedTop.elm).toggleClass('is-fixed');
                            }, 40);
                        }
                    }
                } else {
                    fixedTop.fixed = false;
                    $(fixedTop.elm).removeClass('is-fixed');
                }
            }
        });
        $(document).on('add.cards delete.cards', function(event){
            if (fixedTopTimeout) clearTimeout(fixedTopTimeout);
            fixedTopTimeout = setTimeout(function(){
                if (fixedTop){
                    fixedTop.fixed = false;
                    $(fixedTop.elm).removeClass('is-fixed');
                }
                $('.mbr-fixed-top:first').each(function(){
                    fixedTop = {
                        breakPoint : $(this).offset().top + $(this).height() * 3,
                        fixed : false,
                        elm : this
                    };
                    $(window).scroll();
                });
            }, 650);
        });

        // embedded videos
        $(window).smartresize(function(){
            $('.mbr-embedded-video').each(function(){
                $(this).height(
                    $(this).width() *
                    parseInt($(this).attr('height') || 315) /
                    parseInt($(this).attr('width') || 560)
                );
            });
        });
        $(document).on('add.cards', function(event){
            if ($('html').hasClass('mbr-site-loaded') && $(event.target).outerFind('iframe').length)
                $(window).resize();
        });
        // init
        $('body > *:not(style, script)').trigger('add.cards');
        $('html').addClass('mbr-site-loaded');
        $(window).resize().scroll();

        // smooth scroll
        if (!$('html').hasClass('is-builder')){
            $(document).click(function(e){
                try {
                    var target = e.target;
                    do {
                        if (target.hash){
                            var useBody = /#bottom|#top/g.test(target.hash);
                            $(useBody ? 'body' : target.hash).each(function(){
                                e.preventDefault();
                                var goTo = target.hash == '#bottom' 
                                        ? ($(this).height() - $(window).height())
                                        : $(this).offset().top;
                                $('html, body').stop().animate({
                                    scrollTop: goTo
                                }, 800, 'easeInOutCubic');
                            });
                            break;
                        }
                    } while (target = target.parentNode);
                } catch (e) {
                   // throw e;
                }
            });
        }

    });

})(jQuery);


function dateCustomFormat(date){
    var d= new Date(date);
    var dateString = "";
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var n = month[d.getMonth()];
dateString=dateString+n+" "+d.getDate()+", "+d.getFullYear();
return dateString;
}