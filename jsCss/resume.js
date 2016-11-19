/**
 * 在线编辑JS
 * JS使用说明：
 * 1.国际化：
 *        所有需要使用到国际化的元素名称都是用样式"resume_lang_xxxx"，xxxx为localLang的key值
 *        type为html表示为div内容；value表示为input值
 *        zh为中文；en为英文
 * 2.取值：
 *        基本属性（姓名、年龄等等）：
 *            class：resume_msg；for-key：属性名称；for-type：自定义；for-value：值的属性（默认：input，html：div内容，value：input）
 *        含有时间的混合属性值：
 *            class：resume_item；for-key（id）：属性名称；resume_value：属性值；resume_item_items：多项值（resume_time：时间；resume_unit：单位；resume_job：职位）
 *        图标项：
 *            class：resume_icon resume_icon_item；resume_value：单项；for-key：属性名称；for-value：属性值类型（默认：input，html：div内容，value：input）；
 *        图表项：
 *            class：resume_graph resume_graph_item；resume_value：单项；for-key：属性名称；for-value：属性值类型（默认：input，html：div内容，value：input）；
 *        自定义项：
 *            class：resume_custom；id：唯一标识；resume_name：自定义项名称；其他类同于"含有时间的混合属性值"；
 * 3.头像：
 *        头像外部div的ID：resume_head，img的class：resume_head
 * 4.线条工具：
 *        所有可编辑的线条加上class：resume_line
 * 5.图标工具:(for-id保存为key，遍历显示)
 *        所有可编辑的图标工具加上class：resume_icon_diy
 * 6.模块的显示隐藏
 *        取值：.resume_module span；for-id与模块的id值一致；
 * 7.模块排序：(分bar和foo排序)
 *        排序的模块加样式：resume_sort；同时含有唯一的标识。
 * 8.模块删除
 *        删除按钮样式：resume_delete；删除最近的一个区域：resume_delete_area
 *        内容删除按钮样式：resume_delete_；删除最近一个内容区域：resume_delete_area_
 *        自定义项删除样式：resume_custom_delete；删除最近一个自定义项区域：resume_custom_delete_area
 * 9.编辑区域
 *        所有可编辑的内容使用div+contenteditable实现
 *        所有可添加模块在尾部定义添加内容：get_resume_msg：自定义属性；get_resume_graph：自定义图表；get_resume_icon：自定义图标；
 *        get_resume_item多项值的单项；get_resume_item_area：自定义不含时间的自定义项；get_resume_items_area：自定义含时间的自定义项；
 *        编辑区域样式：
 *            baseBorder：可编辑边框
 * 10.加载参数
 *        setSquare：是否是正方形头像，是否是圆形头像
 *        setTheme：当前主题标识
 *        resumeStyle：当前主题支持的颜色（主题名称，颜色值），当前主题
 *        resumeModuleSort：排序
 * 11.导出加载
 *        var language：当前语言
 *        resumeModuleSort：排序
 * 12.提示内容
 *        提示的内容最外层div上面添加resume_notice，notice-key为提示什么内容
 * 13.拖拽内容
 *        拖拽内容为resume_drag
 * 14.简历首次保存：
 *        简历首次保存，服务器返回的是resumeId 和visitid的JSOn字符串
 *        并且使用H5的pustState功能改变了浏览器的URL
 *        并且会会把当前保存的简历在右边显示出来
 *
 */
var validate_modul_error_message = {flag: 1, message: ""}//flag:0--验证有错误，message:模块名
var addMessage = {} // 获取添加信息
var themeMessage = {} // 当前主题信息
var pageHeight = 1556; // 每页高度
var nowPageSize = 0; // 当前页数
var resumeNoticeContent = null; // 内容提示信息
var fs = require('fs');
var nativeImage = require('electron').nativeImage;
var remote = require('electron').remote;
var dialog = remote.dialog;
var shell = require('electron').shell;

// 国际化
var localLang = {
    // 基本信息
    "name": {"type": "value", "zh": "姓名：", "en": "Name :"},
    "sex": {"type": "value", "zh": "性别：", "en": "Sex :"},
    "age": {"type": "value", "zh": "年龄：", "en": "Age :"},
    "applicant": {"type": "value", "zh": "申请者：", "en": "Applicant :"},
    "checking_time": {"type": "value", "zh": "检查时间：", "en": "Checking Time :"},
    "address": {"type": "value", "zh": "住院号：", "en": "Address :"},
    "admission_number": {"type": "value", "zh": "住院号：", "en": "Admission Number :"},
    "mobile": {"type": "value", "zh": "联系方式：", "en": "Mobile :"},
    "email": {"type": "value", "zh": "邮箱", "en": "E-mail :"},
    "job": {"type": "value", "zh": "职业：", "en": "Job :"}
};

//绑定粘贴事件，使粘贴的数据只保留文本
document.addEventListener("paste", function (e) {
    if ($(":focus").is("div[contenteditable=true]")) {
        $(":focus").insertAtCaret(e.clipboardData.getData("text"));
        e.preventDefault();
    }
});


// 初始化信息
$(function () {
    $.fn.extend({
        insertAtCaret: function (myValue) {
            var $t = $(this)[0];
            if (document.selection && document.selection.createRange) {
                document.selection.createRange().pasteHTML(text);
            } else if (window.getSelection && window.getSelection().getRangeAt(0)) {
                var j = window.getSelection();
                var range = j.getRangeAt(0);
                range.collapse(false);
                var node = range.createContextualFragment(myValue);
                var c = node.lastChild;
                range.insertNode(node);
                if (c) {
                    range.setEndAfter(c);
                    range.setStartAfter(c)
                }
                j.deleteFromDocument();
                j.removeAllRanges();
                j.addRange(range);
            }
        }
    });
    //$('[data-toggle="tooltip"]').tooltip();

    /**
     * 模块显示隐藏
     */
    $(".resume_module li span").live("click", function () {
        var $this = $(this);
        var forid = $this.attr("for-id");
        var checked = $this.hasClass("checked");
        if (checked) {
            $("#" + forid).hide();
            $this.removeClass("checked");
        } else {
            $("#" + forid).show();
            $this.addClass("checked");
            $('html,body').animate({scrollTop: $("#" + forid).offset().top - 200}, 200);
        }
        resumeFomart();
    });

    // 返回顶部
    $(window).scroll(function () {
        var scrollt = document.body.scrollTop - document.documentElement.scrollTop;
        if (scrollt > 200)
            $(".gotop").show();
        else
            $(".gotop").hide();
    });
    $(".gotop").click(function () {
        $("html,body").animate({scrollTop: "0px"}, 200);
    });

    $(".navBar li").click(function () {
        var $this = $(this);
        var type = $this.attr("data-module");
        showModule(type);
    });

    // 删除
    $(".baseDel .delete").live("mouseover", function () {
        $(this).parents(".baseDel").css({
            'border-color': '#ccc',
            'border-width': '1px',
            'border-style': 'dashed',
            'opacity': '0.5'
        });
        $(this).css('opacity', '1');
    });
    $(".baseDel .delete").live("mouseout", function () {
        $(this).parents(".baseDel").css({'border-color': 'transparent', 'opacity': '1'});
    });
    $(".baseDel_ .delete_").live("mouseover", function () {
        $(this).parents(".baseDel_").css({
            'border-color': '#ccc',
            'border-width': '1px',
            'border-style': 'dashed',
            'opacity': '0.5'
        });
        $(this).css('opacity', '1');
    });
    $(".baseDel_ .delete_").live("mouseout", function () {
        $(this).parents(".baseDel_").css({'border-color': 'transparent', 'opacity': '1'});
    });

    $(".custDel .cust_delete").live("mouseover", function () {
        $(this).parents(".custDel").css({
            'border-color': '#ccc',
            'border-width': '1px',
            'border-style': 'dashed',
            'opacity': '0.5'
        });
        $(this).css('opacity', '1');
    });

    $(".custDel .cust_delete").live("mouseout", function () {
        $(this).parents(".custDel").css({'border-color': 'transparent', 'opacity': '1'});
    });
    //
    $(".baseDel").live("mouseover", function () {
        $(this).find(".delete").show();
    });
    $(".baseDel").live("mouseout", function () {
        $(this).find(".delete").hide();
    });

    $(".baseDel .conTitle").live("mouseover", function () {
        $(this).siblings(".delete").css({'display': 'block'});
    });
    $(".baseDel .conTitle").live("mouseout", function () {
        $(this).siblings(".delete").css({'opacity': '0'});
    });
    //整个模块删除状态
    $(".editBtn .btnDel").live("mouseover", function () {
        $(this).parents(".positonDiv").children('dl').css({'opacity': '0.5'});
        $(this).parents(".positonDiv").children('.skillUl').css({'opacity': '0.5'});
    });
    $(".editBtn .btnDel").live("mouseout", function () {
        $(this).parents(".positonDiv").children('dl').css({'opacity': '1'});
        $(this).parents(".positonDiv").children('.skillUl').css({'opacity': '1'});
    });

    //hover边框
    $(".baseDel .conTitle").live("mouseover", function () {
        $(this).parents(".baseContent").css({
            'border-color': 'rgba(141, 165, 252, 0.6)',
            'border-width': '1px',
            'border-style': 'dashed'
        });
        $(this).siblings(".delete").css({'opacity': '1'});
    });
    $(".baseDel .conTitle").live("mouseout", function () {
        $(this).parents(".baseContent").css({
            'border-color': 'transparent',
            'border-width': '1px',
            'border-style': 'dashed'
        });
        $(this).siblings(".delete").css({'opacity': '0'});
    });

    //拖拽调用
    (function () {
        var foo = document.getElementById("foo");
        if (foo) {
            new Sortable(foo, {
                group: "sortLeft",
                handle: ".editBtn"
            });
        }

        var bar = document.getElementById("bar");
        if (bar) {
            new Sortable(bar, {
                group: "sortLight",
                handle: ".editBtn"
            });
        }
    })();

    /**
     * 自动保存--两分钟自动保存一次
     */
    setInterval(function () {
        if (save_trigger != undefined && save_trigger) {
            console.log("没有修改---不需要保存");
        } else {
            console.log("有修改---需要保存")
            resumeSave(false);
        }
    }, 30 * 1000);
    /**
     * 禁止时间，单位，职位做回车操作
     */
    $(".resume_time,.resume_unit,.resume_job").live("keydown", function (event) {
        if (event.keyCode == 13 || event.charCode == 13) {
            return false;
        }
    });
    // 国际化
    i18n();
    // 加载编辑工具
    resumeModal();
    resumeHead();
    resumeIcon();
    resumeLine();
    resumeUpload();
    resumeHidden();
    resumeDelete();
    resumeLanguage();
    resumeCommonButton();
    resumeAddResumeItem();
    resumeAddResumeItems();
    resumeEditor();
    resumeFomart();
    resumeFeedback();
    resumeLinePull();
    resumeImage();
    resumeImageV4();
    resumeTable();
    resumeTextarea();
    resumeDrag();
    resumeChangeTemplate();
    resumeNotice();
});

