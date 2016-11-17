$(document).ready(function(){
	//导航选中
	var pathName = location.pathname;
	if(pathName.indexOf("template") > 0 || pathName.indexOf("ppt") > 0) {
		currentSelect(1);
	}else if(pathName.indexOf("editresume") > 0) {
		currentSelect(2);
	}else if(pathName.indexOf("article") > 0 || pathName.indexOf("zhuanti") > 0) {
		currentSelect(3);
	}else if(pathName.indexOf("hr") > 0 || pathName.indexOf("customize") > 0 ) {
		currentSelect(4);
	}else {
		currentSelect(0);
	}
	
	
	/** 购物车 */
	$('.cart').mousemove(function(){
		$(this).find('.cartText').fadeIn(0);
		$(this).find('.cartCont').fadeIn(0);
		$(this).find('.cartNum').addClass("huanBg");
	});
	$('.cart').mouseleave(function(){
		$(this).find('.cartText').fadeOut(0);
		$(this).find('.cartCont').fadeOut(0);
		$(this).find('.cartNum').removeClass("huanBg");
	});
	/**登录菜单*/
	/*$(".div_help_user,.m-touxiang").mouseover(function(){
		if(getCookie("memberName") || getCookie("memberEmail")) {
			$(".m-top_user").show();
			$(".ul_top_user").show();
		}
	});
	$(".div_help_user,.m-touxiang").mouseleave(function(){
		$(".ul_top_user").hide();
		$(".m-top_user").hide();
	});*/
	
	//鼠标覆盖和离开头像事件
	$('.jl-touxiang').hover(function(){
		$('.jl-user-info').stop().show();					
	},function(){
		$('.jl-user-info').stop().hide();					
	});	
	
	$("#close_window").click(function(){
		$("#window_dialog").hide();
	});
	/**导航二级菜单*/
	$(".erji").hover(function(e) {
        $(this).children(".m-erjinav").stop().fadeIn(500);
    }, function(){  
        setTimeout(function(){
       	 $(this).children(".m-erjinav").stop().hide();
        },800);
	});	
	$(".m-erjinav").hover(function(e) {
	      $(this).show();
	    }, function(){
			$(this).stop().fadeOut(500);	
		});
	$(".erji").siblings().hover(function(e) {
		$(".m-erjinav").stop().fadeOut(500);
	    }, function(){
	});
	hide_login_modal();//登录框隐藏绑定
	//获取有没有最新消息
	//判断有没有登录
	if(getCookie("memberEmail")){
		$.get(wbdcnf.base+"/common/get_message_notification_count/",function(data){
			var $message_notification=$("a.message_notification");
			if(data>0){
				$message_notification.removeClass("no");
				$message_notification.addClass("yes");
			}else{
				$message_notification.removeClass("yes");
				$message_notification.addClass("no");
			}
		});
	}else{
		$("a.message_notification").hide();
	}
});

//选中样式
function currentSelect(index) {
	$(".nav-li").removeClass("current").eq(index).addClass("current");
}

/**
 * 购物车数量
 */
function cartSize() {
	var size = getCookie("cartSize");
	if(!size)
		size = getCartSize();
	if(size && size > 0)
		$("#cart").addClass("cur");
	else
		$("#cart").removeClass("cur");
}
function getCartSize() {
	var size = 0;
	$.ajax({async : false, url : wbdcnf.base + "/cart/size/", cache : false, type : "GET", success : function(data) {
		size = data;
	}});
	return size;
}
/*弹出层*/
//显示灰色 jQuery 遮罩层
function showBg() {
	var bh = $("body").height();
	var bw = $("body").width();
	$("#fullbg").css({
		"height":bh,
		"width":bw,
		"display":"block"
	});
	$("#dialog").show();
}

//关闭灰色 jQuery 遮罩
function closeBg() {
	$("#fullbg,#dialog").hide();
}

