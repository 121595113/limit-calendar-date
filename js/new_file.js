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