/**
 * 线条拉升
 */
var pullLine = null;
function resumeLinePull() {
    $(".resume_line").live("mousedown", function () {
        var $this = $(this);
        pullLine = new Object();
        pullLine.x = window.event.clientX;
        pullLine.y = window.event.clientY;
        pullLine.width = parseInt($this.css("width"));
        pullLine.line = $this;
    });

    $(document).mouseup(function () {
        if (pullLine)
            pullLine = null;
    });

    $(document).mousemove(function (e) {
        resumeLineDraw(pullLine, window.event.clientX, window.event.clientY);
        if (dragObject)
            return false;
    });
}
/**
 * 重写线条
 */
function resumeLineDraw(pullLine, x, y) {
    if (pullLine) {
        var line = pullLine.line;
        var ox = pullLine.x;
        var width = pullLine.width;
        line.css("width", (x - ox + width) + "px");
    }
}

var member = {};
function setMember(id, resumeId) {
    if (id)
        member.id = id;
    if (resumeId)
        member.resumeId = resumeId;
}

/**
 * 建议反馈
 */
function resumeFeedback() {
    $("#submitFeedback").click(function () {
        $("#feedbackForm input[name=brower]").val(navigator.userAgent);
        $.post(wbdcnf.base + "/editresume/feedback/", $("#feedbackForm").serialize(), function (message) {
            if (message.type == "success")
                $('#suggestsModal').modal("hide");
            notice(message.content);
        });
    });
}

/**
 * 浏览器提示
 */
function resumeBrowser() {
    var appName = navigator.appName;
    var appVersion = navigator.appVersion;
    if (appName == "Microsoft Internet Explorer") {
        var broserVersion = appVersion.match(/MSIE (\d)\.0/i);
        if (broserVersion && broserVersion.length == 2) {
            var versionNumber = broserVersion[1];
            if (versionNumber < 9) {
                $(".browserPrompt").show();
            } else if (!localStorage || !localStorage.getItem("browserPrompt"))
                $(".browserPrompt").show();
        }
    }
    $(".browserPrompt .close").click(function () {
        $(".browserPrompt").hide();
        if (localStorage)
            localStorage.setItem("browserPrompt", "true");
    });
}

/**
 * 窗口显示
 */
function resumeModal() {
    // 提示框
    var options = {"show": false};
    // 版本提示框
    var showPromModal = true;
    if (localStorage && localStorage.getItem("showPromModal"))
        showPromModal = false;
    else if (localStorage)
        localStorage.setItem("showPromModal", "false");
    if (showPromModal) {
        $('#promptModal').modal().on("hide.bs.modal", function () {
            resumeBrowser();
        });
    } else {
        resumeBrowser();
    }
    // 图标提示框
    $('#myModalIcon').modal(options).on("show.bs.modal", function () {
        if (!iconIsInit) {
            loadIcon();
            iconIsInit = true;
        }
    });

    //模板选择提示框
    $('#myModalxzmb').modal(options).on("show.bs.modal", function () {
    }).on("hide.bs.modal", function () {
    });

    //删除提示框
    //$('#delModal').modal();

    // 插入图片提示框
    $('#myModalPic').modal(options).on("show.bs.modal", function () {
        $("#image_area .image_notice").show();
        $("#image_area .image_image").hide();
        $("#image_view .viewImg").removeAttr("style");
        $("#image_view img").attr("src", "").removeAttr("style");
        $(".picModal .picUpload").css("background", "#F0F0F0 url(" + wbdcnf.staticUrl + "/resources/500d/editresume/images/uploadbg.png) no-repeat center 60px");
    }).on("hide.bs.modal", function () {
        closeCutImage();
    });
    // 头像提示框
    $('#myModalHead').modal(options).on("show.bs.modal", function () {
        $("#head_area .head_notice").show();
        $("#head_area .head_image").hide();
        $("#head_view img").attr("src", "");
        $(".picModal .picUpload").css("background", "#F0F0F0 url(" + wbdcnf.staticUrl + "/resources/500d/editresume/images/uploadbg.png) no-repeat center 60px");
    }).on("hide.bs.modal", function () {
        closeCutHead();
    });
    // 插入文本框提示框
    $('#myModalText').modal(options).on("show.bs.modal", function () {
        $("#resumeInsertText").val("");
    });
    ;
    // 自定义提示框
    $('#myModalnrmk').modal(options).on("show.bs.modal", function () {
        $('#myModalnrmk').find(".resume_name").val("");
        $('#myModalnrmk').find(".resume_time").val("");
        $('#myModalnrmk').find(".resume_unit").val("");
        $('#myModalnrmk').find(".resume_job").val("");
        $('#myModalnrmk').find(".resume_content").val("");
    });
    // 导入提示框
    $('#myModaldrmk').modal(options);
}

/**
 * 改变模板
 */
function resumeChangeTemplate() {
    $(".resume_change_template").live("click", function () {
        var $this = $(this);
        resumeSave();
        var itemId = $this.attr("data-itemid");
        location = wbdcnf.base + "/editresume/resume/?itemid=" + itemId + "&resumeId=" + member.resumeId;
    });
}

/**
 * 格式化：分页位置，多页控制最后一页高度
 * 注：导出的JS
 */
var resumePageHeight = 0;
var resumePageBreak = '<div class="resumePageBreak"><span>该处分页请回车OR换行避开</span></div>';
var resumePageBreak_v4 = '<div class="resumePageBreak_v4"><span>该处分页请回车OR换行避开</span></div>';
function resumeFomart() {
    var resumeBody = $("#resume_body");
    var resumeHeight = resumeBody.css({"height": "auto"}).outerHeight();
    //判断一下版本
    var resume_version = $("#resume_body").attr("version");
    var tmpHeigth = pageHeight;
    if (resume_version != null && resume_version != "" && resume_version == "v4" && resumeHeight > 1556) {
        tmpHeigth = 1536;//v4版本增大了分页符的高度，所以这里分页的位置要提高有点
    }
    if (resume_version != null && resume_version != "" && resume_version == "v4") {
        resumePageBreak = resumePageBreak_v4;//使用v4样式
    }
    resumeBody.css({"height": resumePageHeight + "px"});
    var pageSize = Math.ceil(resumeHeight / tmpHeigth);
    if (pageSize != nowPageSize) {
        resumePageHeight = pageSize * tmpHeigth;
        resumeBody.css({"height": resumePageHeight + "px"});
        nowPageSize = pageSize;
        for (var index = 1; index < pageSize; index++) {
            var pageBreakObj = $(resumePageBreak);
            pageBreakObj.css({"top": (index * tmpHeigth) + "px"});
            resumeBody.append(pageBreakObj);
        }
    }
}

/**
 * 语言切换
 */
function resumeLanguage() {
    $("#langSwitch").click(function () {
        if ($("#langSwitch").attr("for-value") == "en") {
            $("#langSwitch").attr("for-value", "zh");
            $("#langSwitch").html("english");
        } else {
            $("#langSwitch").attr("for-value", "en");
            $("#langSwitch").html("中文");
        }
        console.log("切换语言为：" + $("#langSwitch").attr("for-value"));
        i18n();
    });
}

/**
 * 显示当前模块
 */
function showModule(type) {
    var $this = $(".navBar li[data-module='" + type + "']");
    $this.addClass("current").siblings().removeClass("current")
    $(".mainBar .baseBar").eq($this.index()).show().siblings().hide();
}

/**
 * 自定义确认框
 */
function resumeConfirm(content, success, cancel) {
    if (!content)
        content = "删除后该内容将不可恢复，确认删除吗？";
    $("#confirmContent").text(content);
    $('#delModal').modal("show");
    $("#confirmSuccess").click(function () {
        if (success) {
            success();
            cancel = null;
            success = null;
            $('#delModal').modal("hide");
            $("#confirmSuccess").unbind("click"); // 解除事件
        }
    });
    $("#confirmCancel").click(function () {
        if (cancel) {
            cancel();
            cancel = null;
            success = null;
            $('#delModal').modal("hide");
            $("#confirmCancel").unbind("click");
        }
    });
}

/**
 * 加载编辑器
 */