/** 首页定制切换 **/
function ShowPre(o){
	var that = this;
	this.box = $("#"+o["box"]);
	this.btnP = $("#"+o.Pre);
	this.btnN= $("#"+o.Next);
	this.v = o.v||1;
	this.c = 0;
	var li_node = "li";
	this.loop = o.loop||false;
	//循环生成dom
	if(this.loop){
		this.li =  this.box.find(li_node);
		this.box.append(this.li.eq(0).clone(true));
	};
	this.li = this.box.find(li_node);
	this.l = this.li.length;
	//滑动条件不成立
	if(this.l<=this.v){
		this.btnP.hide();
		this.btnN.hide();
	};
	this.deInit = true;
	this.w = this.li.outerWidth(true);
	this.box.width(this.w*this.l);
	this.maxL = this.l - this.v;
	//要多图滚动 重新计算变量
	this.s = o.s||1;
	if(this.s>1){
		this.w = this.v*this.w;
		this.maxL = Math.floor(this.l/this.v);
		this.box.width(this.w*(this.maxL+1));
		//计算需要添加数量
		var addNum = (this.maxL+1)*this.v-this.l;
		var addHtml = "";
		for(var adN = 0;adN < addNum;adN++){
			addHtml += "<li class='addBox'><div class='photo'></div><div class='text'></div></li>";
		};
		this.box.append(addHtml);
	};
	//生成状态图标
	this.numIco = null;
	if(o.numIco){
		this.numIco  = $("#"+o.numIco);
		var numHtml = "";
		numL = this.loop?(this.l-1):this.l;
		for(var i = 0;i<numL;i++){
			numHtml+="<a href='javascript:void(0);'>"+i+"</a>";
		};
		//this.numIco.html(numHtml);
		this.numIcoLi = this.numIco.find("a");
		this.numIcoLi.bind("click",function(){
			if(that.c==$(this).html())return false;
			that.c=$(this).html();
			that.c=$(this).attr("data");
			that.move();
		});
	};
	this.bigBox = null;
	this.loadNumBox = null;
	if(o.loadNumBox){
		this.loadNumBox = $("#"+o.loadNumBox);
	};
	//当前序号设置
	this.allNumBox = null;
	if(o.loadNumBox){
		this.allNumBox = $("#"+o.allNumBox);
		if(o.bBox){
			var cAll = this.l<10?("0"+this.l):this.l;
		}else{
			var cAll = this.maxL<10?("0"+(this.maxL+1)):(this.maxL+1);
		};
		this.allNumBox.html(cAll);
	};
	//大图按钮点击操作
	if(o.bBox){
		this.bigBox = $("#"+o.bBox);
		this.li.each(function(n){
			$(this).attr("num",n);
			var cn = (n+1<10) ? ("0"+(n+1)):n+1;
			$(this).find(".text").html(cn);
		});
		this.loadNum = 0;
		this.li.bind("click",function(){
			if(that.loadNum==$(this).attr("num"))return false;
			var test = null;
			if(that.loadNum>$(this).attr("num")){
				test = "pre";
			};
			that.loadNum = $(this).attr("num");

			that.loadImg(test);
		});
		that.loadImg();
		if(o.bNext){
			that.bNext = $("#"+o.bNext);
			that.bNext.bind("click",function(){
				that.loadNum<that.l-1 ?that.loadNum++:that.loadNum=0;
				that.loadImg();
			});
		};
		if(o.bPre){
			that.bPre = $("#"+o.bPre);
			that.bPre.bind("click",function(){
				that.loadNum> 0? that.loadNum--:that.loadNum=that.l-1 ;
				that.loadImg("pre");
			});
		};
	};
	//滑动点击操作(循环or不循环)
	if(this.loop){
		this.btnP.bind("click",function(){
			if(that.c<=0){
				that.c = that.l-1;
				that.box.css({left:-that.c*that.w});		
			};
			that.c --;
			that.move(1);
		});
		this.btnN.bind("click",function(){
			if(that.c>=(that.l-1)){
				that.box.css({left:0});		
				that.c = 0;
			};
			that.c++;
			that.move(1);
		});
	}else{
		this.btnP.bind("click",function(){
			that.c> 0? that.c--:that.c=that.maxL ;
			that.move(1);
		});
		this.btnN.bind("click",function(){
			that.c<that.maxL ?that.c++:that.c=0;
			that.move(1);
		});
	};
	that.timer = null;
	if(o.auto){
		that.box.bind("mouseover",function(){
			clearInterval(that.timer);
		});
		that.box.bind("mouseleave",function(){
			that.autoPlay();
		});
		that.autoPlay();
	};
	this.move();
}
ShowPre.prototype = {
	move:function(test){ //滑动方法
		var that = this;
		var pos = this.c*this.w;
		//document.title = (test&&that.timer);
		if(test&&that.timer){
			clearInterval(that.timer);
		};
		//当前序号图标
		if(that.numIco){ 
			that.numIcoLi.removeClass("on");
			var numC = that.c;
			if(that.loop&&(that.c==(this.l-1))){
				numC= 0;	
			};
			that.numIcoLi.eq(numC).addClass("on");
		};
		this.box.stop();
		this.box.animate({left:-pos},function(){
			if(test&&that.auto){
				that.autoPlay();
			};
			if(that.loop&&that.c==that.maxL){
				that.c = 0;
				that.box.css({left:0})
			};
		});
		if(that.bigBox)return false;
		//设置大图加载序号
		if(that.loadNumBox){
			var loadC = parseInt(that.c)+1;
				loadC = loadC<10?"0"+loadC:loadC;
				that.loadNumBox.html(loadC);
		};
	},
	loadImg:function(test){ //加载大图方法
		var that = this;
		var _src = this.li.eq(that.loadNum).attr("bsrc"),bigTh3=null,bigTh4=null,bigText=null;
		if(that.li.eq(that.loadNum).attr("data-h")){
			//$("#bigT h3").html(that.li.eq(that.loadNum).attr("data-h"));
			var bigTh3 = $("#bigT h3");
			$("#bigT").hide();
			bigTh3.html("");
		};
		if(that.li.eq(that.loadNum).attr("data-m")){
			//$("#bigT h4").html(that.li.eq(that.loadNum).attr("data-m"));
			var bigTh4 = $("#bigT h4");
			$("#bigT").hide();
				bigTh4.html("");
		};
		if(that.li.eq(that.loadNum).attr("data-text")){
			//$("#bigText").html(that.li.eq(that.loadNum).attr("data-text"));
			var bigText = $("#bigText");
				bigText.html("").hide();
		};
		var img = new Image();
			$(img).hide();
			//loading dom操作(分首次加载和后面加载，根据点击操作设置运动方向)
			if(that.deInit){
				var le = 0;
				that.deInit = false;
				that.bigBox.html("<div class='loading'></div><div class='loading'></div>");
			}else{
				if(test!="pre"){
					var le = -1230;
					that.bigBox.append("<div class='loading'></div>");
				}else{
					var le = 1230;
					that.bigBox.find(".loading").before("<div class='loading'></div>");
					that.bigBox.css({"margin-left":-1230});
					le = 0;
				};				
			};
			that.bigBox.animate({"margin-left":le},function(){
				$(img).bind("load",function(){
					//判断出现方向
					if(test!="pre"){
						var n = 1,oldN = 0;
					}else{
						var n = 0,oldN = 1;
					};
					that.bigBox.find(".loading").eq(n).html(img);
					that.bigBox.find(".loading").eq(oldN).remove();
					that.bigBox.css({"margin-left":0});
					$(this).fadeIn(200,function(){
						if(bigTh3){
							$("#bigT").fadeIn()
							bigTh3.html(that.li.eq(that.loadNum).attr("data-h"));
						};
						if(bigTh4){
							$("#bigT").fadeIn()
							bigTh4.html(that.li.eq(that.loadNum).attr("data-m"));
						};
						if(bigText){
							bigText.html(that.li.eq(that.loadNum).attr("data-text")).fadeIn();
						};
					});
				});
				img.src = _src;
			});
			//添加当前加载序号
			that.li.removeClass("on");
			that.li.eq(that.loadNum).addClass("on");
			if(that.loadNumBox){
				var loadC = parseInt(that.loadNum)+1;
					loadC = loadC<10?"0"+loadC:loadC;
					that.loadNumBox.html(loadC);
			};
	},
	autoPlay:function(){ //自动播放方法
		var that =this;
		that.timer = setInterval(function(){
			that.c<that.maxL?that.c++:that.c=0;
			that.move();
		},4000);
	}
}

