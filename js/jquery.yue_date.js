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
					if (!this.shadow) this.createShadow();
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
				// 判断生成的结构
				if (finalOptions.type == 'notime') {
					this.Layerout1();
				} else if (finalOptions.type == 'onlytime') {
					this.Layerout2();
				} else {
					this.Layerout1();
					this.Layerout2();
				}

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
					// 初始化滚动
					self.loaded();
					document.addEventListener('touchmove', function(e) {
						e.preventDefault();
					}, false);
				}
			}
			calendar.prototype = {
				createnum: function(box, parm) { //创建数字
					for (var j = parm[0]; j <= parm[1]; j++) {
						if (j == parm[0]) {
							finalOptions.intervalHeight = $('<div></div>');
							box.append(finalOptions.intervalHeight);
						}
						box.append('<div>' + this.singleToDouble(j) + '</div>')
						if (j == parm[1]) box.append('<div></div>');
					}
				},
				Layerout2: function() {
					var self = this;
					// 建立小时分钟时间
					this.$timePanel = $('<div class="u-timepanel u-panel"></div>');
					this.$mainPanel.append(this.$timePanel);

					// 判断初始化是否显示
					if (finalOptions.type == 'onlytime') {
						this.$timePanel.css('-webkit-transform', 'translate3d(0px, 0px, 0px)');
					} else {
						this.$timePanel.css({
							'-webkit-transform': defaultOptions.translate3d,
							'-webkit-transition': '-webkit-transform 200ms'
						});
						this.$timePanel.hide();
					}

					var $timeTitle = $('<div class="u-title">' + finalOptions.timeTitle + '</div>'); //标题
					this.$timePanel.append($timeTitle);

					// 初始化是否显示当前日期
					if (finalOptions.type != 'onlytime') {
						var $timeSelectDay = $('<div class="u-timeselectday"></div>'); //当前时间提示
						this.$timeSeftSelect = $('<div></div>');
						this.$timeMiddleSelect = $('<div></div>');
						this.$timeRightSelect = $('<div>30</div>');
						$timeSelectDay.append(this.$timeSeftSelect, this.$timeMiddleSelect, this.$timeRightSelect);
						this.$timePanel.append($timeSelectDay);
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

					//小时
					this.createnum($iscroll1, [0, 23]);

					$middleMain1.append($iscroll1);
					$leftRealTime.append($topIcon, $middleMain1, $bottomIcon);

					var $middleMain2 = $('<div class="middlemain middlemain2"></div>'),
						$iscroll2 = $('<div class="iscroll"></div>'),
						$middleScroll2 = $('<div></div>');
					$rightRealTime.append($middleScroll2);

					//分钟
					this.createnum($iscroll2, [0, 59]);

					$middleMain2.append($iscroll2);
					$rightRealTime.append($topIcon.clone(), $middleMain2, $bottomIcon.clone());

					$realTime.append($leftRealTime, $rightRealTime);
					//按钮
					var timeBottom = $('<div class="bottom"></div>'),
						timeCancell = $('<a href="javascript:void(0);">取消</a>'),
						timeSure = $('<a href="javascript:void(0);">确定</a>');
					timeBottom.append(timeSure, timeCancell);

					this.$timePanel.append($realTime);
					this.$timePanel.append(timeBottom);

					//添加到页面
					this.$target.append(this.$mainPanel);
					if (finalOptions.type == 'onlytime') this.loaded(); // 初始化滚动
					//确定取消事件
					timeSure.on('click', function() {
						if (finalOptions.type != 'onlytime') {
							finalOptions.year = parseInt(self.$timeSeftSelect.text());
							finalOptions.month = self.singleToDouble(parseInt(self.$timeMiddleSelect.text())); //-1
							finalOptions.day = self.singleToDouble(parseInt(self.$timeRightSelect.text()));
							finalOptions.date = new Date(finalOptions.year, finalOptions.month - 1, finalOptions.day, finalOptions.hour, finalOptions.minute, 00);
						}
						finalOptions.callback(finalOptions);
						self.timeSureFun();
					});
					timeCancell.on('click', function() {
						self.timeSureFun()
					});
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
					// 日历，只显示35天内
					var date = finalOptions.date,
						// currentMonth = defaultOptions.czNum[parseInt(date.getMonth())],
						currentMonth = this.singleToDouble(parseInt(date.getMonth()) + 1),
						$tableContainer = $('<div class="tableContainer"></div>'),
						table = '<div class="u-cal-table">',
						count = date.getDay() + 1,
						day = parseInt(date.getTime()) - 24 * 60 * 60 * 1000;
					for (var i = 1; i <= 35; i++) {
						if (i === 1 || i % 7 === 1) table += '<div class="row">';
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
						if (i % 7 === 0) table += '</div>';
						if (i === 35) table += '</div>';
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
					//切换日期事件
					var self = this;
					$tableContainer.on('click', function(e) {
						var tar = $(e.target);
						if (!tar.attr('data-month')) return;
						self.$leftSelect.text(tar.attr('data-year'));
						self.$rightSelect.text(self.singleToDouble(parseInt(tar.attr('data-month'))));
						tar.parents('div.u-cal-table').find('.cell').removeClass('active')
						if (tar.hasClass('cell')) tar.addClass('active');
					});
					//确定和取消事件
					cancell.on('click', self.timeSureFun);
					sure.on('click', function() {
						if (finalOptions.type == 'notime') {
							finalOptions.year = parseInt(self.$leftSelect.text());
							finalOptions.month = self.singleToDouble(parseInt(self.$rightSelect.text())); //-1
							finalOptions.day = self.singleToDouble(parseInt($('.u-cal-table .active').text()));
							finalOptions.date = new Date(finalOptions.year, finalOptions.month - 1, finalOptions.day);
							finalOptions.callback(finalOptions);
							self.timeSureFun();
						} else {
							self.selectTimeFun();
						}
					});
				},
				singleToDouble: function(num) { //单数变双数
					if (isNaN(num)) return -1;
					if (0 <= num && num <= 9) return '0' + num;
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
	//遍历元素
	$(function() {
		$("input[data-yue-date]").each(function(index) {
			if (index == 0) {
				var doc = window.document;
				this.mioId = doc.createElement('div');
				this.mioId.setAttribute('id', 'mioId');
				doc.body.appendChild(this.mioId);
			}
			$(this).attr('readonly', '')
			$(this).on('click', function() {
				var that = $(this),
					type = $(this).attr('data-yue-date');
				if (type == 'notime') {
					var calTitle = $(this).attr('data-calTitle');
					$('#mioId').yue_date({
						type: type,
						calTitle: calTitle,
						callback: function(result) {
							_date = result.date;
							that.val(result.year + '-' + result.month + '-' + result.day);
						}
					});
				} else if (type == 'onlytime') {
					var timeTitle = $(this).attr('data-timeTitle');
					$('#mioId').yue_date({
						type: type,
						timeTitle: timeTitle,
						callback: function(result) {
							_date = result.date;
							that.val(result.hour + ':' + result.minute);
						}
					});
				} else {
					var calTitle = $(this).attr('data-calTitle'),
						timeTitle = $(this).attr('data-timeTitle');
					$('#mioId').yue_date({
						type: type,
						calTitle: calTitle,
						timeTitle: timeTitle,
						callback: function(result) {
							_date = result.date;
							that.val(result.year + '-' + result.month + '-' + result.day + ' ' + result.hour + ':' + result.minute);
						}
					});
				}
			})
		})
	});
}));