function resumeEditor() {
    // 普通按钮
    $(".resume_edit_button").click(function () {
        var $this = $(this);
        var command = $this.attr("data-command");
        var param = $this.attr("data-param");
        if (command) {
            switch (command) {
                case "FontSize":
                    var size = parseInt(document.queryCommandValue("FontSize"));
                    if (param && param == "+1")
                        document.execCommand("FontSize", false, size + 1);
                    else if (param && param == "-1")
                        document.execCommand("FontSize", false, size - 1);
                    break;
                default:
                    document.execCommand(command, false);
                    break;
            }
        }
    });
    // input按钮
    $(".resume_edit_input input").click(function () { // 设置当前INPUT
        var color = document.queryCommandValue("ForeColor");
        var $this = $(this);
        var $parent = $this.closest(".resume_edit_input");
        var command = $parent.attr("data-command");
        if (command) {
            switch (command) {
                case "ForeColor":
                    var color = document.queryCommandValue("ForeColor");
                    if (color) {
                        var regex = /[0-9]+/g;
                        var numbers = color.match(regex);
                        var colorHex = "#";
                        if (numbers && numbers.length == 3) {
                            colorHex += toHex(numbers[0]);
                            colorHex += toHex(numbers[1]);
                            colorHex += toHex(numbers[2]);
                            $this.val(colorHex);
                        }
                    }
                    break;
            }
        }
    });
    $(".resume_edit_input input").change(function () { // INPUT修改设置
        var $this = $(this);
        var $parent = $this.closest(".resume_edit_input");
        var command = $parent.attr("data-command");
        if (command) {
            switch (command) {
                case "ForeColor":
                    var color = $this.val();
                    $("#ForeColor").css("border-bottom-color", color);
                    document.execCommand("ForeColor", false, color);
                    break;
            }
        }
    });
    // select按钮
    $(".resume_edit_select select").click(function () { // 设置当前SELECT
        var $this = $(this);
        var $parent = $this.closest(".resume_edit_select");
        var command = $parent.attr("data-command");
        if (command) {
            switch (command) {
                case "FontName":
                    var name = document.queryCommandValue("FontName");
                    break;
                case "FontSize":
                    var size = document.queryCommandValue("FontSize");
                    break;
            }
        }
    });
    $(".resume_edit_select select").change(function () { // SELECT修改设置
        var $this = $(this);
        var $parent = $this.closest(".resume_edit_select");
        var command = $parent.attr("data-command");
        if (command) {
            switch (command) {
                case "FontName":
                    var name = $this.val();
                    document.execCommand("FontName", false, name);
                    break;
                case "FontSize":
                    var size = $this.val();
                    document.execCommand("FontSize", false, size);
                    break;
            }
        }
    });
    $("div[contenteditable]").live("click", function () {
        removeFocus();
        var size = document.queryCommandValue("FontSize");
        var name = document.queryCommandValue("FontName");
        $("#resume_font_name option").prop("selected", false);
        $("#resume_font_name").find("option[data-name=" + name + "]").prop("selected", true);
        $("#resume_font_size option").prop("selected", false);
        $("#resume_font_size").find("option[data-size=" + size + "]").prop("selected", true);
        var color = document.queryCommandValue("ForeColor");
        if (color) {
            var regex = /[0-9]+/g;
            var numbers = color.match(regex);
            var colorHex = "#";
            if (numbers && numbers.length == 3) {
                colorHex += toHex(numbers[0]);
                colorHex += toHex(numbers[1]);
                colorHex += toHex(numbers[2]);
                $("#ForeColor").css("border-bottom-color", colorHex);
            }
        }
        showModule("edit");
        editArea = $(this);
        var userSelection;
        if (window.getSelection) { //现代浏览器
            userSelection = window.getSelection();
        } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
            userSelection = document.selection.createRange();
        }
        if (userSelection)
            startOffset = $(userSelection.focusNode.parentElement).index();
    });
    $("div[contenteditable]").live("keyup", function () {
        saveNotice(false);
        resumeFomart();
    });
    $(".resume_add").click(function () {
        showModule("model");
    });
    $(".delete,.delete_").click(function () {
        showModule("model");
    });
}
/**
 * 颜色十六位
 */
function toHex(number) {
    number = parseInt(number);
    if (number > 10)
        return parseInt(number).toString(16);
    else
        return "0" + parseInt(number).toString(16);
}


/**
 * 线条工具
 */
var nowLine = null;
function resumeLine() {
    $("#line_width").change(function () {
        var width = $(this).val();
        if (nowLine) {
            nowLine.css({"width": width + "px"});
        } else {
            notice("请点击线条后再修改！");
        }
    });
    $(".line_style").click(function () {
        var style = $(this).attr("data-style");
        if (nowLine) {
            nowLine.css({"border-top-style": style});
        } else {
            notice("请点击线条后再修改！");
        }
    });
    $(".line_width").click(function () {
        var width = $(this).attr("data-width");
        if (nowLine) {
            nowLine.css({"border-top-width": width + "px"});
        } else {
            notice("请点击线条后再修改！");
        }
    });
    $(".resume_line").live("click", function () {
        showModule("line");
        removeFocus();
        nowLine = $(this);
        nowLine.addClass("resume_focus");
        addFocusStyle(nowLine.css("width"), nowLine.css("border-top-width"), nowLine.css("border-top-color"));
        $("#line_width").val(parseInt(nowLine.css("width")));
    });
}

/**
 * 添加选中样式
 * @param width 选中区域宽度
 * @param height 选中区域高度
 */
function addFocusStyle(width, height, color) {
    width = parseInt(width);
    height = parseInt(height);
    if (!color)
        color = "#ff6600";
    $("#resume_focus_style").remove();
    $("head").append('<style type="text/css" id="resume_focus_style">\
		.resume_focus:after{\
			position:absolute;\
			content:"";\
			width:' + (width + 6) + 'px;\
			height:' + (height + 6) + 'px;\
			top:-' + (height + 3) + 'px;\
			left:-3px;\
		}\
	</style>');
    //border:1px dashed ' + color + ';\---去掉选中样式
}

/**
 * 去掉选中样式
 */
function removeFocus() {
    if (nowLine)
        nowLine.removeClass("resume_focus");
    if (nowIcon)
        nowIcon.removeClass("resume_focus");
}

/**
 * 图标工具
 */
var iconPage = 1;
var nowIcon = null;
var iconIsInit = false;
function resumeIcon() {
    $("#icon_search").click(function () {
        loadIcon();
    });
    $("#myModalIcon .icon_type a").click(function () {
        $("#myModalIcon .icon_type a").removeClass("current");
        $(this).addClass("current");
        loadIcon();
    });
    $("#myModalIcon .icon_page button").click(function () {
        var type = $(this).attr("data-type");
        if (type && type == "prev")
            loadIcon(-1);
        else
            loadIcon(+1);
    });
    $("#resume_icon_list li").live("click", function () {
        var $this = $(this);
        if (nowIcon) {
            var code = $this.attr("data-code");
            nowIcon.text(code);
            $('#myModalIcon').modal("hide");
        } else {
            notice("请点击图标后替换！");
        }
    });
    $("#icon_size").change(function () {
        var size = $(this).val();
        if (nowIcon) {
            nowIcon.css({"fontSize": size + "px"});
        } else {
            notice("请点击图标后再修改！");
        }
    });
    $(".resume_icon_diy").live("click", function () {
        // showModule("icon");
        removeFocus();
        nowIcon = $(this);
        $("#icon_size").val(parseInt(nowIcon.css("fontSize")));
        $("#myModalIcon").modal({"show": true});
    });
    $(".resume_icon_diy").live("click", function () {
        // showModule("icon");
        removeFocus();
        nowIcon = $(this);
        nowIcon.addClass("resume_focus");
        addFocusStyle(nowIcon.width(), nowIcon.height(), nowIcon.css("border-top-color"));
    });
    $("#icon_search_value").keyup(function (e) {
        if (e.keyCode == "13")
            loadIcon();
    });
}
// 加载
function loadIcon(page) {
    if (page)
        iconPage += page;
    else
        iconPage = 1;
    var type = $("#myModalIcon .icon_type a.current").attr("data-type");
    if (!type)
        type = "";
    var name = $("#icon_search_value").val();
    if (!name)
        name = "";

    //判断一下版本
    var resume_version = $("#resume_body").attr("version");
    if (!resume_version) {
        resume_version = "v1";
    } else {
        resume_version = "v4";
    }
    $("#icon_list").load(wbdcnf.base + "/editresume/icon/?type=" + type + "&page=" + iconPage + "&name=" + name + "&resume_version=" + resume_version);
}

/**
 * 设置主题信息
 * @param resumeBankItemId 当前主题标识
 * @param clazz 当前主题样式
 */
function setTheme(resumeBankItemId, clazz) {
    if (clazz)
        themeMessage["clazz"] = clazz;
    if (resumeBankItemId)
        themeMessage["resumeBankItemId"] = resumeBankItemId;
}

/**
 * 常用按钮
 */
function resumeCommonButton() {
    $("#resume_save").click(function () {
        resumeSave();
    });

    // 导出按钮
    $("#resume_down").click(function (e) {
        resumeSave();
        window.open(wbdcnf.base + "/editresume/export/" + member.resumeId + "/");
    });

    // 生成按钮
    $("#resume_view").click(function (e) {
        resumeSave();
        window.open(wbdcnf.base + "/resume/" + member.resumeId + "/");
    });
}

/***
 * 类型：简历（resume），封面（cover），自荐信（letter）
 */
var resumeType = "resume";
function setResumeType(value) {
    if (value)
        resumeType = value;
}

/**
 * 保存
 */
function resumeSave(showNotice) {
    var json = getResume();
    var validate_json = json;
    var clearText_validate_json = clearAllHtmlText(JSON.stringify(validate_json));
    console.log("简历字数" + clearText_validate_json.length);
    if (clearText_validate_json.length > 100000) {
        notice("保存失败！字数超出限制。");
    }
    if (validate_modul_error_message != null && validate_modul_error_message.flag == 0) {
        //alert(validate_modul_error_message.message);
        layer.msg(validate_modul_error_message.message, {time: 6000});
        validate_modul_error_message.flag = 1;//还原状态
        validate_modul_error_message.message = "";
        var $saveModal_tips = $('#saveModal');
        if ($saveModal_tips && $saveModal_tips.length > 0) {
            $saveModal_tips.modal('hide');
        }
        return;
    }
    var saveUrl = "";
    if (resumeType == "resume")
        saveUrl = wbdcnf.base + "/editresume/save/";
    else if (resumeType == "cover")
        saveUrl = wbdcnf.base + "/editresume/savecover/";
    else if (resumeType == "letter")
        saveUrl = wbdcnf.base + "/editresume/saveletter/";
    $.ajax({
        type: "post",
        async: false,
        url: saveUrl,
        data: {
            "id": themeMessage.resumeBankItemId,
            "memberId": member.id,
            "resumeId": member.resumeId,
            "json": JSON.stringify(json)
        },
        success: function (message) {
            if (typeof(showNotice) == "undefined" || showNotice) {
                if (member.resumeId == null || member.resumeId == 0 || member.resumeId == "") {//首次成功保存，返回简历ID
                    if (message.type == "error") {
                        layer.msg(message.content);
                    } else {
                        notice("保存成功");
                    }
                } else {
                    if (message.type == "error") {
                        layer.msg(message.content);
                    } else {
                        notice(message.content);
                    }
                }
                if (message.content == "没有登录！")
                    window.open(wbdcnf.base + "/login/");
            }
            if (message.type == "success") {
                saveNotice(true);
                //判断是否首次保存,首次保存的话，message内容返回的Json字符串
                if (member.resumeId == null || member.resumeId == "" || member.resumeId == 0) {
                    //改变浏览器URL，防止刷新简历内容不见
                    var data_json = JSON.parse(message.content);
                    var data_resume_id = data_json.resumeId;
                    var data_visit_id = data_json.visitId;
                    var data_url = wbdcnf.base + '/editresume/resume/?itemid=' + themeMessage.resumeBankItemId + '&resumeId=' + data_resume_id;
                    history.pushState(null, "简历首次保存", data_url);
                    member.resumeId = data_resume_id;
                    $("#hidden_data_resume_id").val(data_resume_id);

                    //预览按钮的链接
                    if ($("#preview_btn").length > 0) {
                        var pre_url = wbdcnf.base + '/resume/' + data_visit_id + '/';
                        $("#preview_btn").attr("href", pre_url);
                    }
                    //设置框的visitId值
                    if ($("#visitid").length > 0) {
                        $("#visitid").val(data_visit_id);
                    }
                }
                return true;
            } else {
                return false;
            }
        }
    });
    return false;
}

