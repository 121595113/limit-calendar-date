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
				year: null,
				moth: null,
				day: null,
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
			};
			//提供给alert弹出框使用
			window.layer = new Overlay();

			var $target = $(this); // 当前jquery对象
			$target.empty();

			//日历的构造函数
			function calendar() {
				var self = this;
				this.$target = $target;
				this.$mainPanel = $('<div class="g-mainpanel"></div>');
				this.Layerout1();
				this.Layerout2();
				//点击蒙板隐藏
				$(".u-h-shadow").click(function() {
					self.timeSureFun();
				})

				this.setCurrentTime = function() {
					this.$timeSeftSelect.text(this.$leftSelect.text());
					this.$timeMiddleSelect.text(this.$rightSelect.text());
					this.$timeRightSelect.text($('.u-cal-table .active').text());
				}

				//选择小时分钟
				this.selectTimeFun = function() {
					this.$timePanel.css('height', this.$panel.height());
					this.$panel.hide();
					this.setCurrentTime(); // 设置时间
					this.$timePanel.show();
					this.$timePanel.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
					self.loaded();
					document.addEventListener('touchmove', function(e) {
						e.preventDefault();
					}, false);
				}

			}
			calendar.prototype = {
				Layerout2: function() {
					var self = this;
					// 建立小时分钟时间
					this.$timePanel = $('<div class="u-timepanel u-panel"></div>');
					this.$timePanel.css({
						'-webkit-transform': defaultOptions.translate3d,
						'-webkit-transition': '-webkit-transform 200ms'
					});
					if (finalOptions.type != 'notime') {
						this.$mainPanel.append(this.$timePanel);
					}
					this.$timePanel.hide();

					var $timeTitle = $('<div class="u-title">' + finalOptions.timeTitle + '</div>'), //标题
						$timeSelectDay = $('<div class="u-timeselectday"></div>'); //当前时间提示
					this.$timeSeftSelect = $('<div></div>');
					this.$timeMiddleSelect = $('<div></div>');
					this.$timeRightSelect = $('<div>30</div>');
					$timeSelectDay.append(this.$timeSeftSelect, this.$timeMiddleSelect, this.$timeRightSelect);

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
					for (var j = 0; j <= 23; j++) {
						if (j == 0) {
							finalOptions.intervalHeight = $('<div></div>');
							$iscroll1.append(finalOptions.intervalHeight);
						}
						$iscroll1.append('<div>' + this.singleToDouble(j) + '</div>')
						if (j == 23) {
							$iscroll1.append('<div></div>');
						}
					}

					var $middleMain2 = $('<div class="middlemain middlemain2"></div>'),
						$iscroll2 = $('<div class="iscroll"></div>'),
						$middleScroll2 = $('<div></div>');
					$rightRealTime.append($middleScroll2);
					for (j = 0; j <= 59; j++) {
						if (j == 0) {
							$iscroll2.append('<div></div>');
						}
						$iscroll2.append('<div>' + this.singleToDouble(j) + '</div>');
						if (j == 59) {
							$iscroll2.append('<div></div>');
						}
					}
					//小时
					$middleMain1.append($iscroll1);
					$leftRealTime.append($topIcon, $middleMain1, $bottomIcon);
					//分钟
					$middleMain2.append($iscroll2);
					$rightRealTime.append($topIcon.clone(), $middleMain2, $bottomIcon.clone());

					$realTime.append($leftRealTime, $rightRealTime);
					//按钮
					var timeBottom = $('<div class="bottom"></div>'),
						timeCancell = $('<a href="javascript:void(0);">取消</a>'),
						timeSure = $('<a href="javascript:void(0);">确定</a>');
					timeBottom.append(timeSure, timeCancell);

					this.$timePanel.append($timeTitle, $timeSelectDay, $realTime, timeBottom);

					timeSure.on('click', function() {
						self.timeSureFun();
						finalOptions.year = parseInt(self.$timeSeftSelect.text());
						finalOptions.month = self.singleToDouble(parseInt(self.$timeMiddleSelect.text())); //-1
						finalOptions.day = self.singleToDouble(parseInt(self.$timeRightSelect.text()));
						finalOptions.date = new Date(finalOptions.year, finalOptions.month - 1, finalOptions.day, finalOptions.hour, finalOptions.minute, 00);
						finalOptions.callback(finalOptions);
					});
					timeCancell.on('click', function() {
						self.timeSureFun()
					});
					this.$target.append(this.$mainPanel);
				},
				Layerout1: function() {
					this.$panel = $('<div class="u-panel"></div>'); // 建立日历
					var $title = $('<div class="u-title">' + finalOptions.calTitle + '</div>'), // title
						$selectDay = $('<div class="u-selectday"></div>'); //当前时间提示
					this.$leftSelect = $('<div></div>');
					this.$rightSelect = $('<div></div>');
					$selectDay.append(this.$leftSelect, this.$rightSelect);
					this.$panel.append($title, $selectDay);
					// 周一到周日
					var th = ['<table cellpadding="0" cellspacing="0">',
						'<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>',
						'</table>'
					];
					this.$panel.append($(th.join('')));
					// 日历，只显示31天内
					var date = finalOptions.date,
						// currentMonth = defaultOptions.czNum[parseInt(date.getMonth())],
						currentMonth = this.singleToDouble(parseInt(date.getMonth()) + 1),
						$tableContainer = $('<div></div>'),
						table = '<div class="u-cal-table">',
						count = date.getDay() + 1,
						day = parseInt(date.getTime()) - 24 * 60 * 60 * 1000;
					for (var i = 1; i <= 35; i++) {
						if (i === 1 || i % 7 === 1) {
							table += '<div class="row">';
						}
						if (count == i) {
							count++;
							day += 24 * 60 * 60 * 1000;
							var calDate = new Date(day),
								calYear = calDate.getFullYear(),
								calMonth = parseInt(calDate.getMonth()) + 1;
							if (day == date.getTime()) {
								table += '<div data-month="' + calMonth + '" class="cell active" data-year="' + calYear + '">' + calDate.getDate() + '</div>';
								this.$leftSelect.text(date.getFullYear());
								this.$rightSelect.text(currentMonth);
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
					this.$panel.append($tableContainer);
					var bottom = $('<div class="bottom"></div>'),
						sure = $('<a href="javascript:void(0);">确定</a>'),
						cancell = $('<a href="javascript:void(0);">取消</a>');
					bottom.append(sure, cancell);
					this.$panel.append(bottom);
					this.$mainPanel.append(this.$panel);
					this.$target.append(this.$mainPanel);

					var self = this;
					$tableContainer.on('click', function(e) {
						var tar = $(e.target);
						if (!tar.attr('data-month')) return;
						self.$leftSelect.text(tar.attr('data-year'));
						self.$rightSelect.text(self.singleToDouble(parseInt(tar.attr('data-month'))));
						tar.parents('div.u-cal-table').find('.cell').removeClass('active')
						if (tar.hasClass('cell')) {
							tar.addClass('active');
						}
					});
					//
					cancell.on('click', self.timeSureFun);
					sure.on('click', function() {
						if (finalOptions.type == 'all' && finalOptions.type != null || finalOptions.type == '') {
							self.selectTimeFun();
						} else if (finalOptions.type == 'notime') {
							finalOptions.year = parseInt(self.$leftSelect.text());
							finalOptions.month = self.singleToDouble(parseInt(self.$rightSelect.text())); //-1
							finalOptions.day = self.singleToDouble(parseInt($('.u-cal-table .active').text()));
							finalOptions.date = new Date(finalOptions.year, finalOptions.month - 1, finalOptions.day);
							finalOptions.callback(finalOptions);
							self.timeSureFun();
						}
					});
				},
				singleToDouble: function(num) {
					if (isNaN(num)) {
						return -1;
					}
					if (0 <= num && num <= 9) {
						return '0' + num;
					}
					return num;
				},
				timeSureFun: function() { //关闭窗口
					$target.empty();
					layer.hide();
				},
				loaded: function() { //显示小时分钟
					var self = this;
					// 初始化默认时间， 获得每个滚动距离，然后获得时间小时或者分钟，相乘以可得滚动的总距离
					var intHeight = parseInt(finalOptions.intervalHeight.height()),
						ct = finalOptions.date || new Date(),
						ch = parseInt(ct.getHours()),
						cm = parseInt(ct.getMinutes());
					finalOptions.hour = this.singleToDouble(ch);
					finalOptions.minute = this.singleToDouble(cm);

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
						finalOptions.hour = self.singleToDouble(-(Math.floor(stopHeight / intHeight)));
					});

					myScroll2 = new IScroll('.middlemain2', {
						mouseWheel: true,
						startY: -(cm * intHeight)
					});
					myScroll2.on('scrollEnd', function(e) {
						var stopHeight = parseInt(this.y),
							finalHeight = (Math.floor(stopHeight / intHeight)) * intHeight;
						myScroll2.scrollTo(0, finalHeight);
						finalOptions.minute = self.singleToDouble(-(Math.floor(stopHeight / intHeight)));
					});
				}
			}
			window.calendar = new calendar();
		});
	};
}));