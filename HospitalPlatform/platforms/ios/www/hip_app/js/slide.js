var _index=0;
var _sitename="";
var _slideFunction = null;
var _translateX = 0;
var _translateY = 0;
var Jsonp = {
    loadScript: function(url) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    this.onreadystatechange = null;
                    document.body.removeChild(this);
                }
            };
        } else {
            script.onload = function() {
                document.body.removeChild(this);
            };
        }
        script.setAttribute('src', url);
        document.body.appendChild(script);
    },
    encodeParameters: function(arg, parameters) {
        var paras = [];
        for (parameter in parameters) {
            paras.push(escape(parameter) + "=" + escape(parameters[parameter]));
        }
        return paras.length > 0 ? (arg == -1 ? '?' : '&') + paras.join('&') : '';
    },
    request: function(url, param) {
        if (typeof url === 'string') var str = url.indexOf('?');
        this.loadScript(url + this.encodeParameters(str, param));
    }
};
// IE8判断
var _ie8 = (function() {
    var rv = -1;
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
        // console.log(rv)
    }
    return rv != -1 && rv < 10;
})();

(function(window) {
    var navigator = window.navigator,
        isAndroid = /Android/i.test(navigator.userAgent),
        msPointerEnabled = navigator.msPointerEnabled,
        TOUCH_EVENTS = {
            start: msPointerEnabled ? 'MSPointerDown' : 'touchstart',
            move: msPointerEnabled ? 'MSPointerMove' : 'touchmove',
            end: msPointerEnabled ? 'MSPointerUp' : 'touchend'
        },
        slice = Array.prototype.slice,
        dummyStyle = document.createElement('div').style,
        vendor = (function() {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;
            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }
            return false;
        })(),
        isTouch = false,
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
        prefixStyle = function(style) {
            if (vendor === '') return style;
            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        },
        transform = prefixStyle('transform'),
        transitionDuration = prefixStyle('transitionDuration'),
        transitionEndEvent = (function() {
            if (vendor == 'webkit' || vendor === 'O') {
                return vendor.toLowerCase() + 'TransitionEnd';
            }
            return 'transitionend';
        })(),
        noop = function() {},
        addClass = function(elem, value) {
            var classes, cur, clazz, i;
            classes = (value || '').match(/\S+/g) || [];
            cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n]/g, ' ') : ' ');
            if (cur) {
                i = 0;
                while ((clazz = classes[i++])) {
                    if (cur.indexOf(' ' + clazz + ' ') < 0) {
                        cur += clazz + ' ';
                    }
                }
                elem.className = cur.trim();
            }
        },
        removeClass = function(elem, value) {
            var classes, cur, clazz, i;
            classes = (value || '').match(/\S+/g) || [];
            cur = elem.nodeType === 1 && (elem.className ? (' ' + elem.className + ' ').replace(/[\t\r\n]/g, ' ') : ' ');
            if (cur) {
                i = 0;
                while ((clazz = classes[i++])) {
                    while (cur.indexOf(' ' + clazz + ' ') >= 0) {
                        cur = cur.replace(' ' + clazz + ' ', ' ');
                    }
                }
                elem.className = cur.trim();
            }
        },
        listenTransition = function(target, duration, callbackFn) {
            var me = this,
                clear = function() {
                    if (target.transitionTimer) clearTimeout(target.transitionTimer);
                    target.transitionTimer = null;
                    target.removeEventListener(transitionEndEvent, handler, false);
                },
                handler = function() {
                    clear();
                    if (callbackFn) callbackFn.call(me);
                };
            clear();
            target.addEventListener(transitionEndEvent, handler, false);
            target.transitionTimer = setTimeout(handler, duration + 100);
        };
    // console.log(cssVendor)
    var Slide = function(config) {
        config = config || {};
        for (var o in config) {
            this[o] = config[o];
        }
        _slideFunction = this.slideFunction;
        this.el = typeof this.targetSelector === 'string' ? document.querySelector(this.targetSelector) : this.targetSelector;
        if (msPointerEnabled) this.el.style.msTouchAction = 'pan-y';
        this.el.style.overflow = 'hidden';
        this.wrap = this.wrapSelector ? this.el.querySelector(this.wrapSelector) : this.el.children[1];
        this.trans = typeof this.transSelector === 'string' ? document.querySelector(this.transSelector) : this.transSelector;

		// this.wrap.style.cssText = cssVendor + 'transform:translate3d(' + (-100 * this.activeIndex) + '%,0px,0px);' + cssVendor + 'transition:' + cssVendor + 'transform 0ms;';
        var height = $(window).height()-this.wrap.offsetTop;
        if (_ie8) {
            this.wrap.style.cssText = cssVendor + 'transform:translate(' + (-this.getItemWidth() * this.activeIndex) + 'px,0px);' + cssVendor + 'transition:' + cssVendor + 'transform 0ms;height:'+height+"px";
        } else {
            // console.log(cssVendor + 'transform:translate(' + (-this.getItemWidth() * this.activeIndex) + 'px,0px);' + cssVendor + 'transition:' + cssVendor + 'transform 0ms;')
            this.wrap.style.cssText = cssVendor + 'transform:translate3d(' + (-this.getItemWidth() * this.activeIndex) + 'px,0px,0px);' + cssVendor + 'transition:' + cssVendor + 'transform 0ms;height:'+height+"px";
        };
        this.items = slice.call(this.wrap.children, 0);
        var width = this.el.offsetWidth;//update by deathmask
        // var width = this.width === 'auto' ? this.el.offsetWidth : this.width;
        // console.log(width)
        var active = this.activeIndex;
        _index = this.activeIndex;
        // console.log(_index)
        /*        this.items.forEach(function(item, i) {
         item.style.cssText ='width:'+width+'px';
         });*/
        this.setWidth(width);
        if (this.prevSelector) {
            this.prevEl = document.querySelector(this.prevSelector);
            this.prevEl.addEventListener('click', this, false);
        }
        if (this.nextSelector) {
            this.nextEl = document.querySelector(this.nextSelector);
            this.nextEl.addEventListener('click', this, false);
        }
        if (this.indicatorSelector) {
            this.indicators = document.querySelectorAll(this.indicatorSelector);
            this.indicators = slice.call(this.indicators, 0);
        }
		this.num=this.indicators.length;
        this._box = this.targetdom;
        this.el.addEventListener(TOUCH_EVENTS.start, this, false);
        /*window.addEventListener("resize", resizeFix, false)
         resizeFix function(){
         }*/
        // console.log(this.activeIndex +""+this._box)
            // console.log()
        var _lastActive = this.activeIndex;
        this.to(this.activeIndex, true);
        this.running = false;
        if (this.autoPlay) {
            this.start();
        };
    };
    Slide.prototype = {
        activeIndex: 0,
        autoPlay: false,
        interval: 4000,
        duration: 100,
        beforeSlide: noop,
        /**
         * 切换完成回调函数
         */
        onSlide: noop,
        // private
        getItemWidth: function() {
            return this.el.offsetWidth;
        },
        setWidth: function(width) {
            this.wrap.style.width = (width * this.items.length) + 'px';
            this.items.forEach(function(item) {
                item.style.width = width + 'px';
            });
        },
        // private
        getLastIndex: function() {
            return this.items.length - 1;
        },
        // private
        getContext: function(index) {
            var last = this.getLastIndex(),
                prev,
                next;
            if (typeof index === 'undefined') {
                index = this.activeIndex;
            }
            prev = index - 1;
            next = index + 1;
            if (prev < 0) {
                prev = last;
            }
            if (next > last) {
                next = 0;
            }
            return {
                prev: prev,
                next: next,
                active: index
            };
        },
        /**
         * 开始自动切换
         */
        start: function() {
            if (!this.running) {
                this.running = true;
                this.clear();
                this.run();
            }
        },
        /**
         * 停止自动切换
         */
        stop: function() {
            this.running = false;
            this.clear();
        },
        // private
        clear: function() {
            clearTimeout(this.slideTimer);
            this.slideTimer = null;
        },
        // private
        run: function() {
            var me = this;
            if (!me.slideTimer) {
                me.slideTimer = setInterval(function() {
                    me.to(me.getContext().next);
                }, me.interval);
            }
        },
        /**
         * 切换到上一个
         */
        prev: function() {
            this.to(this.activeIndex - 1);
        },
        /**
         * 切换到下一个
         */
        next: function() {
            this.to(this.activeIndex + 1);
        },
        // private
        onPrevClick: function() {
            this.clear();
            this.prev();
            if (this.autoPlay) this.run();
        },
        // private
        onNextClick: function() {
            this.clear();
            this.next();
            if (this.autoPlay) this.run();
        },
        /**
         * 切换到index
         * @param {Number} toIndex
         * @param {Boolean} silent 无动画效果
         */
        to: function(toIndex, silent) {
            var active = this.activeIndex,
                last = this.getLastIndex();
            if (toIndex >= 0 && toIndex <= last && toIndex != active && this.beforeSlide(toIndex) !== false) {
                this.slide(toIndex, silent);
            } else {
                this.slide(active, silent);
            }
        },
        // private
        slide: function(toIndex, silent) {
            var me = this,
                active = me.activeIndex,
                lastActive = active,
                handler = function() {
                    me.wrap.removeEventListener(transitionEndEvent, handler, false);
                    me.wrap.style[transitionDuration] = '0ms';
                    if (me.indicators && me.indicatorCls) {
                        if (me.indicators[lastActive]) removeClass(me.indicators[lastActive], me.indicatorCls);
                        if (me.indicators[me.activeIndex]) addClass(me.indicators[me.activeIndex], me.indicatorCls);
                    }
                    me.onSlide(me.activeIndex);
                };
            me.activeIndex = toIndex;
            // alert(this._box);
            // console.log(this._box )
            // console.log(toIndex)
            /*            console.log(me.wrap.style[transform] = 'translate(' + (-me.getItemWidth() * toIndex) + 'px, 0px)')*/
            if (!silent) listenTransition(me.wrap, me.duration, handler);
            me.wrap.style[transitionDuration] = silent ? '0ms' : me.duration + 'ms';
			var translateX = (-me.getItemWidth() * toIndex);
            if (_ie8) {
                me.wrap.style[transform] = 'translate(' + translateX+ 'px, 0px)';
            } else {
                me.wrap.style[transform] = 'translate3d(' + translateX + 'px, 0px, 0px)';
            };
			_translateX = translateX;
			this.trans.style[transform] = 'translate3d(' + this.getHeadWidth(toIndex) + 'px, 0px, 0px)';
			this.trans.style["width"] = me.indicators[toIndex].offsetWidth+"px";
            // me.wrap.style[transform] = 'translate3d(' + (-100 * toIndex) + '%, 0px, 0px)';
            if (silent) handler();
            if(_slideFunction!=null)
            _slideFunction(toIndex);
        },
		getHeadWidth:function(toIndex){
			var sum = 0;
			for(var mm=0;mm<this.num;mm++){
				if(toIndex==mm){
					return sum;
				}
				sum += this.indicators[mm].offsetWidth;
			}
						
		},
        // private
        onTouchStart: function(e) {
            // e.preventDefault();
            var me = this;
            if (me.prevEl && me.prevEl.contains && me.prevEl.contains(e.target) ||
                me.nextEl && me.nextEl.contains && me.nextEl.contains(e.target)) {
                return;
            }

            clearTimeout(me.androidTouchMoveTimeout);
            me.clear();
            if (isAndroid) {
                me.androidTouchMoveTimeout = setTimeout(function() {
                    me.resetStatus();
                }, 3000);
            }

            me.el.removeEventListener(TOUCH_EVENTS.move, me, false);
            me.el.removeEventListener(TOUCH_EVENTS.end, me, false);
            me.el.addEventListener(TOUCH_EVENTS.move, me, false);
            me.el.addEventListener(TOUCH_EVENTS.end, me, false);
            delete me.horizontal;

            var pageX = msPointerEnabled ? e.pageX : e.touches[0].pageX,
                pageY = msPointerEnabled ? e.pageY : e.touches[0].pageY;

            me.touchCoords = {};
            me.touchCoords.startX = pageX;
            me.touchCoords.startY = pageY;
            me.touchCoords.timeStamp = e.timeStamp;
        },

        // private
        onTouchMove: function(e) {
            var me = this;
            // e.preventDefault();
            clearTimeout(me.touchMoveTimeout);
            if (msPointerEnabled) {
                // IE10 for Windows Phone 8 的 pointerevent， 触发 MSPointerDown 之后，
                // 如果触控移动轨迹不符合 -ms-touch-action 规则，则不会触发 MSPointerUp 事件。
                me.touchMoveTimeout = setTimeout(function() {
                    me.resetStatus();
                }, 3000);
            }
            if (!me.touchCoords) {
                return;
            }

            me.touchCoords.stopX = msPointerEnabled ? e.pageX : e.touches[0].pageX;
            me.touchCoords.stopY = msPointerEnabled ? e.pageY : e.touches[0].pageY;

            var offsetX = me.touchCoords.startX - me.touchCoords.stopX,
                absX = Math.abs(offsetX),
                absY = Math.abs(me.touchCoords.startY - me.touchCoords.stopY);

            if (typeof me.horizontal !== 'undefined') {
                if (offsetX !== 0) {
                    e.preventDefault();
                }
            } else {
                if (absX > absY) {
                    me.horizontal = true;
                    if (offsetX !== 0) {
                        e.preventDefault();
                    }
                    if (me.iscroll && me.iscroll.enabled) {
                        me.iscroll.disable();
                    }
                    clearTimeout(me.androidTouchMoveTimeout);
                } else {
                    delete me.touchCoords;
                    me.horizontal = false;
                    return;
                }
            }

            var itemWidth = me.getItemWidth(),
                translateX = me.activeIndex * itemWidth,
                active = me.activeIndex,
                last = me.getLastIndex();

            if ((active === 0 && offsetX < 0) || (active == last && offsetX > 0)) {
                translateX += Math.ceil(offsetX / Math.log(Math.abs(offsetX)));
            } else {
                translateX += offsetX;
            }
            if (absX < itemWidth) {
                // me.wrap.style[transform] = 'translate3d(' + -translateX + 'px, 0px, 0px)';

                if (_ie8) {
                    me.wrap.style[transform] = 'translate(' + -translateX + 'px, 0px)';
                } else {
                    me.wrap.style[transform] = 'translate3d(' + -translateX + 'px, 0px, 0px)';
                };
				
				
				if (!((active === 0 && offsetX < 0) || (active == last && offsetX > 0))) {
					var next = offsetX>0?active+1:active-1;
					if(next<0||next>last)next = active;
					var nextWidth = me.indicators[next].offsetWidth;
					var activeWidth = this.trans.offsetWidth;
					var x = this.getHeadWidth(active)+offsetX;
					var nextHeadWidth = this.getHeadWidth(next);
					if(nextWidth>activeWidth){
						var o = this.trans.offsetWidth + Math.abs(offsetX);
						if(o>nextWidth)o=nextWidth;
						this.trans.style["width"]= o+"px";	
										
					}
					else{
						var o = this.trans.offsetWidth - Math.abs(offsetX);
						if(o<nextWidth)o=nextWidth;
						this.trans.style["width"]= o+"px";	
						
					}
					if(next>active){
						if(x>nextHeadWidth)x=nextHeadWidth;		
					}
					else{
						if(x<nextHeadWidth)x=nextHeadWidth;					
					}
					this.trans.style[transform] = 'translate3d(' + x + 'px, 0px, 0px)';
				}
				
            }
        },
		
        // private
        onTouchEnd: function(e) {
            clearTimeout(this.androidTouchMoveTimeout);
            clearTimeout(this.touchMoveTimeout);
            this.el.removeEventListener(TOUCH_EVENTS.move, this, false);
            this.el.removeEventListener(TOUCH_EVENTS.end, this, false);
            if (this.touchCoords) {
                var itemWidth = this.getItemWidth(),
                    absX = Math.abs(this.touchCoords.startX - this.touchCoords.stopX),
                    active = this.activeIndex,
                    transIndex;

                if (!isNaN(absX) && absX !== 0) {
                    if (absX > itemWidth) {
                        absX = itemWidth;
                    }
                    if (absX >= 80 || (e.timeStamp - this.touchCoords.timeStamp < 200)) {
                        if (this.touchCoords.startX > this.touchCoords.stopX) {
                            transIndex = active + 1;
                        } else {
                            transIndex = active - 1;
                        }
                    } else {
                        transIndex = active;
                    }
                    _index = transIndex;
                    this.to(transIndex);
                    delete this.touchCoords;
                }
            }
            this.resetStatus();
        },
        resetStatus: function() {
            if (this.iscroll) this.iscroll.enable();
            if (this.autoPlay) this.run();
        },
        refresh: function() {
            var last = this.getLastIndex();
            this.items = slice.call(this.wrap.children, 0);
            if (this.activeIndex > last) {
                this.to(last, true);
            }
        },
        handleEvent: function(e) {
            switch (e.type) {
                case TOUCH_EVENTS.start:
                    this.onTouchStart(e);
                    break;
                case TOUCH_EVENTS.move:
                    this.onTouchMove(e);
                    break;
                case TOUCH_EVENTS.end:
                    this.onTouchEnd(e);
                    break;
                case 'click':
                    if (e.target == this.prevEl) {
                        this.onPrevClick();
                    } else if (e.target == this.nextEl) {
                        this.onNextClick();
                    }
                    break;
            }
        },
        /**
         * 销毁
         */
        destroy: function() {
            this.destroyed = true;
            this.stop();
            if (this.prevEl) {
                this.prevEl.removeEventListener('click', this, false);
                this.prevEl = null;
            }
            if (this.nextEl) {
                this.nextEl.removeEventListener('click', this, false);
                this.nextEl = null;
            }
            this.indicators = null;
            this.el.removeEventListener(TOUCH_EVENTS.start, this, false);
            this.el.removeEventListener(TOUCH_EVENTS.move, this, false);
            this.el.removeEventListener(TOUCH_EVENTS.end, this, false);
            this.el = this.wrap = this.items = null;
            this.iscroll = null;
        }
    };
    dummyStyle = null;
    window.Slide = Slide;
})(window);


if(AmCharts!=null){
	AmCharts.findPosX = function(a) {
		var b = a,
		c = a.offsetLeft;
		if (a.offsetParent) {
			for (; a = a.offsetParent;) c += a.offsetLeft;
			for (; (b = b.parentNode) && b != document.body;) c -= b.scrollLeft || 0
		}
		c+=_translateX;
		return c
	};
	AmCharts.findPosY = function(a) {
		var b = a,
		c = a.offsetTop;
		if (a.offsetParent) {
			for (; a = a.offsetParent;) c += a.offsetTop;
			for (; (b = b.parentNode) && b != document.body;) c -= b.scrollTop || 0
		}
		c+=_translateY;
		return c
	};
}