/** 回到顶部 **/
function gotop(){
    var gotop = '<div class="gotop"></div>';
    $("body").append(gotop);
    $(".gotop").click(function(){$('html, body').animate({scrollTop:0}, 700);});
    var min_height = 200;
    $(window).scroll(function(){
        var s = $(window).scrollTop();
        if(s > min_height){
            $(".gotop").fadeIn(100);
        }else{
            $(".gotop").fadeOut(100);
        };
    });
};

/** 加载地区 */
function area(){
	var pid, cid, aid;
	$("#province").change(function(){
		pid = $(this).val();
		next(pid, "#city");
	});
	$("#city").change(function(){
		cid = $(this).val();
		next(cid, "#area");
	});
}
function next(id, htmlid){
	if(id == null || isNaN(id) || id == "") {
		$("#city").empty().append('<option value="">地级市</option>');
		$("#area").empty().append('<option value="">市、县级市、县</option>');
		return;
	}
	$.get(wbdcnf.base + "/area/next/",
		{"id" : id},
		function(data){
			$(htmlid).empty();
			if(htmlid == "#city") {
				$("#city").empty().append('<option value="">地级市</option>');
			}else{
				$("#area").empty().append('<option value="">市、县级市、县</option>');
			}
			if(data == null || data.length == 0)
				$(htmlid).hide();
			else
				$(htmlid).show();
			$(data).each(function(index){
				$(htmlid).append('<option value="' + data[index].id + '">' + data[index].name + '</option>');
				if(index == 1 && htmlid == "#city")
					next(data[index].id, "#area");
			});
	});
}

