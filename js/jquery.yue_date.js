/**
 * author: mesut
 * date: 2015/07/28
 * vserion: 1.0
 */

;
(function(factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery", 'Iscroll'], factory);
    } else {
        // 全局模式
        factory(jQuery, IScroll);
    }
}(function($, IScroll) {
    $.fn.yue_date = function(options) {
        var windowWidth = $(window).width();
        var defaultOptions = {
            calTitle: '日历',
            timeTitle: '时间',
            widowsWidth: windowWidth,
            translate3d: 'translate3d(' + parseInt(windowWidth) * 2 + 'px, 0px, 0px)', //页面切换效果
            czNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            intervalHeight: null, //滚动间隔  
            date: new Date(),
            hour: null,
            minute: null,
            second: null,
            callback: function() {
                alert('callback is null');
            }
        };
        var finalOptions = $.extend(defaultOptions, options);
        return this.each(function() {

            var doc = window.document;
            //蒙层构造函数
            var Overlay = function() {
                this.shadow = null;
            }
            //扩展蒙层原型
            Overlay.prototype = {
                createShadow : function() {
                    this.shadow = document.createElement('div');
                    this.shadow.setAttribute('class', 'u-h-shadow');
                    doc.body.appendChild(this.shadow);
                },
                show : function() {
                    if(!this.shadow) {
                        this.createShadow();
                    }
                    this.shadow.style.display = "block";
                    var tempHeight = document.body.scrollHeight;
                    try {
                        this.shadow.style.height = tempHeight + 'px';
                    }catch(e) {

                    }
                },
                hide : function() {
                    if(!this.shadow) {
                        this.createShadow();    
                    }
                    this.shadow.style.display = 'none';
                }
            }
            //提供给alert弹出框使用
            window.layer = new Overlay();
            layer.show();


            var $target = $(this); // 当前jquery对象
            $target.empty();

            //  关闭弹出层
            function timeSureFun() {
                $target.empty();
                layer.hide();
            }
            var $mainPanel = $('<div class="g-mainpanel"></div>');

            // 建立日历
            var $panel = $('<div></div>');
            $panel.addClass('u-panel');

            // title
            var $title = $('<div>'+ finalOptions.calTitle +'</div>');
            $title.addClass('u-title');
            $panel.append($title);

            //当前时间提示
            var $selectDay = $('<div class="u-selectday"></div>');
            var $leftSelect = $('<div></div>');
            var $rightSelect = $('<div></div>');
            $selectDay.append($leftSelect);
            $selectDay.append($rightSelect);
            $panel.append($selectDay);

            // 周一到周日
            var th = ['<table cellpadding="0" cellspacing="0">',
                '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>',
                '</table>'
            ];
            $panel.append($(th.join('')));

            // 日历，只显示31天内
            var date = finalOptions.date;
            var weekIndex = date.getDay();
            //var currentMonth = defaultOptions.czNum[parseInt(date.getMonth())];
            var currentMonth = singleToDouble(parseInt(date.getMonth()) + 1);
            var $tableContainer = $('<div></div>');
            var table = '<div class="u-cal-table">';
            var count = weekIndex + 1;
            var day = parseInt(date.getTime()) - 24 * 60 * 60 * 1000;
            for (var i = 1; i <= 31; i++) {
                if (i === 1 || i % 7 === 1) {
                    table += '<div class="row">';
                }
                if (count == i) {
                    count++;
                    day += 24 * 60 * 60 * 1000;
                    var calDate = new Date(day);
                    var calYear = calDate.getFullYear();
                    var calMonth = parseInt(calDate.getMonth()) + 1;
                    if (day == date.getTime()) {
                        table += '<div data-month="'+ calMonth +'" class="cell active" data-year="'+ calYear +'">' + calDate.getDate() + '</div>';
                        $leftSelect.text(date.getFullYear());
                        $rightSelect.text(currentMonth);
                    } else {
                        table += '<div data-month="'+ calMonth +'" class="cell" data-year="'+ calYear +'">' + calDate.getDate() + '</div>';
                    }
                } else {
                    table += '<div class="cell"></div>';
                }
                if (i % 7 === 0) {
                    table += '</div>';
                }
                if (i === 31) {
                    table += '</div>';
                }
            }
            $tableContainer.append($(table));
            $panel.append($tableContainer);
            $tableContainer.on('click', function(e) {
                var tar = $(e.target);
                if(!tar.attr('data-month')) return;
                $leftSelect.text(tar.attr('data-year'));
                $rightSelect.text(singleToDouble(parseInt(tar.attr('data-month'))));
                tar.parent('div').parent('div').find('.cell').removeClass('active')
                if (tar.hasClass('cell')) {
                    tar.addClass('active');
                }
            });
            var bottom = $('<div class="bottom"></div>');
            var cancell = $('<a href="javascript:void(0);">取消</a>');
            var sure = $('<a href="javascript:void(0);">确定</a>');
            sure.on('click', selectTimeFun);
            cancell.on('click', function(){
                timeSureFun();
            });
            bottom.append(sure)
            bottom.append(cancell)
            $panel.append(bottom);
            $mainPanel.append($panel);

            // 建立小时分钟时间
            $timePanel = $('<div class="u-timepanel"></div>');
            $timePanel.css('-webkit-transform', defaultOptions.translate3d);
            $timePanel.css('-webkit-transition', '-webkit-transform 200ms');
            $timePanel.addClass('u-panel');
            $mainPanel.append($timePanel);
            $timePanel.hide();
            function selectTimeFun() {
                $timePanel.css('height', $panel.height());
                $panel.hide();
                setCurrentTime(); // 设置时间
                $timePanel.show();
                $timePanel.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');

                function loaded() {
                    // 初始化默认时间， 获得每个滚动距离，然后获得时间小时或者分钟，相乘以可得滚动的总距离
                    var intHeight = parseInt(finalOptions.intervalHeight.height());
                    var ct = finalOptions.date || new Date();
                    var ch = parseInt(ct.getHours());
                    var cm = parseInt(ct.getMinutes());
                    finalOptions.hour = ch;
                    finalOptions.minute = cm;

                    myScroll1 = new IScroll('.middlemain1', {
                        mouseWheel: true,
                        startY: -(ch*intHeight) //初始滚动距离
                    });
                    // 滚动结束事件监听 保证每页中间的时间为选择的时间
                    myScroll1.on('scrollEnd', function(e) {
                        var intHeight = parseInt(finalOptions.intervalHeight.height());
                        var stopHeight = parseInt(this.y);
                        var finalHeight = (Math.floor(stopHeight / intHeight)) * intHeight;
                        myScroll1.scrollTo(0, finalHeight);
                        finalOptions.hour = - (Math.floor(stopHeight / intHeight));                        
                    });

                    myScroll2 = new IScroll('.middlemain2', {
                        mouseWheel: true,
                        startY: -(cm*intHeight)
                    });
                    myScroll2.on('scrollEnd', function(e) {
                        var stopHeight = parseInt(this.y);
                        var finalHeight = (Math.floor(stopHeight / intHeight)) * intHeight;
                        myScroll2.scrollTo(0, finalHeight);
                        finalOptions.minute = - (Math.floor(stopHeight / intHeight));
                    });

                }
                loaded();
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            }

            var $timeTitle = $('<div>'+ finalOptions.timeTitle +'</div>');
            $timeTitle.addClass('u-title');
            $timePanel.append($timeTitle);

            var $timeSelectDay = $('<div class="u-timeselectday"></div>');
            var $timeSeftSelect = $('<div></div>');
            var $timeMiddleSelect = $('<div></div>');
            var $timeRightSelect = $('<div>30</div>');
            function setCurrentTime() { //设置real time 面板的时间
                $timeRightSelect.text($('.u-cal-table .active').text());
                $timeSeftSelect.text($leftSelect.text());
                $timeMiddleSelect.text($rightSelect.text());
            }
            $timeSelectDay.append($timeSeftSelect);
            $timeSelectDay.append($timeMiddleSelect);
            $timeSelectDay.append($timeRightSelect);
            $timePanel.append($timeSelectDay);

            // real time
            var $realTime = $('<div class="u-realtime"></div>');
            var $leftRealTime = $('<div class="timeleft"></div>');
            var $rightRealTime = $('<div class="timeright"></div>');
            var $topIcon1 = $('<div class="topicon"></div>');
            var $topIcon2 = $('<div class="topicon"></div>');
            var $middleMain1 = $('<div class="middlemain middlemain1"></div>');
            var $iscroll1 = $('<div class="iscroll"></div>');
            var $middleScroll1 = $('<div></div>');
            $leftRealTime.append($middleScroll1);

            var $middleMain2 = $('<div class="middlemain middlemain2"></div>');
            var $iscroll2 = $('<div class="iscroll"></div>');
            var $middleScroll2 = $('<div></div>');
            $rightRealTime.append($middleScroll2);

            var $bottomIcon1 = $('<div class="bottomicon"></div>');
            var $bottomIcon2 = $('<div class="bottomicon"></div>');

            function singleToDouble(num) {
                if (isNaN(num)) {
                    return -1;
                }
                if (0 <= num && num <= 9) {
                    return '0' + num;
                }
                return num;
            }

            for (var j = 0; j <= 23; j++) {
                if (j == 0) {
                    finalOptions.intervalHeight = $('<div></div>');
                    $iscroll1.append(finalOptions.intervalHeight);
                }
                $iscroll1.append('<div>' + singleToDouble(j) + '</div>')
                if (j == 23) {
                    $iscroll1.append('<div></div>');
                }
            }
            for (j = 0; j <= 59; j++) {
                if (j == 0) {
                    $iscroll2.append('<div></div>');
                }
                $iscroll2.append('<div>' + singleToDouble(j) + '</div>');
                if (j == 59) {
                    $iscroll2.append('<div></div>');
                }
            }

            $leftRealTime.append($topIcon1);
            $middleMain1.append($iscroll1);
            $leftRealTime.append($middleMain1);
            $leftRealTime.append($bottomIcon1);

            $rightRealTime.append($topIcon2);
            $middleMain2.append($iscroll2);
            $rightRealTime.append($middleMain2);
            $rightRealTime.append($bottomIcon2);

            $realTime.append($leftRealTime);
            $realTime.append($rightRealTime);
            $timePanel.append($realTime);

            var timeBottom = $('<div class="bottom"></div>');
            var timeCancell = $('<a href="javascript:void(0);">取消</a>');
            var timeSure = $('<a href="javascript:void(0);">确定</a>');
            timeSure.on('click', function() {
                timeSureFun();
                var intYear = parseInt($timeSeftSelect.text());
                var intMonth = parseInt($timeMiddleSelect.text()) - 1;
                var intDay = parseInt($timeRightSelect.text());
                finalOptions.date = new Date(intYear,intMonth,intDay,finalOptions.hour,finalOptions.minute,00);
                finalOptions.callback(finalOptions);
            });
            timeCancell.on('click', function(){
                timeSureFun()
            });

            timeBottom.append(timeSure);
            timeBottom.append(timeCancell);
            $timePanel.append(timeBottom);

            $target.append($mainPanel);
        });
    };
}));