/**
 * 加载风格
 */
var defaultStyle = null;
function resumeStyle(styles, defaultValue) {
    var styleList = $("#resume_style");
    if (styles) {
        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            for (var key in style) {
                var value = style[key];
                if (!defaultValue) {
                    if (i == 0)
                        defaultStyle = key;
                    styleList.append('<li class="resume_style ' + (i == 0 ? 'current' : '') + '" data-style="' + key + '" style="background-color:#' + value + ';"></li>');
                } else {
                    defaultStyle = defaultValue;
                    styleList.append('<li class="resume_style ' + (key == defaultValue ? 'current' : '') + '" data-style="' + key + '" style="background-color:#' + value + ';"></li>');
                }
                break;
            }
        }
    }

    if (defaultValue)
        defaultStyle = defaultValue;
    styleList.find(".resume_style").click(function () {
        styleList.find(".resume_style").removeClass("current");
        var $this = $(this);
        $this.addClass("current");
        var style = $this.attr("data-style");
        $("#resume_body").removeClass(defaultStyle).addClass(style);
        defaultStyle = style;
    });
}

/**
 * 提示信息
 */
function notice(message) {
    if (!message || message == "")
        message == "操作成功！";
    $("#pop_box").text(message).show(function () {
        $(this).animate({"top": "26%", "opacity": "1"});
    });
    setTimeout(function () {
        $("#pop_box").text(message).animate({"top": "30%", "opacity": "0"}, function () {
            $(this).hide();
        });
    }, 4000);
}

/**
 * 添加信息项
 */
function resumeAddResumeItem() {
    $(".add_module_confirm").click(function () {
        var name = $('#myModalnrmk').find(".resume_name").val();
        var time = $('#myModalnrmk').find(".resume_time").val();
        var unit = $('#myModalnrmk').find(".resume_unit").val();
        var job = $('#myModalnrmk').find(".resume_job").val();
        var content = "<p>" + $('#myModalnrmk').find(".resume_content").val() + "</p>";
        if (!name || name == "") {
            if ($('#myModalnrmk').find(".resume_name").hasClass("resume_v4")) {
                $('#myModalnrmk').find(".resume_name").css("border", "1px solid #FF4504");
                $('#myModalnrmk').find(".resume_name").attr("placeholder", "名称必填");
            } else {
                notice("请填写自定义模块名称");
            }
            return;
        }
        var id;
        var item;
        if ((time && time.length > 0) || (unit && unit.length > 0) || (job && job.length > 0)) {
            item = $(addMessage.get_resume_items_area());
            id = item.attr("id");
            item.find(".resume_name").html(name);
            item.find(".resume_time").html(time);
            item.find(".resume_unit").html(unit);
            item.find(".resume_job").html(job);
            item.find(".resume_value").html(content);
        } else {
            item = $(addMessage.get_resume_item_area());
            id = item.attr("id");
            item.find(".resume_name").html(name);
            item.find(".resume_value").html(content);
        }
        if (name.length > 6) {
            name = name.substring(0, 6) + "..";
        }
        $("#resume_module").append('<li><span class="checked" for-id="' + id + '"></span>' + name + '</li>');
        var data_version = $('#myModalnrmk').attr("data_version");
        if (data_version == null || data_version == "") {
            $(".resume_main").append(item);
        } else {//v4
            $(".wbd-addBtn").before(item);
        }
        $('#myModalnrmk').modal("hide");
    });
}

/**
 * 上传模板
 */
function resumeUpload() {
    $(".import_confirm").click(function () {
        var name = $("#resumeFile").val();
        var fileName = name.substring(name.lastIndexOf("\\") + 1);
        var fileType = name.substring(name.lastIndexOf(".") + 1);
        if (fileType.toLocaleLowerCase() != "doc" && fileType.toLocaleLowerCase() != "docx") {
            alert("只支持doc，docx文件格式！");
            return;
        }
        $.ajaxFileUpload({
            type: 'post',
            secureuri: false,
            dataType: 'content',
            fileElementId: 'resumeFile',
            url: wbdcnf.base + '/editresume/upload/',
            data: {"token": getCookie("token")},
            success: function (data, status) {
                if (data == "error")
                    alert("修改失败！");
                else if (data == "cantread")
                    alert("解析不了该word，请使用word另存一份标准的doc/docx文档！");
                else
                    location.reload();
            },
            error: function (data, status, e) {
                alert("发生错误" + e);
            }
        });
    });
}

/**
 * 设置语种
 */
function setLanguage(lang) {
    if ($(".resume_language[value=" + lang + "]").length > 0) {
        $(".resume_language[value=" + lang + "]").prop("checked", true);
    }
    if ($("#hidden_data_resume_language").length > 0) {
        $("#hidden_data_resume_language").val(lang);
    }
    i18n();
}

/**
 * 国际化
 * 注：导出的JS
 */
function i18n() {
    var language = $(".langSwitch").attr("for-value");
    if (language == null || language == "") {
        language = $("#hidden_data_resume_language").val()
    }
    var nowLang = language;
    var oldLang = null;
    if (nowLang == "zh")
        oldLang = "en";
    else
        oldLang = "zh";
    for (var key in localLang) {
        var langValue = localLang[key];
        var type = langValue["type"];
        var nowValue = langValue[nowLang];
        var oldValue = langValue[oldLang];
        var value = null;
        var keyObj = $(".resume_lang_" + key);
        if (type == "html")
            value = keyObj.html();
        else
            value = keyObj.text();
        value = clearBlank(value);
        if (value == oldValue) {
            if (type == "html") {
                keyObj.html(nowValue);
                alert(nowValue);
            }
            else
                keyObj.text(nowValue);
        }
    }
}

var nowTextarea = null; // 当前选中文本框
/**
 * 文本框
 */
function resumeTextarea() {
    // 点击插入时去掉选中文本框
    $('#resume_insert_textarea').click(function () {
        nowTextarea = null;
    });

    $("#resumeInsertTextBtn").click(function () {
        var $text = $("#resumeInsertText");
        var content = $text.val();
        if (!content || content == null) {
            notice("请填写文本！");
            return;
        }
        insertTextarea(content);
        $('#myModalText').modal("hide");
    });

    $(".resume_textarea").live("click", function () {
        nowTextarea = $(this);
        var width = nowTextarea.width();
        var height = nowTextarea.height();
        $("#resume_textarea_width").val(width);
        $("#resume_textarea_height").val(height);
        showModule("text");
    });

    $("#resume_textarea_width").change(function () {
        if (!nowTextarea) {
            notice("请先选择操作文本框！");
            return;
        }
        var width = $(this).val();
        nowTextarea.find("div.textarea").css({"width": width + "px"});
    });

    $("#resume_textarea_height").change(function () {
        if (!nowTextarea) {
            notice("请先选择操作文本框！");
            return;
        }
        var height = $(this).val();
        nowTextarea.find("div.textarea").css({"height": height + "px"});
    });

    $("#resume_textarea_border_color").change(function () {
        var $this = $(this);
        var color = $this.val();
        if (!nowTextarea) {
            notice("请先选择操作文本框！");
            return;
        }
        nowTextarea.css("border-color", color);
    });

    $(".resume_textarea_border_width").click(function () {
        var $this = $(this);
        var width = $this.attr("data-width");
        if (!nowTextarea) {
            notice("请先选择操作文本框！");
            return;
        }
        nowTextarea.css("border-width", width + "px");
    });

    $(".resume_textarea_border_style").click(function () {
        var $this = $(this);
        var style = $this.attr("data-style");
        if (!nowTextarea) {
            notice("请先选择操作文本框！");
            return;
        }
        nowTextarea.css("border-style", style);
    });
}

/**
 * 插入表格
 */