/**
 * 登录信息
 */
function loginMsg(userName, userHead) {
	if(!userName) {
		userHead = getCookie("memberHead");
		userName = getCookie("memberName");
		userEmail = getCookie("memberEmail");
		userIsVerifyEmail = getCookie("memberIsVerifyEmail");
		isVIP = getCookie("memberIsVIP");
	}
	if (userName != null || userEmail != null) {
		if(userName == null || userName == "")
			userName = "我的五百丁";
		$("#login").hide(); // 登录按钮
		$("#register").hide(); // 注册按钮
		$("#login-register").hide(); // 登录和注册间隔符
		$("#userName").text(userName).show(); // 显示名称
		$("#myResume").show();	//显示“我的简历”
		$("#userHead").show().find("img").attr("src", userHead); // 显示头像
		//判断是否是会员
		if(isVIP=="true") {
			$("#userName").next().addClass("vip");	//高亮vip图标
			$("#isVIP").show();
			$("#isNotVIP").hide();
		}else {
			$("#userName").next().removeClass("vip");	//高亮vip图标
			$("#isVIP").hide();
			$("#isNotVIP").show();
		}
		$("#window_dialog").remove(); // 移除登录窗口
		if(next_url) // 跳转到下一个页面
			location.href = next_url;
		if(add_login_success)
			loginSuccess();
		$("#user_logout").show().click(function(){ // 登出按钮事件
			loginOut();
		});
		//是否验证
		if(userIsVerifyEmail=="false"){
			$(".validate_email_Tips").show();
		}else{
			$(".validate_email_Tips").hide();
		}
	} else {
		$("#login").show(); // 登录按钮显示
		$("#userHead").hide();	//隐藏头像
	}
}
/**
 *检测用户状态0:未绑定邮箱，1：绑定未验证，2:已绑定，已验证,3:未登录
 */
function check_Loing_Status_show_modal(){
	 //检测用户状态0:未绑定邮箱，1：绑定未验证，2:已绑定，已验证,3:未登录
	var result=2;
	$.ajax({
		url: wbdcnf.base +"/login/check_member_status/",
		type: "GET",
		dataType: "json",
		cache: false,
		async: false,
		success: function(data) {
		   if(data.result=="0"){//未绑定邮箱
			  show_login_modal();
			  switch_windows($(".validate-box—bind-email"));
			  result= 0;
		   }else if(data.result=="1"){//已绑定，未验证
			   var send_url=wbdcnf.base +"/login/login_bind_email_send/";
			   show_login_modal();
			   switch_windows($(".email_reg_validate_box"));
			   sendEmail(data.email,send_url,"POST");
			   $("#validate_email").text(data.email);
			   result =1;
		   }else if(data.result=="2"){//已绑定，已验证
			   hide_login_modal();
			   result= 2;
		   }else if(data.result=="3"){//未登录
			   show_login_modal();//展示登录框
			   result= 3;
		   }
		}
	});
	return result;
}
/**
 * 登录成功调用该函数
 */
function loginSuccess() {
}
/**
 * 登录-注册-验证状态框切换
 */
function switch_windows(show_object){
	$(".login_register_step").css({
		"display":"none"
	}).addClass("hide-swal2");
	$(show_object).css({
		"display":"block"
	 }).addClass("show-swal2");
	 //移除所有button的disable状态，防止点击不了
	 $("#login_register_windows").find("button").prop("disabled", false);
}
/***
 * 展示登录框
 */
function show_login_modal(){
	switch_windows($(".login-box"));
	$("#login_modal").show();
	$("#login_register_windows").show();
	$("html").addClass("open");
}
/***
 * 隐藏登录框
 */
function hide_login_modal(){
	$(".jl-temp-zxModalBg").click(function(){
		loginMsg();
		$("#login_register_windows").stop().hide();
		$("html").removeClass("open");
	});
}
//发送邮件
function sendEmail(email,send_url,send_method){
	var flag=false;
	//发送邮件
	$.ajax({
		url: send_url,
		type: send_method,
		data: {"email":email},
		dataType: "json",
		async:false,
		cache: false,
		success: function(message) {
			if(message.type=="success"){
				flag=true;
			}else{
				layer.msg(message.content);
			}
		}
	});
	return flag;
}	
/**
 * 注销登录
 */
