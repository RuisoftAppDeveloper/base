$(function(){	
	var ww = $(window).width()
	var wh = $(window).height();
	$("#container").width(ww).height(wh);
		
	$(".ui-page").css("padding-bottom",0);
    $(".ios-top-line").width(ww);
	$("#header").width(ww);
	$(".footer").width(ww);
	$("#calendar").width(ww);
	$("#mask").width(ww).height(wh);
	$("#mask-network").width(ww).height(wh);
	$("#slide_layer").width(ww * 0.8).height(wh);
	$("#slide_layer .slide_header").height(ww * 0.8 * 0.5667);
	
	//切换导航状态
	$(".nav1").click(function(){
		var imgId = $(this).find("img").attr("id");
		var imgActivePath = "../assets/img/"+imgId+"_active.png";
		$(".footer img").each(function(){
			var imgId = $(this).attr("id");
			var imgPath = "../assets/img/"+imgId+".png";
			$(this).attr("src",imgPath);
		});
		$(".footer div").css("color","#858585");
		$(this).find("img").attr("src",imgActivePath);
		$(this).find("div").css("color","#4CA5FF");
	});
	
	//从网络设置返回
	$("#page-back").click(function(){
		hideNetworkSetting()
	});
		
	//显示日历
	$("#page-menu").click(function(){
		/*********
		$("#calendar").show().removeClass("slideOutUp").addClass("slideInDown").datepicker({
			inline: true,
			firstDay: 1,
			showOtherMonths: true,
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
		});
		$("#mask").fadeIn(500);
		$('html,body').addClass('ovfHiden');
		**************/
	});
	
	//左上角返回
	$(".page-back").click(function(){
		window.location.href = '../main.html';
	});

	//左侧边栏弹出
	$("#page-menu").click(function(){
		$("#slide_layer").show().css("visibility","visible").removeClass("slideOutLeft").addClass("slideInLeftAll");
		$("#mask").fadeIn(500);
		$('html,body').addClass('ovfHiden');//禁用页面滚动
	});
	//左侧边栏收回
	$(".slide_back").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		window.setTimeout(function(){
			$("#slide_layer").hide();
		},500);
		$("#mask").fadeOut(500);
		$('html,body').removeClass('ovfHiden');//恢复页面滚动
	});
	
	//转到ESB
	$("#link-to-esb").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		storage.setItem("loginStatus","false")
		window.setTimeout(function(){
			window.location.href="service.html"
		},500);
	});
	
	//转到BI
	$("#link-to-bi").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		storage.setItem("loginStatus","false")
		window.setTimeout(function(){
			window.location.href="bi.html"
		},500);
	});
	
	//转到ESB
	$("#link-to-eig").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		storage.setItem("loginStatus","false")
		window.setTimeout(function(){
			window.location.href="eig.html"
		},500);
	});

	//显示网络链接
	$("#link-to-network-setting").click(function(){
		$("#network-setting").show().css("visibility","visible").removeClass("slideOutRight").addClass("slideInRight");
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		$('html,body').addClass('ovfHiden');//禁用页面滚动
	});
	
	//退出登录
	$("#logout").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		storage.setItem("loginStatus","false")
		window.setTimeout(function(){
			window.location.href="../login.html"
		},500);
	});
	
	//点击遮罩隐藏日历及左侧菜单
	$("#mask").click(function(){
		$("#slide_layer").removeClass("slideInLeftAll").addClass("slideOutLeft");
		$("#calendar").removeClass("slideInDown").addClass("slideOutUp");
		$(this).fadeOut(500);
		$('html,body').removeClass('ovfHiden');//恢复页面滚动
	});
	
	//网络设置
	$("#network-setting").width(ww).height(wh);
	$("#checkUrlResult").width(ww * 0.7).height(ww * 0.7).css({"left":ww * 0.15,"top":(wh - ww * 0.7)/2});
	$("#test-button").click(function(){
		testServiceUrl($("#serviceUrl").val());
	});
	var center = $("#checkUrlResult").width() * 0.5
	$(".spin").css({"left": center,"top":"6em"});
	
	$("#cancel-button input").click(function(){
		spinner.spin();
		$("#mask").hide();
		$("#checkUrlResult").hide();
	});
	
	if(storage.getItem("url")) {
		var url = storage.getItem("url");
		$("#serviceUrl").val(url);
	}
	
});