function resumeTable() {
    var resumeTable = $("#resume_table_select");
    for (var i = 0; i < 100; i++) {
        resumeTable.append("<span></span>");
    }

    $("#resume_table_select span").mouseover(function () {
        var index = $(this).index();
        var x = index % 10;
        var y = index / 10;
        $("#resume_table_select span").each(function (jndex, ele) {
            $(ele).css("background", "#f0f0f0");
            if (jndex % 10 <= x && jndex / 10 <= y)
                $(ele).css("background", "#f60");
        });
    });

    $("#resume_table_select span").click(function () {
        var index = $(this).index();
        var x = index % 10;
        var y = parseInt(index / 10);
        x = x + 1;
        y = y + 1;
        var width = parseInt((1 / x) * 100);
        var table = document.createElement("table");
        for (var xindex = 0; xindex < x; xindex++) {
            var tr = document.createElement("tr");
            for (var yindex = 0; yindex < x; yindex++) {
                var td = document.createElement("td");
                td.style.width = width + "%";
                td.innerHTML = "&nbsp;";
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        insertObject(table);
    });
}

/**
 * 插入文本
 */
var editArea;
var startOffset;
function insertObject(object) {
    if (editArea && editArea.length) {
        var node = editArea[0];
        var range = document.createRange();
        range.setStart(node, startOffset + 2);
        try {
            range.insertNode(object);
        } catch (e) {
            notice("插入错误！");
        }
    }
}

var nowImage = null; // 当前图片
var image_image = null; // 剪切图片对象
//剪切图片的参数
var image_cut_message = {
    x: null,
    y: null,
    whdth: null,
    height: null,
    originalw: null
}
/**
 * 图片插入
 */
function resumeImage() {
    // 点击插入时去掉选中图片
    $('#resume_insert_image').click(function () {
        nowImage = null;
    });

    // 上传文件
    $("#imagefile").live("change", function () {
        var name = $(this).val();
        var fileName = name.substring(name.lastIndexOf("\\") + 1);
        var fileType = name.substring(name.lastIndexOf(".") + 1);
        if (fileType.toLocaleLowerCase() != "jpg" && fileType.toLocaleLowerCase() != "png") {
            alert("只支持jpg，png文件格式！");
            return;
        }
        if (!checkSize($(this)[0], true, 2))
            return;
        $("#image_area .image_notice").hide();
        $("#image_area .image_image").show();
        $(".picModal .picUpload").css("background", "#F0F0F0 url(" + wbdcnf.staticUrl + "/resources/500d/editresume/images/loading.gif) no-repeat center 60px");
        $.ajaxFileUpload({
            type: 'post',
            secureuri: false,
            dataType: 'content',
            fileElementId: 'imagefile',
            url: wbdcnf.base + '/file/uploadeditimage/',
            data: {"token": getCookie("token")},
            success: function (data, status) {
                if (data == "error") {
                    alert("修改失败！");
                } else if (data == "notlogin") {
                    alert("上传头像请先登录！");
                } else if (data == "ntosuport") {
                    alert("文件格式不支持！");
                } else {
                    if ($.browser.msie) {
                        if (data.indexOf('<PRE>') >= 0) {
                            data = data.substring(5);
                            data = data.substring(0, data.length - 6);
                        }
                    }
                    cutImage(wbdcnf.staticUrl + data);
                }
            },
            error: function (data, status, e) {
                alert("发生错误" + e);
            }
        });
    });

    $(".image_image_cut").click(function () {
        $.post(wbdcnf.base + "/file/cuteditimage/", {
            x1: image_cut_message.x,
            y1: image_cut_message.y,
            width: image_cut_message.width,
            height: image_cut_message.height,
            originalw: image_cut_message.originalw
        }, function (data) {
            if (data == "error") {
                alert("修改失败！");
            } else if (data == "fileerror") {
                alert("图片文件错误，请重写选择图片！");
            } else if (data == "notlogin") {
                alert("上传头像请先登录！");
            } else if (data == "notfoundfile") {
                alert("文件不存在！");
            } else {
                insertImage(data);
                closeCutHead();
            }
            $('#myModalPic').modal("hide");
        });
    });

    $("#resumeImageChange").click(function () {
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        $("#myModalPic").modal();
    });

    $(".resume_image").live("click", function () {
        nowImage = $(this);
        var width = nowImage.width();
        var height = nowImage.height();
        $("#resume_image_width").val(width);
        $("#resume_image_height").val(height);
        showModule("image");
    });

    $("#resume_image_width").change(function () {
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        var width = $(this).val();
        nowImage.find("img").css({"width": width + "px", "height": "auto"});
    });

    $("#resume_image_height").change(function () {
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        var height = $(this).val();
        nowImage.find("img").css({"height": height + "px", "width": "auto"});
    });

    $("#resume_image_style li").click(function () {
        var $this = $(this);
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        var style = $this.attr("data-style");
        nowImage.removeClass("resume_image_radius");
        if (style && style == "circle")
            nowImage.addClass("resume_image_radius");
    });

    $("#resume_image_border_color").change(function () {
        var $this = $(this);
        var color = $this.val();
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        nowImage.css("border-color", color);
    });

    $(".resume_image_border_width").click(function () {
        var $this = $(this);
        var width = $this.attr("data-width");
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        nowImage.css("border-width", width + "px");
    });

    $(".resume_image_border_style").click(function () {
        var $this = $(this);
        var style = $this.attr("data-style");
        if (!nowImage) {
            notice("请先选择操作图片！");
            return;
        }
        nowImage.css("border-style", style);
    });
}
/**
 * 图片缩放---V4
 * isReloadFlag： 是否是页面加载
 */
//自定义图片缩放
function resumeImgV4(isReloadFlag) {
    if (isReloadFlag != null && isReloadFlag) {
        $(".resume_image .ui-resizable-handle").remove();
    }
    $(".resume_image").resizable({
        aspectRatio: true,
        containment: ".wbd-baseStyle"
    });//缩放
}
//图片插入-----V4
function resumeImageV4() {
    cut_custome_image_v4();
    // 点击插入时去掉选中图片
    $('#resume_insert_image_v4').click(function () {
        nowImage = null;
        $('#setCustomerImageModal').modal('show');
        resumeImgV4(false);
        $(".resume_image .ui-resizable").css('max-width', '1100px')
    });
    //图片裁剪提交
    $("#upload_image_submit_v4").click(function () {
        $(".resumebg1").css('display', 'none');
        $(".insertModal").css('left', '-300px');
        var $image = $('.cut_out_custome_img>img');
        var $isCoopered = $(".cut_out_custome_img").find("div");//判断是否有上传
        if ($isCoopered == null || $isCoopered.length == 0) {
            layer.msg("请先上传图片!");
            return;
        }
        var upload_file = document.getElementById("imagefile_v4").files;
        if (upload_file.length > 0) {
            var upload_file_size = upload_file[0].size / 1024;
            if ((upload_file_size / 1024) > 1) {
                layer.msg("请上传小于2M的图片");
                return;
            }
        }
        $(".zx-loading").show();
        $("#upload_image_submit_v4").prop("disabled", true);
        //图片上传---直接上传裁剪的照片
        var image_cut_data = $image.cropper("getCroppedCanvas");
        var image_cut_data_data = image_cut_data.toDataURL("image/jpeg");
        //把裁剪好的图片上传
        $.post(wbdcnf.base + '/file/upload/cropper_image/', {
            "token": getCookie("token"),
            "cropper_image": image_cut_data_data.toString()
        }, function (result) {
            if (result == "error") {
                alert("修改失败！");
            } else if (result == "notlogin") {
                alert("上传头像请先登录！");
            } else if (result == "ntosuport") {
                alert("文件格式不支持！");

            } else if (result == "not_data") {
                layer.msg("裁剪出错请重新裁剪！");
            } else {
                insertImage(result);
                //自定义图片缩放
                $(".resume_image").resizable();
            }
            //resizableResumeImageV4();
            $(".resume_image .ui-wrapper,.resume_image .ui-wrapper img").css('height', '200px');
            $('#setCustomerImageModal').modal("hide");
            $("#upload_image_submit_v4").prop("disabled", false);
            $(".zx-loading").hide();
        });
//		//图片上传
//	  	$.ajaxFileUpload({
//	  		type : 'post',
//	  		secureuri : false,
//	  		dataType : 'content',
//	  		fileElementId : 'imagefile_v4',
//	  		url : wbdcnf.base + '/file/uploadeditimage/',
//	  		data : {"token" : getCookie("token")},
//	  		success : function(data, status) {
//	  			if(data == "error") {
//	  				alert("修改失败！");
//	  			} else if(data == "notlogin") {
//	  				alert("上传头像请先登录！");
//	  	    	} else if(data == "ntosuport") {
//	  	    		alert("文件格式不支持！");
//	  	    	} else {
//	  	    		//裁剪
//	  				var image_cut_data=$image.cropper("getData");
//	  				console.log(image_cut_data);
//	  				image_cut_data.x= parseInt(image_cut_data.x);
//	  				image_cut_data.y= parseInt(image_cut_data.y);
//	  				image_cut_data.width= parseInt(image_cut_data.width);
//	  				image_cut_data.height= parseInt(image_cut_data.height);
//
//	  				var org_image_message=$image.cropper("getImageData");
//	    			org_image_message.naturalWidth= parseInt(org_image_message.naturalWidth);
//	    			org_image_message.naturalHeight= parseInt(org_image_message.naturalHeight);
//	  				console.log(org_image_message);
//	  				$.post(wbdcnf.base + "/file/cuteditimage/", {x1 : image_cut_data.x, y1 : image_cut_data.y, width : image_cut_data.width, height : image_cut_data.height, originalw : org_image_message.naturalWidth}, function(data){
//	  					if(data == "error") {
//	  						alert("修改失败！");
//	  					} else if(data == "fileerror") {
//	  						alert("图片文件错误，请重写选择图片！");
//	  					} else if(data == "notlogin") {
//	  						alert("上传头像请先登录！");
//	  					} else if(data == "notfoundfile") {
//	  						alert("文件不存在！");
//	  					} else {
//	  						insertImage(data);
//	  					}
//	  					$('#setCustomerImageModal').modal("hide");
//	  					cut_custome_image_v4();//重新还原裁剪设置
//	  					$(".cut_out_custome_img").find("div").remove();//移除预览
//	    				$("#setCustomerImageModal .img-preview-custome").removeAttr("style").find("img").remove();
//	  				});
//	  	    	}
//	  		},
//	  		error: function (data, status, e) {
//	  			alert("发生错误" + e);
//	  		}
//	  	});
    });
};
/**
 * 裁剪上传的图片----v4
 */
function cut_custome_image_v4() {
    var $image = $('.cut_out_custome_img>img'),
        $dataX = $('#dataX'),
        $dataY = $('#dataY'),
        $dataHeight = $('#dataHeight'),
        $dataWidth = $('#dataWidth'),
        $dataRotate = $('#dataRotate'),
        options = {
            //aspectRatio: 2 / 3,
            preview: '.img-preview-custome',
            crop: function (data) {
                $dataX.val(Math.round(data.x));
                $dataY.val(Math.round(data.y));
                $dataHeight.val(Math.round(data.height));
                $dataWidth.val(Math.round(data.width));
                $dataRotate.val(Math.round(data.rotate));
            }
        };
    $image.on({
        'build.cropper': function (e) {
            console.log(e.type);
        },
        'built.cropper': function (e) {
            console.log(e.type);
        },
        'dragstart.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'dragmove.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'dragend.cropper': function (e) {
            console.log(e.type, e.dragType);
        },
        'zoomin.cropper': function (e) {
            console.log(e.type);
        },
        'zoomout.cropper': function (e) {
            console.log(e.type);
        }
    }).cropper(options);

    // Methods
    $(document.body).on('click', '.customer_image span[data-method]', function () {//选择器方法
        var data = $(this).data(),
            $target,
            result;
        if (data.method) {
            data = $.extend({}, data); // Clone a new one

            if (typeof data.target !== 'undefined') {
                $target = $(data.target);

                if (typeof data.option === 'undefined') {
                    try {
                        data.option = JSON.parse($target.val());
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            }

            result = $image.cropper(data.method, data.option);

            if (data.method === 'getCroppedCanvas') {
                $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
            }

            if ($.isPlainObject(result) && $target) {
                try {
                    $target.val(JSON.stringify(result));
                } catch (e) {
                    console.log(e.message);
                }
            }

        }
    });
    // Import image
    var $inputImage = $('#imagefile_v4'),
        URL = window.URL || window.webkitURL,
        blobURL;

    if (URL) {
        $inputImage.change(function () {
            var files = this.files,
                file;

            if (files && files.length) {
                file = files[0];
                console.log(file.type);
                if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                        URL.revokeObjectURL(blobURL); // Revoke when load complete
                    }).cropper('reset', true).cropper('replace', blobURL);
                } else {
                    alert('只能传JPG和PNG的图片格式');
                }
            }
        });
    } else {
        $inputImage.parent().remove();
    }
    // Options
    $('.docs-options :checkbox').on('change', function () {
        var $this = $(this);

        options[$this.val()] = $this.prop('checked');
        $image.cropper('destroy').cropper(options);
    });
    $(".setAspectRatio span").click(function () {
        $(this).addClass("checked").siblings().removeClass("checked");
    });
}
function cutImage(src) {
    $("#image_area .image_image img").attr("src", src).load(function () {
        $("#image_view img").attr("src", src);
        var rw = $(this).width();
        var rh = $(this).height();
        var bx1 = 0;
        var by1 = 0;
        var bx2 = rw;
        var by2 = rh;
        image_image = $(this).imgAreaSelect({
            maxWidth: 300,
            maxHeight: 300,
            handles: true,
            show: true,
            x1: bx1,
            y1: by1,
            x2: bx2,
            y2: by2,
            onInit: function (img, selection) {
                image_cut_message.x = selection.x1;
                image_cut_message.y = selection.y1;
                image_cut_message.width = selection.width;
                image_cut_message.height = selection.height;
                image_cut_message.originalw = rw;
                $("#image_view .viewImg").css({
                    width: selection.width + 'px',
                    height: selection.height + 'px'
                });
                $("#image_view img").css({
                    width: rw + 'px',
                    height: rh + 'px',
                    marginLeft: '-' + selection.x1 + 'px',
                    marginTop: '-' + selection.y1 + 'px'
                });
            },
            onSelectChange: function (img, selection) {
                image_cut_message.x = selection.x1;
                image_cut_message.y = selection.y1;
                image_cut_message.width = selection.width;
                image_cut_message.height = selection.height;
                image_cut_message.originalw = rw;
                $("#image_view .viewImg").css({
                    width: selection.width + 'px',
                    height: selection.height + 'px'
                });
                $("#image_view img").css({
                    width: rw + 'px',
                    height: rh + 'px',
                    marginLeft: '-' + selection.x1 + 'px',
                    marginTop: '-' + selection.y1 + 'px'
                });
            }
        });
        $(this).unbind("load");
    });
}
function closeCutImage() {
    if (image_image)
        image_image.imgAreaSelect({remove: true});
}

/**
 * 头像处理
 */
function resumeHead() {
    // 上传文件
    $("#headfile").live("change", function () {
        var name = $(this).val();
        var fileName = name.substring(name.lastIndexOf("\\") + 1);
        var fileType = name.substring(name.lastIndexOf(".") + 1);
        if (fileType.toLocaleLowerCase() != "jpg" && fileType.toLocaleLowerCase() != "png") {
            alert("只支持jpg，png文件格式！");
            return;
        }
        if (!checkSize($(this)[0], true, 2))
            return;
        $("#head_area .head_notice").hide();
        $("#head_area .head_image").show();
        $(".picModal .picUpload").css("background", "#F0F0F0 url(" + wbdcnf.staticUrl + "/resources/500d/editresume/images/loading.gif) no-repeat center 60px");
        $.ajaxFileUpload({
            type: 'post',
            secureuri: false,
            dataType: 'content',
            fileElementId: 'headfile',
            url: wbdcnf.base + '/file/uploadedithead/',
            data: {"token": getCookie("token")},
            success: function (data, status) {
                if (data == "error") {
                    alert("修改失败！");
                } else if (data == "notlogin") {
                    alert("上传头像请先登录！");
                } else if (data == "ntosuport") {
                    alert("文件格式不支持！");
                } else {
                    if ($.browser.msie) {
                        if (data.indexOf('<PRE>') >= 0) {
                            data = data.substring(5);
                            data = data.substring(0, data.length - 6);
                        }
                    }
                    cutHead(wbdcnf.staticUrl + data);
                }
            },
            error: function (data, status, e) {
                alert("发生错误" + e);
            }
        });
    });

    $(".head_image_cut").click(function () {
        $.post(wbdcnf.base + "/file/cutedithead/", {
            x1: head_cut_message.x,
            y1: head_cut_message.y,
            width: head_cut_message.width,
            height: head_cut_message.height,
            originalw: head_cut_message.originalw,
            cutwidth: head_message.width,
            cutheight: head_message.height,
            square: head_message.square
        }, function (data) {
            if (data == "error") {
                alert("修改失败！");
            } else if (data == "fileerror") {
                alert("图片文件错误，请重写选择图片！");
            } else if (data == "notlogin") {
                alert("上传头像请先登录！");
            } else if (data == "notfoundfile") {
                alert("文件不存在！");
            } else {
                $("#resume_head .resume_head").attr("src", data);
                closeCutHead();
            }
            $('#myModalHead').modal("hide");
        });
    });
}
//头像剪切
var head_image = null; // 剪切头像对象
// 头像剪切的参数
var head_cut_message = {
    x: null,
    y: null,
    whdth: null,
    height: null,
    originalw: null
}
// 头像的属性
var head_message = {
    width: 120,
    height: 160,
    square: true
}
/**
 * 设置头像
 * @param square 正方形
 * @param radius
 */
function setSquare(square, radius) {
    if (square) {
        head_message.square = true;
        if (radius)
            $("#head_view .viewImg").css({"height": "120px", "border-radius": "50%"});
        else
            $("#head_view .viewImg").css({"height": "120px"});
    } else {
        head_message.square = false;
    }
}
function getCutPos(width, height) {
    var x1, y1, x2, y2;
    if (width / height > head_message.width / head_message.height) {
        var rwidth = Math.floor(height * head_message.width / head_message.height);
        var rheight = height;
        x1 = (width - rwidth) / 2;
        y1 = 0;
        x2 = x1 + rwidth;
        y2 = height;
    } else {
        var rwidth = width;
        var rheight = Math.floor(width * head_message.height / head_message.width);
        x1 = 0;
        y1 = (height - rheight) / 2;
        x2 = width;
        y2 = y1 + rheight;
    }
    return {"x1": x1, "y1": y1, "x2": x2, "y2": y2};
}
function cutHead(src) {
    $("#head_area .head_image img").attr("src", src).load(function () {
        $("#head_view img").attr("src", src);
        var rw = $(this).width();
        var rh = $(this).height();
        // 使用规定比例截取
//		var bx1 = (rw - head_message.width) / 2;
//		var by1 = (rh - head_message.height) / 2;
//		var bx2 = bx1 + head_message.width;
//		var by2 = by1 + head_message.height;
        // 默认最大图片截取
        var cutpos = getCutPos(rw, rh);
        var bx1 = cutpos.x1;
        var by1 = cutpos.y1;
        var bx2 = cutpos.x2;
        var by2 = cutpos.y2;
        head_image = $(this).imgAreaSelect({
            maxWidth: 300,
            maxHeight: 300,
            handles: true,
            show: true,
            x1: bx1,
            y1: by1,
            x2: bx2,
            y2: by2,
            aspectRatio: head_message.width + ":" + head_message.height,
            onInit: function (img, selection) {
                head_cut_message.x = selection.x1;
                head_cut_message.y = selection.y1;
                head_cut_message.width = selection.width;
                head_cut_message.height = selection.height;
                head_cut_message.originalw = rw;
                var scaleX = head_message.width / (selection.width || 1);
                var scaleY = head_message.height / (selection.height || 1);
                $("#head_view img").css({
                    width: Math.round(scaleX * rw) + 'px',
                    height: Math.round(scaleY * rh) + 'px',
                    marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                    marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                });
            },
            onSelectChange: function (img, selection) {
                head_cut_message.x = selection.x1;
                head_cut_message.y = selection.y1;
                head_cut_message.width = selection.width;
                head_cut_message.height = selection.height;
                head_cut_message.originalw = rw;
                var scaleX = head_message.width / (selection.width || 1);
                var scaleY = head_message.height / (selection.height || 1);
                $("#head_view img").css({
                    width: Math.round(scaleX * rw) + 'px',
                    height: Math.round(scaleY * rh) + 'px',
                    marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                    marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
                });
            }
        });
        $(this).unbind("load");
    });
}
function closeCutHead() {
    if (head_image)
        head_image.imgAreaSelect({remove: true});
}

/**
 * 隐藏模块
 */
function resumeHidden() {
    $(".resume_hidden").live("click", function (event) {
        var $hidden = $(this);
        resumeConfirm("隐藏后可在内容模块设置显示，是否隐藏？", function () {
            var forid = $hidden.attr("for-id");
            $("#" + forid).hide();
            $(".resume_module span[for-id=" + forid + "]").removeClass("checked");
            $(".resumebg").css('display', 'none');
            resumeFomart();
        }, function () {
        });
    });
}

/**
 * 删除模块
 */
function resumeDelete() {
    $(".resume_delete").live("click", function () {
        var $delete = $(this);
        resumeConfirm(null, function () {
            $delete.closest(".resume_delete_area").remove();
            resumeFomart();
        }, function () {
        });
    });
    $(".resume_custom_delete").live("click", function () {
        var $delete = $(this);
        resumeConfirm(null, function () {
            var $area = $delete.closest(".resume_custom_delete_area");
            var forkey = $area.attr("for-key");
            var moduleLi = $("#resume_module").find("span[for-id='" + forkey + "']").closest("li");
            moduleLi.remove();
            $area.remove();
            resumeFomart();
        }, function () {
        });
    });
}

/**
 * 添加模块
 */
function resumeAddResumeItems() {
    $(".resume_add").live("click", function () {
        var $this = $(this);
        var $addArea = $this.closest(".resume_add_area");
        var $appendArea = $addArea.find(".resume_append_area");
        if (!$appendArea || $appendArea.length == 0)
            $appendArea = $addArea;
        var forkey = $this.attr("for-key");
        var html = "";
        if (forkey == "resume_msg")
            html = addMessage.get_resume_msg();
        else if (forkey == "resume_graph")
            html = addMessage.get_resume_graph();
        else if (forkey == "resume_icon")
            html = addMessage.get_resume_icon();
        else if (forkey == "resume_item")
            html = addMessage.get_resume_item();
        if (html && html.length > 0) {
            $appendArea.append(html);
            resumeFomart();
        }
    });
}

/**
 * 获取保存的信息
 */
function getResume() {
    var resume = {};
    var resume_title_value = $("#resumeTitle").val();
    if (resume_title_value == null || resume_title_value == "") {
        resume_title_value = $("#resumeTitle").attr("data_value");
    }
    resume["resumeTitle"] = resume_title_value;
    if (resumeType == "resume") {
        getResumeMsg(resume);
        getResumeHead(resume);
        getResumeItem(resume);
        getResumeIcon(resume);
        getResumeGraph(resume);
        getResumeCustom(resume);
        getResumeShow(resume);
        getResumeStyle(resume);
        getResumeIconDiy(resume);
        getResumeLine(resume);
        getResumeSort(resume);
        getResumeLanguage(resume);
        getResumeImage(resume);
        getResumeTextarea(resume);
        getResumeTitleName(resume);
    } else if (resumeType == "cover") {
        getResumeMsg(resume);
        getResumeStyle(resume);
        getResumeImage(resume);
        getResumeIconDiy(resume);
        getResumeTextarea(resume);
    } else if (resumeType == "letter") {
        getResumeStyle(resume);
        getResumeImage(resume);
        getResumeLetter(resume);
        getResumeTextarea(resume);
    }
//	console.log(JSON.stringify(resume));
    return resume;
}

/**
 * 获取自荐信内容
 */
function getResumeLetter(resume) {
    resume["letter"] = clearText($("#letter").html());
}
/**
 * 获取resume_msg信息，for-key：属性名称；for-value：获取值得属性，没有默认取falue
 */
function getResumeHead(resume) {
    var resumeHead = $(".resume_head");
    if (resumeHead && resumeHead.length > 0)
        resume["head"] = resumeHead.eq(0).attr("src");
}
/**
 * 获取标题名称
 */
function getResumeTitleName(resume) {
    var resume_tilte_name = {};
    $(".resume_tilte_name").each(function (index, ele) {
        ele = $(ele);
        var key = ele.attr("for-key");
        var forvalue = ele.attr("for-value");
        var value = "";
        if (forvalue && forvalue == "html")
            value = clearText(ele.html());
        else
            value = ele.val();
        resume_tilte_name[key] = value;
    });
    //console.log(resume_tilte_name);
    resume["resume_tilte_name"] = resume_tilte_name;
}
/**
 * 获取基本信息
 */
function getResumeMsg(resume) {
    var messages = {};
    $(".resume_msg").each(function (index, ele) {
        ele = $(ele);
        var key = ele.attr("for-key");
        var fortype = ele.attr("for-type");
        var forvalue = ele.attr("for-value");
        if (fortype && fortype == "custom") { // 自定义
            var value = "";
            if (forvalue && forvalue == "html")
                value = clearText(ele.html());
            else
                value = ele.val();
            validate_modul_size("基本信息自定义项", value, 300);
            messages[key] = value;
        } else { // 基本属性
            var value = "";
            if (forvalue && forvalue == "html")
                value = clearText(ele.html());
            else
                value = ele.val();
            validate_modul_size("基本信息" + key, value, 300);
            resume[key] = value;
        }
    });
    //console.log(resume);
    resume["messages"] = messages;
}
/**
 * 获取自定义
 */
function getResumeCustom(resume) {
    var customs = new Array();
    $(".resume_custom").each(function (index, ele) {
        var custom = {};
        ele = $(ele);
        custom["id"] = ele.attr("id");
        custom["name"] = clearText(ele.find(".resume_name").html());
        var eles = ele.find(".resume_item_items");
        var modul_name = clearAllHtmlText(ele.find(".resume_name").html());
        if (eles && eles.length == 0) { // 单项值
            custom["value"] = clearText(ele.find(".resume_value").html());
            custom["time"] = clearText(ele.find(".resume_time").html());
            custom["unit"] = clearText(ele.find(".resume_unit").html());
            custom["job"] = clearText(ele.find(".resume_job").html());
            validate_modul_size(modul_name, custom);
            customs[index] = custom;
        } else { // 多项值
            var customItems = new Array();
            eles.each(function (j, ele_item) {
                var customItem = {};
                ele_item = $(ele_item);
                customItem["value"] = clearText(ele_item.find(".resume_value").html());
                customItem["time"] = clearText(ele_item.find(".resume_time").html());
                customItem["unit"] = clearText(ele_item.find(".resume_unit").html());
                customItem["job"] = clearText(ele_item.find(".resume_job").html());
                customItems[j] = customItem;
            });
            custom["values"] = customItems;
            validate_modul_size(modul_name, customItems);
            customs[index] = custom;
        }
    });
    //console.log(customs);
    resume["customs"] = customs;
}
/**
 * 获取其他信息
 */
function getResumeItem(resume) {
    $(".resume_item").each(function (index, ele) {
        ele = $(ele);
        var eles = ele.find(".resume_item_items");
        //判断一下版本
        var resume_version = $("#resume_body").attr("version");
        var modul_name = "";
        if (resume_version == null || resume_version == "" || resume_version != "v4") {
            modul_name = clearAllHtmlText(ele.find(".resume_lang_" + ele.attr("for-key")).html());
        } else {
            modul_name = clearAllHtmlText(ele.find(".resume_tilte_name").html());
        }
        if (eles && eles.length == 0) { // 单项值
            var key = ele.attr("for-key");
            var value = clearText(ele.find(".resume_value").html());
            resume[key] = value;
            validate_modul_size(modul_name, value);
        } else { // 多项值
            var key = ele.attr("for-key");
            var items = new Array();
            eles.each(function (j, ele_item) {
                ele_item = $(ele_item);
                var item = {};
                item["value"] = clearText(ele_item.find(".resume_value").html());
                item["time"] = clearText(ele_item.find(".resume_time").html());
                item["unit"] = clearText(ele_item.find(".resume_unit").html());
                item["job"] = clearText(ele_item.find(".resume_job").html());
                items[j] = item;
            });
            validate_modul_size(modul_name, items);
            resume[key] = items;
        }
    });
}
/**
 * 获取图表
 */
function getResumeGraph(resume) {
    var graphs = new Array();
    $(".resume_graph .resume_graph_item").each(function (index, ele) {
        ele = $(ele);
        var graph = {};
        var $value = ele.find(".resume_value");
        var forkey = $value.attr("for-key");
        var forvalue = $value.attr("for-value");
        var value = "";
        if (forvalue && forvalue == "html")
            graph[forkey] = clearText($value.html());
        else
            graph[forkey] = $value.val();
        graphs[index] = graph;
    });
    resume["graphs"] = graphs;
}
/**
 * 获取图标
 */
function getResumeIcon(resume) {
    var icons = new Array();
    $(".resume_icon .resume_icon_item").each(function (index, ele) {
        ele = $(ele);
        var icon = {};
        var $value = ele.find(".resume_value");
        var forkey = $value.attr("for-key");
        var forvalue = $value.attr("for-value");
        if (forvalue && forvalue == "html")
            icon[forkey] = clearText($value.html());
        else
            icon[forkey] = $value.val();
        icons[index] = icon;
    });
    resume["icons"] = icons;
}
/**
 * 自定义图标
 */
function getResumeIconDiy(resume) {
    var iconDiy = {};
    $(".resume_icon_diy").each(function (index, ele) {
        ele = $(ele);
        var content = ele.text();
        var forid = ele.attr("for-id");
        var size = ele.css("fontSize");
        size = "none";
        iconDiy[forid] = [content, size];
    });
    resume["iconDiy"] = iconDiy;
}
/**
 * 线条工具
 */
function getResumeLine(resume) {
    var lines = {};
    $(".resume_line").each(function (index, ele) {
        ele = $(ele);
        var forid = ele.attr("for-id");
        var width = ele.css("width");
        var style = ele.css("border-top-style");
        var bwidth = ele.css("border-top-width");
        lines[forid] = [width, style, bwidth];
    });
    resume["lines"] = lines;
}
/**
 * 语言
 */
function getResumeLanguage(resume) {
    var language = "zh";
    var tmp = $(".resume_language:checked").val();
    if (tmp && tmp != "") {
        language = tmp;
    } else {
        tmp = $("#hidden_data_resume_language").val();//v4版本
        if (tmp && tmp != "") {
            language = tmp;
        }
    }
    resume["language"] = language;
}
/**
 * 获取图片
 */
function getResumeImage(resume) {
    var images = new Array();
    $(".resume_image").each(function (index, ele) {
        ele = $(ele);
        images[images.length] = ele.prop("outerHTML");
    });
    resume["images"] = images;
}
/**
 * 获取文本框
 */
function getResumeTextarea(resume) {
    var textareas = new Array();
    $(".resume_textarea").each(function (index, ele) {
        ele = $(ele);
        var el = ele.clone() //克隆对象，然后对其进行操作，为了不影响真实环境的显示
        if ($(el).hasClass("show")) {
            $(el).removeClass("show");

        }
        // ele.find("textarea").text(ele.find("textarea").val()); // 使用textarea实现时，这样才能获取到文本内容
        textareas[textareas.length] = el.prop("outerHTML");
    });
    resume["textareas"] = textareas;
}
/**
 * 排序
 */
function getResumeSort(resume) {
    var sort = {};
    var foos = [];
    var bars = [];
    $("#foo .resume_sort").each(function (index, ele) {
        ele = $(ele);
        var id = ele.attr("id");
        foos[foos.length] = id;
    });
    $("#bar .resume_sort").each(function (index, ele) {
        ele = $(ele);
        var id = ele.attr("id");
        bars[bars.length] = id;
    });
    sort["foos"] = foos;
    sort["bars"] = bars;
    resume["sort"] = sort;
}
/**
 * 获取模块显示隐藏状态
 */
function getResumeShow(resume) {
    var shows = {};
    $(".resume_module span").each(function (index, ele) {
        ele = $(ele);
        shows[ele.attr("for-id")] = ele.hasClass("checked");
    });
    resume["shows"] = shows;
}
/**
 * 获取主题
 */
function getResumeStyle(resume) {
    resume["them"] = defaultStyle;
}

/**
 * 获取唯一标识
 */
function uuid() {
    var uuid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        uuid += n;
        if (i == 8 || i == 12 || i == 16 || i == 20)
            uuid += "";
    }
    return uuid;
}

