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
		var windowWidth = $(window).width(),
			defaultOptions = {
				calTitle: '日历',
				timeTitle: '时间',
				type: 'all', //展示效果是否含有小时选择，默认值为all，可选值all、notime、onlytime;
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
			},
			finalOptions = $.extend(defaultOptions, options);
		return this.each(function() {

			var doc = window.document;
			//蒙层构造函数
			var Overlay = function() {
					this.shadow = null;
					this.show();
					$(".u-h-shadow").click(function() {
						timeSureFun();
					})
				}
				//扩展蒙层原型
			Overlay.prototype = {
					createShadow: function() {
						this.shadow = document.createElement('div');
						this.shadow.setAttribute('class', 'u-h-shadow');
						doc.body.appendChild(this.shadow);
					},
					show: function() {
						if (!this.shadow) {
							this.createShadow();
						}
						this.shadow.style.display = "block";
						var tempHeight = document.body.scrollHeight;
						try {
							this.shadow.style.height = tempHeight + 'px';
						} catch (e) {

						}
					},
					hide: function() {
						if (!this.shadow) {
							this.createShadow();
						}
						this.shadow.style.display = 'none';
					}
				}
				//提供给alert弹出框使用
			window.layer = new Overlay();

			var $target = $(this); // 当前jquery对象
			$target.empty();

			//  关闭弹出层
			function timeSureFun() {
				$target.empty();
				layer.hide();
			}

			var $mainPanel = $('<div class="g-mainpanel"></div>');
			if (finalOptions.type === 'notime') {
				Layout1();
			} else if (finalOptions.type === 'onlytime') {

			} else if (finalOptions.type === 'all' && finalOptions.type != null || finalOptions.type === '') {
				// 建立日历
				var $panel = $('<div class="u-panel"></div>');

				// title
				var $title = $('<div class="u-title">' + finalOptions.calTitle + '</div>');
				$panel.append($title);

				//当前时间提示
				var $selectDay = $('<div class="u-selectday"></div>'),
					$leftSelect = $('<div></div>'),
					$rightSelect = $('<div></div>');
				$selectDay.append($leftSelect, $rightSelect);
				$panel.append($selectDay);

				// 周一到周日
				var th = ['<table cellpadding="0" cellspacing="0">',
					'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>',
					'</table>'
				];
				$panel.append($(th.join('')));

				// 日历，只显示31天内
				var date = finalOptions.date;
				//var currentMonth = defaultOptions.czNum[parseInt(date.getMonth())];
				var currentMonth = singleToDouble(parseInt(date.getMonth()) + 1);
				var $tableContainer = $('<div></div>');
				var table = '<div class="u-cal-table">';
				var count = date.getDay() + 1;
				var day = parseInt(date.getTime()) - 24 * 60 * 60 * 1000;
				for (var i = 1; i <= 35; i++) {
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
							table += '<div data-month="' + calMonth + '" class="cell active" data-year="' + calYear + '">' + calDate.getDate() + '</div>';
							$leftSelect.text(date.getFullYear());
							$rightSelect.text(currentMonth);
						} else {
							table += '<div data-month="' + calMonth + '" class="cell" data-year="' + calYear + '">' + calDate.getDate() + '</div>';
						}
					} else {
						table += '<div class="cell"></div>';
					}
					if (i % 7 === 0) {
						table += '</div>';
					}
					if (i === 35) {
						table += '</div>';
					}
				}
				$tableContainer.append($(table));
				$panel.append($tableContainer);
				$tableContainer.on('click', function(e) {
					var tar = $(e.target);
					if (!tar.attr('data-month')) return;
					$leftSelect.text(tar.attr('data-year'));
					$rightSelect.text(singleToDouble(parseInt(tar.attr('data-month'))));
					tar.parents('div.u-cal-table').find('.cell').removeClass('active')
					if (tar.hasClass('cell')) {
						tar.addClass('active');
					}
				});
				var bottom = $('<div class="bottom"></div>'),
					sure = $('<a href="javascript:void(0);">确定</a>'),
					cancell = $('<a href="javascript:void(0);">取消</a>');
				sure.on('click', selectTimeFun);
				cancell.on('click', timeSureFun);
				bottom.append(sure, cancell);
				$panel.append(bottom);
				$mainPanel.append($panel);


				// 建立小时分钟时间
				$timePanel = $('<div class="u-timepanel"></div>');
				$timePanel.css('-webkit-transform', defaultOptions.translate3d);
				$timePanel.css('-webkit-transition', '-webkit-transform 200ms');
				$timePanel.addClass('u-panel');
				$mainPanel.append($timePanel);
				$timePanel.hide();

				var $timeTitle = $('<div>' + finalOptions.timeTitle + '</div>');
				$timeTitle.addClass('u-title');
				$timePanel.append($timeTitle);

				var $timeSelectDay = $('<div class="u-timeselectday"></div>'),
					$timeSeftSelect = $('<div></div>'),
					$timeMiddleSelect = $('<div></div>'),
					$timeRightSelect = $('<div>30</div>');
				$timeSelectDay.append($timeSeftSelect, $timeMiddleSelect, $timeRightSelect);
				$timePanel.append($timeSelectDay);

				function setCurrentTime() { //设置real time 面板的时间
					$timeSeftSelect.text($leftSelect.text());
					$timeMiddleSelect.text($rightSelect.text());
					$timeRightSelect.text($('.u-cal-table .active').text());
				}

				// real time
				var $realTime = $('<div class="u-realtime"></div>'),
					$leftRealTime = $('<div class="timeleft"></div>'),
					$rightRealTime = $('<div class="timeright"></div>'),
					$topIcon = $('<div class="topicon"></div>'),
					$bottomIcon = $('<div class="bottomicon"></div>'),
					$middleMain1 = $('<div class="middlemain middlemain1"></div>'),
					$iscroll1 = $('<div class="iscroll"></div>'),
					$middleScroll1 = $('<div></div>');
				$leftRealTime.append($middleScroll1);

				var $middleMain2 = $('<div class="middlemain middlemain2"></div>'),
					$iscroll2 = $('<div class="iscroll"></div>'),
					$middleScroll2 = $('<div></div>');
				$rightRealTime.append($middleScroll2);



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

				$leftRealTime.append($topIcon, $middleMain1, $bottomIcon);
				$middleMain1.append($iscroll1);

				$rightRealTime.append($topIcon.clone(), $middleMain2, $bottomIcon.clone());
				$middleMain2.append($iscroll2);

				$realTime.append($leftRealTime, $rightRealTime);
				$timePanel.append($realTime);

				var timeBottom = $('<div class="bottom"></div>'),
					timeCancell = $('<a href="javascript:void(0);">取消</a>'),
					timeSure = $('<a href="javascript:void(0);">确定</a>');
				timeBottom.append(timeSure, timeCancell);
				$timePanel.append(timeBottom);
				timeSure.on('click', function() {
					timeSureFun();
					var intYear = parseInt($timeSeftSelect.text()),
						intMonth = parseInt($timeMiddleSelect.text()) - 1,
						intDay = parseInt($timeRightSelect.text());
					finalOptions.date = new Date(intYear, intMonth, intDay, finalOptions.hour, finalOptions.minute, 00);
					finalOptions.callback(finalOptions);
				});
				timeCancell.on('click', function() {
					timeSureFun()
				});
				$target.append($mainPanel);
			}

			function singleToDouble(num) {
				if (isNaN(num)) {
					return -1;
				}
				if (0 <= num && num <= 9) {
					return '0' + num;
				}
				return num;
			}

			//选择小时分钟
			function selectTimeFun() {
				$timePanel.css('height', $panel.height());
				$panel.hide();
				setCurrentTime(); // 设置时间
				$timePanel.show();
				$timePanel.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
				loaded();
				document.addEventListener('touchmove', function(e) {
					e.preventDefault();
				}, false);
			};

			//显示小时分钟
			function loaded() {
				// 初始化默认时间， 获得每个滚动距离，然后获得时间小时或者分钟，相乘以可得滚动的总距离
				var intHeight = parseInt(finalOptions.intervalHeight.height()),
					ct = finalOptions.date || new Date(),
					ch = parseInt(ct.getHours()),
					cm = parseInt(ct.getMinutes());
				finalOptions.hour = singleToDouble(ch);
				finalOptions.minute = singleToDouble(cm);

				myScroll1 = new IScroll('.middlemain1', {
					mouseWheel: true,
					startY: -(ch * intHeight) //初始滚动距离
				});
				// 滚动结束事件监听 保证每页中间的时间为选择的时间
				myScroll1.on('scrollEnd', function(e) {
					var intHeight = parseInt(finalOptions.intervalHeight.height()),
						stopHeight = parseInt(this.y),
						finalHeight = (Math.floor(stopHeight / intHeight)) * intHeight;
					myScroll1.scrollTo(0, finalHeight);
					finalOptions.hour = singleToDouble(-(Math.floor(stopHeight / intHeight)));
				});

				myScroll2 = new IScroll('.middlemain2', {
					mouseWheel: true,
					startY: -(cm * intHeight)
				});
				myScroll2.on('scrollEnd', function(e) {
					var stopHeight = parseInt(this.y),
						finalHeight = (Math.floor(stopHeight / intHeight)) * intHeight;
					myScroll2.scrollTo(0, finalHeight);
					finalOptions.minute = singleToDouble(-(Math.floor(stopHeight / intHeight)));
				});
			};


		});
	};
}));