var logoutrefresh = true; // 是否刷新页面
function loginOut() {
	$.get(wbdcnf.base + "/logout/", function(data){
		if(data.type == "success") {
			$("#userHead").hide(); // 头像隐藏
			$("#userName").hide(); // 用户名隐藏
			$("#myResume").hide();	//隐藏“我的简历”
			$(".ul_top_user").hide(); // 用户操作菜单隐藏
			$(".m-top_user").hide(); // 用户操作菜单隐藏
			
			$("#login").show(); // 显示登录按钮
			$("#register").show(); // 显示注册按钮
			$("#login-register").show(); // 显示注册和登录间隔符
			cartSize(); // 计算购物车
			var synarr = $(data.content); // 同步登出论坛
			synarr.each(function(index, ele) {
			    $.getScript(ele.src, function(){});
			});
			// removeCookie("memberName", {expires : 0});
			// removeCookie("memberEmail", {expires : 0});
			if(logoutrefresh)
				location.reload();
		} else {
			var loaded = 0;
			var synarr = $(data.content);
			if(data.content != "" && synarr.length > 0) {
				synarr.each(function(index, ele) {
					$.getScript(ele.src, function(){
						if (++loaded == synarr.length) {
							location.href = wbdcnf.base + "/";
						}
					}).fail(function() {
						location.href = wbdcnf.base + "/";
				    });
				});
			} else {
				location.href = wbdcnf.base + "/";
			}
		}
	});
}
var next_url = null; // 跳转URL
var add_login_success = false; // 添加登录成功函数
/**判断是否登录未登录弹窗*/
function isLogin(url, add_login_function){
	if($.checkLogin()) {
		return true;
	} else {
		if(url)
			next_url = url;
		if(add_login_function)
			add_login_success = add_login_function;
		var bh = $("body").height();
		var bw = $("body").width();
		$("<div id=\"window_dialog\"></div>").css({"height":bh,"width":bw}).appendTo("body").load(wbdcnf.base + "/login/window/");
		return false;
	}
}

/**
 * 文件大小验证
 */
function checkSize(file, showAlert, max_size) {
	if(!max_size)
		max_size = 3;
	var max_file_size = max_size * 1024 * 1024;
	if(file && file.files && file.files[0] && file.files[0].size) {
		var size = file.files[0].size;
		if(size > max_file_size) {
			if(showAlert)
				alert("上传图片文件过大，请上传小于" + max_size + "M的文件！");
			return false;
		}
	}
	return true;
}
/**
 * 邮箱未验证重定向
 */
function redirect_bing_email(){
	setTimeout(function(){
		window.open(wbdcnf.base + "/login/login_bind_email/");
	},500);
}
/**
 * 百度推送
 */
function baiduPoster() {
    var bp = document.createElement('script');
    bp.src = '//push.zhanzhang.baidu.com/push.js';
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
}
//导航效果
function getHeadNavIndex() {
	return -1;
}
$(document).ready(function() {
	var headNavIndex = getHeadNavIndex();
	if (headNavIndex > -1)
		$(".jl-nav .nav-li").removeClass("current").eq(headNavIndex).addClass("current");
	var $liCur = $(".jl-nav ul .nav-li.current");
	if ($liCur && $liCur.position())
		var curP = $liCur.position().left;
	var curW = $liCur.outerWidth(true),
		$slider = $(".jl-nav-curBg"),
		$navBox = $(".jl-nav");
	$targetEle = $(".jl-nav ul .nav-li a"),
		$slider.animate({
			"left": curP,
			"width": curW
		});
	$targetEle.mouseenter(function() {
		var $_parent = $(this).parent(),
			_width = $_parent.outerWidth(true),
			posL = $_parent.position().left;
		$slider.stop(true, true).animate({
			"left": posL,
			"width": _width
		}, "fast");
	});
	$navBox.mouseleave(function(cur, wid) {
		cur = curP;
		wid = curW;
		$slider.stop(true, true).animate({
			"left": cur,
			"width": wid
		}, "fast");
	});
//	$(".jl-ej-nav").mouseenter(function(){
//		$(this).parent().addClass('current');
//		$slider.css('opacity','0');
//	});
//	$(".jl-ej-nav").mouseleave(function(){
//		$(this).parent().removeClass('current');
//		$slider.css('opacity','1');
//	});
});