/**
 * 排序
 * 注：导出的JS
 */
function resumeModuleSort(sort) {
    if (sort) {
        var foos = sort["foos"];
        var bars = sort["bars"];
        if (foos) {
            foos.reverse();
            var fooSort = $("#foo_sort");
            if (fooSort && fooSort.length == 1 && foos.length > 0) {
                for (var index in foos) {
                    var id = foos[index];
                    var sortObj = $("#" + id);
                    if (sortObj.parents("#foo").length > 0)
                        fooSort.after(sortObj);
                }
            }
        }
        if (bars) {
            bars.reverse();
            var barSort = $("#bar_sort");
            if (barSort && barSort.length == 1 && bars.length > 0) {
                for (var index in bars) {
                    var id = bars[index];
                    var sortObj = $("#" + id);
                    if (sortObj.parent("#bar").length > 0)
                        barSort.after(sortObj);
                }
            }
        }
    }
}

/**
 * 离开时间
 * save_status:true:保存
 * save_status:false:编辑后未保存
 */
var save_trigger = true; // 状态
function saveNotice(save_status) {
    if (save_status == undefined)
        save_status = false;
    if (save_trigger != save_status) {
        save_trigger = save_status;
        if (save_status)
            $(window).unbind("beforeunload", not_save_notice);
        else
            $(window).bind("beforeunload", not_save_notice);
    }
}
// 未保存设置
function not_save_notice(event) {
    return "你有修改内容没有保存，确定要离开吗？";
}