function doRefresh(){
	$("#page-refresh").css("color","#999");
	switchMenu(currentUrl);
	$("body").scrollTop(0);
}

function switchApp(url){
	window.location.href=url;
}

function switchMenu(url){
	currentUrl = url;
	$("#contentFrame").removeClass("fadeIn");
	$.get(url,function(data){ //初始將a.html include div#iframe
		$("#contentFrame").html(data).show().addClass("fadeIn");
		//$("#page-refresh").css("color","#FFF");
	}); 
}

//opts
var opts = {            
	lines: 10, // 花瓣数目
	length: 10, // 花瓣长度
	width: 6, // 花瓣宽度
	radius: 10, // 花瓣距中心半径
	corners: 1, // 花瓣圆滑度 (0-1)
	rotate: 0, // 花瓣旋转角度
	direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
	color: '#666666', // 花瓣颜色
	speed: 1, // 花瓣旋转速度
	trail: 60, // 花瓣旋转时的拖影(百分比)
	shadow: false, // 花瓣是否显示阴影
	hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
	className: 'spinner', // spinner css 样式名称
	zIndex: 2e9, // spinner的z轴 (默认是2000000000)
	top: 0, // spinner 相对父容器Top定位 单位 px
	left: 0// spinner 相对父容器Left定位 单位 px
};
var spinner = new Spinner(opts);

function testServiceUrl(url){
	$("#mask-network").show();
	$("#checkUrlResult").show();
	var target = $(".spin").get(0);
	spinner.spin(target);
	
	/******************
	//判断连通性
	$.ajax({
		url: url,
		dataType: "json",
		//data: data,
		timeout: 10000,
		success: function(data){
			$.each(data,function(i,field){
				var conn = field.conn;
				if(conn) {
					spinner.spin();
					check = true;
					var html = "<i id='status-icon' class='fa fa-check-square-o fa-5x success'></i>";
					html += "<div id='check-status' class='success'>连接成功</div>";
					html += "<div id='action-button' class='submit'><input type='button' onclick='hideNetworkSetting()' value='保存'></div>";
					$("#checkUrlResult").html(html);
				} else {
					spinner.spin();
					var html = "<i id='status-icon' class='fa fa-close fa-5x fail'></i>";
					html += "<div id='check-status' class='fail'>连接失败</div>";
					html += "<div id='action-button' class='submit'><input type='button' onclick='hidePop()' value='关闭并重试'></div>";
					$("#checkUrlResult").html(html);
				}
			});
		},
		error: function(){
			spinner.spin();
			var html = "<i id='status-icon' class='fa fa-close fa-5x fail'></i>";
			html += "<div id='check-status' class='fail'>连接失败</div>";
			html += "<div id='action-button' class='submit'><input type='button' onclick='hidePop()' value='关闭并重试'></div>";
			$("#checkUrlResult").html(html);
		}
	});	
	****************/
	window.setTimeout(function(){
		spinner.spin();
		check = true;
		var html = "<i id='status-icon' class='fa fa-check-square-o fa-5x success'></i>";
		html += "<div id='check-status' class='success'>连接成功</div>";
		html += "<div id='action-button' class='submit'><input type='button' onclick='hideNetworkSetting()' value='保存'></div>";
		$("#checkUrlResult").html(html);
	},1000);
}

function hidePop() {
	$("#mask").hide();
	$("#checkUrlResult").hide();
}

function hideNetworkSetting() {
	$("#network-setting").removeClass("slideInRight").addClass("slideOutRight");
	$("#slide_layer").removeClass("slideOutLeft").addClass("slideInLeftAll");
	$("#checkUrlResult").fadeOut();
	$("#mask-network").fadeOut();
	window.setTimeout(function(){
		$("#network-setting").hide();
	},500);
}
