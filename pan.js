/*
 * Copyright (c) 2013 Taye Adeyemi
 * Open source under the MIT License.
 * https://raw.github.com/peppermintblues/pan.js/master/LICENSE
 */

(function () {
    "use strict";

var transformProp = 'transform' in document.body.style?
                'transform': 'webkitTransform' in document.body.style?
                    'webkitTransform': 'mozTransform' in document.body.style?
                        'mozTransform': 'oTransform' in document.body.style?
                            'oTransform': 'msTransform';

var overscroll = {
        x: 0,
        y: 0
    },
    dimensions = {};

interact(document.documentElement)
    .draggable({
        onstart: function (event) {

            dimensions.vw = document.documentElement.clientWidth;
            dimensions.vh = document.documentElement.clientHeight;

            dimensions.pw = document.documentElement.scrollWidth;
            dimensions.ph = document.documentElement.scrollHeight;

            dimensions.w = dimensions.pw - dimensions.vw;
            dimensions.h = dimensions.ph - dimensions.vh;

            overscroll.y = overscroll.x = 0;
        },
        onmove: function (event) {

            overscroll.x += event.dx;
            overscroll.y += event.dy;

            var scale = 20,
                sx = window.scrollX,
                sy = window.scrollY,
                ex = 0,
                ey = 0;

            if ( (sx === 0 && overscroll.x > 0)  || (sx >= dimensions.w && overscroll.x < 0) ) {
                ex = (overscroll.x >= 0? 1: -1) * (scale * Math.log(scale + Math.abs(overscroll.x)) - scale * Math.log(scale));
            }
            else {
                overscroll.x = 0;
                window.scrollBy(-event.dx, 0);
            }

            if ( (sy === 0 && overscroll.y > 0)  || (sy >= dimensions.h && overscroll.y < 0) ) {
                ey = (overscroll.y >= 0? 1: -1) * (scale * Math.log(scale + Math.abs(overscroll.y)) - scale * Math.log(scale));
            }
            else {
                overscroll.y = 0;
                window.scrollBy(0, -event.dy);
            }

            document.body.style[transformProp] =
                'translate3d(' + ex + 'px, ' + ey + 'px, 0px)';
        },
        onend: function (event) {
            document.body.style.transition = 'all 0.3s';
            document.body.style[transformProp] = '';
        }
    })
    .deltaSource('client');
})();