var dragObject = false;
var insertImageDiv = '<div style="border-style:solid;border-width:0px;" class="resume_image resume_drag"><span class="resume_drag_move"></span><span class="resume_drag_delete"></span><img class="cumstomer_resume_image" src="" /></div>';
var insertTextareaDiv = '<div style="border:1px solid #ccc;" class="resume_textarea resume_drag"><span class="resume_drag_move"></span><span class="resume_drag_delete"></span><div class="textarea" contenteditable="true"></div></div>';
/**
 * 插入图片
 */
function insertImage(src) {
    if (nowImage) {
        nowImage.find("img").attr("src", src);
    } else {
        var $image = $(insertImageDiv);
        $image.find("img").attr("src", src);
        $("#resume_body").append($image);
    }
}
/**
 * 插入文本框
 */
function insertTextarea(content) {
    if (nowTextarea) {
        nowTextarea.find("div.textarea").text(content);
    } else {
        var $textarea = $(insertTextareaDiv);
        $textarea.find("div.textarea").text(content);
        $("#resume_body").append($textarea);
    }
}
/***
 * 拖动
 */
var Dragging = function (validateHandler) { // 参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
    var diffX = 0;
    var diffY = 0;
    var draggingObj = null; // dragging Dialog

    function mouseHandler(e) {
        switch (e.type) {
            case 'mousedown':
                draggingObj = validateHandler(e);//验证是否为可点击移动区域
                if (draggingObj != null) {
                    diffX = e.clientX - draggingObj.offsetLeft;
                    diffY = e.clientY - draggingObj.offsetTop;
                }
                break;

            case 'mousemove':
                if (draggingObj) {
                    var left = e.clientX - diffX;
                    var top = e.clientY - diffY;
                    var bodyWidth = $("#resume_body").width();
                    var bodyHeight = $("#resume_body").outerHeight();
                    var objectWidth = $(draggingObj).outerWidth(true);
                    var objectHeight = $(draggingObj).outerHeight(true);
                    if (left < 0)
                        left = 0;
                    if (top < 0)
                        top = 0;
                    if (left + objectWidth > bodyWidth)
                        left = bodyWidth - objectWidth;
                    if (top + objectHeight > bodyHeight)
                        top = bodyHeight - objectHeight;
                    draggingObj.style.left = left + 'px';
                    draggingObj.style.top = top + 'px';
                }
                break;

            case 'mouseup':
                draggingObj = null;
                diffX = 0;
                diffY = 0;
                dragObject = false;
                break;
        }
    }

    return {
        enable: function () {
            document.addEventListener('mousedown', mouseHandler);
            document.addEventListener('mousemove', mouseHandler);
            document.addEventListener('mouseup', mouseHandler);
        },
        disable: function () {
            document.removeEventListener('mousedown', mouseHandler);
            document.removeEventListener('mousemove', mouseHandler);
            document.removeEventListener('mouseup', mouseHandler);
        }
    }
}
function getDraggingDialog(e) {
    var target = e.target;
    while (target && target.className.indexOf('resume_drag') == -1) {
        target = target.offsetParent;
    }
    if (target != null) {
        if (target.className.indexOf('resume_image') >= 0) {
            dragObject = true;
            return target;
        }
        if (target.className.indexOf('resume_drag_move') >= 0) {
            dragObject = true;
            return target.offsetParent;
        }
        return null;
    } else {
        return null;
    }
}

/**
 * 拖动
 */
function resumeDrag() {
    $(".resume_drag_delete").live("click", function () {
        var $delete = $(this);
        resumeConfirm(null, function () {
            $delete.closest(".resume_drag").remove();
        }, function () {
        });
    });
    Dragging(getDraggingDialog).enable(); // 拖动
}

/**
 * 清除一些\n\r等等
 */
function clearText(text) {
    if (!text)
        return "";
    text = text.replace(/[\n]/ig, '');
    text = text.replace(/[\r]/ig, '');
    text = text.replace(/[\t]/ig, '');
    return text;
}
/**
 * 清除所有的HTMl的标签，计算实际内容字数
 */
function clearAllHtmlText(text) {
    if (!text)
        return "";
    text = text.replace(/<[^>]+>/g, "");
    text = text.replace(/[\n]/ig, '');
    text = text.replace(/[\r]/ig, '');
    text = text.replace(/[\t]/ig, '');
    return text;
}
/**
 * 提示信息
 */
var resumeNoticeKey = null;
function resumeNotice() {
    if (!resumeNoticeContent) {
        $.ajax({
            type: "get",
            async: false,
            url: wbdcnf.base + "/editresume/resumeNotice/",
            success: function (content) {
                resumeNoticeContent = JSON.parse(content);
            }
        });
    }

    //小贴士提示框
    $(".tipsModal .close").click(function () {
        if (localStorage && resumeNoticeKey != null) {
            var jsonObject = null;
            var noticeJson = localStorage.getItem("resume_notice_disable");
            if (!noticeJson || noticeJson == "")
                jsonObject = new Array();
            else {
                try {
                    jsonObject = JSON.parse(noticeJson);
                } catch (e) {
                    jsonObject = new Array();
                }
            }
            jsonObject[jsonObject.length] = resumeNoticeKey;
            localStorage.setItem("resume_notice_disable", JSON.stringify(jsonObject));
        }
        $(".tipsModal").animate({left: "-200px"}, 200);
    });
    $(".resume_notice").focusin(function () {
        var key = $(this).attr("notice-key");
        resumeNoticeKey = key;
        var content = resumeNoticeContent[key];
        if (content) {
            $("#resume_notice_title").html(content.title);
            $("#resume_notice_value").html(content.value);
            var disable = false;
            if (localStorage) {
                var noticeJson = localStorage.getItem("resume_notice_disable");
                if (noticeJson && noticeJson != "") {
                    try {
                        var jsonObject = JSON.parse(noticeJson);
                        if (jsonObject.indexOf(key) >= 0)
                            disable = true;
                    } catch (e) {
                    }
                }
            }
            if (!disable)
                $(".tipsModal").animate({left: "-5px"}, 800);
            else
                $(".tipsModal").animate({left: "-200px"}, 200);
        } else {
            $(".tipsModal").animate({left: "-200px"}, 200);
        }
    });
}

/**
 * 清除空白符
 */
function clearBlank(text) {
    if (!text)
        return "";
    text = text.replace(/(^\s+)|(\s+$)/ig, '');
    return text;
}

$(function () {
    var baseHeight = $(".baseditBar").height();
    if (baseHeight >= 146) {
        $(".mubaninfoBar").css('margin-top', '228px');
    }
});
/**
 * 检验每个单独的模板的字数是否超过三千
 */
function validate_modul_size(modul_name, modul_content, max_size) {
    if (modul_content == null || modul_content == "") {
        return 1;
    }
    var data_resume_language = $("#hidden_data_resume_language").val();
    var modul_max_size = 3000;
    //英文简历最多6000个
    if (data_resume_language != null && data_resume_language != "" && data_resume_language == "en") {
        modul_max_size = 6000;
    }
    if (max_size != null && max_size > 0) {
        modul_max_size = max_size;
    }
    //转换成字符串
    var modul_content_string = JSON.stringify(modul_content);
    //去空格字符
    modul_content_string = clearBlank(modul_content_string);
    //去除HTML标签
    modul_content_string = clearAllHtmlText(modul_content_string);
    if (modul_content_string == null || modul_content_string == "") {
        return 1;
    }
    if (modul_content_string.length >= modul_max_size) {
        validate_modul_error_message.flag = 0;
        validate_modul_error_message.message = modul_name + "模块不能超过" + modul_max_size + "字" + ",现已超过" + (modul_content_string.length - modul_max_size) + "字,请删掉一些内容后尝试保存";
        return 0;
    } else {
        return 1;
    }
}