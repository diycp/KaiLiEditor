$(document).ready(function () {

    //导入文件
    $("#filename").live("change", function () {
        // 检查文件是否选择:
        var name = $("#filename").val();
        if (!name) {
            layer.msg("没有选择文件!");
            return;
        }

        $(".div_upload").find("p").text(name);
        var fileName = name.substring(name.lastIndexOf("\\") + 1);
        var fileType = name.substring(name.lastIndexOf(".") + 1);
        $("#fileName").val(fileName);
        if (fileType.toLocaleLowerCase() != "xml") {
            layer.msg("只支持xml文件格式！");
            return;
        }

        var file = $("#filename").get(0).files[0];
        // console.log(file.val());
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = readXmlByJs;
            //隐藏导入文件提示框
            $('#imResumeModal').modal('hide');
        } else {
            alert("没有选择文件");
        }
    });

    function readXmlByJs(evt) {
        var xmlDoc;
        if (window.DOMParser) { // Firefox, Chrome, Opera, etc.
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
        }
        else { // Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(evt.target.result);
        }

        //相当于用二维数组保存所有标签
        var nodes = xmlDoc.documentElement.childNodes;
        //根据标签名取值
        $(".caption1").get(0).innerHTML = nodes[1].getElementsByTagName("CAP1")[0].textContent;
        $(".caption2").get(0).innerHTML = nodes[1].getElementsByTagName("CAP2")[0].textContent;

        $("#model").get(0).innerHTML = nodes[1].getElementsByTagName("MODEL")[0].textContent;
        $("#checkId").get(0).innerHTML = nodes[1].getElementsByTagName("CHECKID")[0].textContent;

        $(".item1").get(0).innerHTML = nodes[1].getElementsByTagName("ITEM1")[0].textContent;
        $(".item1").get(1).innerHTML = nodes[1].getElementsByTagName("ITEM1")[1].textContent;
        $(".item1").get(2).innerHTML = nodes[1].getElementsByTagName("ITEM1")[2].textContent;
        $(".item2").get(0).innerHTML = nodes[1].getElementsByTagName("ITEM2")[0].textContent;
        $(".item2").get(1).innerHTML = nodes[1].getElementsByTagName("ITEM2")[1].textContent;
        $(".item2").get(2).innerHTML = nodes[1].getElementsByTagName("ITEM2")[2].textContent;


        $(".img1").get(0).setAttribute('src', nodes[1].getElementsByTagName("IMG1")[0].textContent);
        $(".img1").get(1).setAttribute('src', nodes[1].getElementsByTagName("IMG1")[1].textContent);
        $(".img1").get(2).setAttribute('src', nodes[1].getElementsByTagName("IMG1")[2].textContent);
        $(".img1").get(3).setAttribute('src', nodes[1].getElementsByTagName("IMG1")[3].textContent);
        $(".img1").get(4).setAttribute('src', nodes[1].getElementsByTagName("IMG1")[4].textContent);

        $(".img2").get(0).setAttribute('src', nodes[1].getElementsByTagName("IMG2")[0].textContent);
        $(".img2").get(1).setAttribute('src', nodes[1].getElementsByTagName("IMG2")[1].textContent);
        $(".img2").get(2).setAttribute('src', nodes[1].getElementsByTagName("IMG2")[2].textContent);
        $(".img2").get(3).setAttribute('src', nodes[1].getElementsByTagName("IMG2")[3].textContent);
        $(".img2").get(4).setAttribute('src', nodes[1].getElementsByTagName("IMG2")[4].textContent);

        $(".see").get(0).innerHTML = nodes[1].getElementsByTagName("SEE")[0].textContent;
        $(".conclusion").get(0).innerHTML = nodes[1].getElementsByTagName("CONCLUSION")[0].textContent;
        $(".suggestion").get(0).innerHTML = nodes[1].getElementsByTagName("SUGGESTION")[0].textContent;
        $(".biopsy").get(0).innerHTML = nodes[1].getElementsByTagName("BIOPSY")[0].textContent;
    }

    //交互样式
    function resumeDelete() {
        $(".baseDel .delete").live("mouseover", function () {
            $(this).parents(".baseDel").css({'opacity': '0.5'});
            $(this).css('opacity', '1');
        });
        $(".baseDel .delete").live("mouseout", function () {
            $(this).parents(".baseDel").css({'opacity': '1'});
        });
    }

    resumeDelete();
    //弹框调用
    function promptM() {
        $('#saveModal,#resume_import_tips').modal('hide');
    }

    //setInterval(promptM,3000);
    function resumeModal() {
        $(".saveBtn").click(function () {
            resumeSave();
            $('#saveModal').modal('show');
            setTimeout(promptM, 500);
        });
        //$(".delBtn,.hover-div .delete").click(function(){
        //	$('#delModal').modal('show');
        //});
        $(".imResumeBtn").click(function () {
            $('#imResumeModal').modal('show');
        });
        $(".setResumeBtn").click(function () {
            $('#setResumeModal').modal('show');
            //复制功能
            $('.copy_url_btn').zclip({
                path: '/resources/500d/js/zclip/ZeroClipboard.swf',
                copy: function () {//复制内容
                    var copy_url = "http://www.500d.me/resume/" + $("#visitid").val() + "/"
                    return copy_url;
                },
                afterCopy: function () {//复制成功
                    var url_visitid = $("#visitid").val();
                    if (url_visitid == null || url_visitid == "") {
                        layer.msg("请先设置个性域名");
                    } else {
                        layer.msg("复制成功");
                    }

                }
            });
        });
        $(".setHeadBtn").click(function () {
            resumeSave();
            resumeImage();
            $('#setHeadModal').modal('show');
        });
        $(".setImageBtn").click(function () {
            $('#setCustomerImageModal').modal('show');
        });
        $(".setIconBtn").click(function () {
            $('#setIconModal').modal('show');
        });

        $(".addBtn,.wbd-addBtn").click(function () {
            $('#myModalnrmk').modal('show');
            $('#myModalnrmk').find(".resume_name").removeAttr("style");//移除必填样式
        });
        $('#myModalnrmk input.resume_name').change(function () {
            $('#myModalnrmk').find(".resume_name").removeAttr("style");//移除必填样式
        });
        $("#closeBtn").click(function () {
            $(".vipModal").stop().slideUp(300);
        });
        $("#changeBtn").click(function () {
//			layer.msg("正在研发中  敬请期待");
            $(".changeModal").stop().fadeIn(300);
            var display = $('.changeModal').css('display');
            if (display == 'none') {
                $("html").css('overflow', 'auto');
            } else {
                $("html").css('overflow', 'hidden');
            }
            $(".gotopShow").removeAttr("style");
        });
        //更换模板
        $(".uResumeBtn").click(function () {
            $(".changeModal").stop().fadeIn(300);
            var display = $('.changeModal').css('display');
            if (display == 'none') {
                $("html").css('overflow', 'auto');
            } else {
                $("html").css('overflow', 'hidden');
            }
            $(".gotopShow").removeAttr("style");
        });
        $("#changecloseBtn").click(function () {
            $(".changeModal").stop().fadeOut(300);
            var display = $('.changeModal').css('display');
            if (display == 'none') {
                $("html").css('overflow', 'hidden');
            } else {
                $("html").css('overflow', 'auto');
            }
            $("#templateKeyword").val("");
            select_template_page = 1;
            reload_template_list();
            //$(".gotopShow").show();
        });

    }

    resumeModal();
    //拖动排序调用
    function resumeSort() {
        $("#foo,#bar").sortable({
            revert: true,
            items: ".baseSort",
            cursor: "move",
            opacity: 0.5,
            cancel: "div[contenteditable],dd",
            placeholder: "sortable-placeholder",
            scrollSpeed: 10
        });
    }

    resumeSort();
    //职业技能线条左右拖动
    function resumeSkilline() {
        $(".baseSkill .line i").resizable({
            containment: "parent"
        });
    }

    resumeSkilline();
    //tooltip提示
    function resumeTooltip() {
        $(document).tooltip({
            position: {
                my: "center top-40",
                at: "center top",
                using: function (position, feedback) {
                    $(this).css(position);
                    $("<div>")
                        .addClass("arrow")
                        .addClass(feedback.vertical)
                        .addClass(feedback.horizontal)
                        .appendTo(this);
                }
            },
            show: {
                effect: "Fade",
                delay: 50
            },
            hide: {
                effect: "fade",
                delay: 0,
                easing: "easeInOutQuart"
            }
        });
    }

    resumeTooltip();
    //模块添加隐藏
    function resumeSlide() {
        $(".iResumeBtn").click(function () {
            $(".insertModal").animate({left: "0px"}, 300);
            $(".resumebg1").css('background', 'transparent');
            $(".resumebg1").stop().show();
            $(".resumebg1").click(function () {
                $(".insertModal").animate({left: "-300px"}, 300);
                $(this).stop().hide();
            });
        });
        //$(".insertModal ul li").click(function(){
        //	var $this = $(this).children("span")
        //	if($this.hasClass("checked")){
        //			$this.removeClass("checked");
        //		}else{
        //			$this.addClass("checked");
        //		}
        //});
        //我的简历
        $(".uResumeBtn").click(function () {
            $(".rsuemeModal").animate({left: "0px"}, 300);
            $(".resumebg1").css('background', 'transparent');
            $(".resumebg1").stop().show();
            $(".resumebg1").click(function () {
                $(".rsuemeModal").animate({left: "-300px"}, 300);
                $(this).stop().hide();
            });
        });
    }

    resumeSlide();
    //字体工具
    function resumeEditor() {
        $(".wbd-baseStyle .baseItem  dl").live("click", function () {
            var $this = $(this).children().children(".wbd-fontBar");
            var nothis = $(".wbd-fontBar").not($this);
            $(".resumebg").stop().show();
            $(this).parents(".baseItem").addClass("selectedItem").siblings().removeClass("selectedItem");
            $this.stop().slideDown(200);
        });
        $(".resumebg").live("click", function () {
            $(this).css('display', 'none')
            $(".fontColorS").css('display', 'none');
            var $this = $('.wbd-baseStyle .baseItem dd').children(".wbd-fontBar");
            $this.stop().hide(300);
            $(".fontColorS ul li").removeClass("selected");
            $(".fontsize select option").removeClass("select");
            $this.parents(".baseItem").removeClass("selectedItem");
        });
        //字体样式
        //$("#fontcolor").bigColorpicker(function(el, color) {
        //      $(el).children('span').css("background-color", color);
        //      var sColor = color;
        //      document.execCommand("ForeColor",true,sColor);
        //  });

        $('.fontcolor .cbtn').colpick({
            layout: 'hex',
            color: 'string',
            submit: 0,
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $('.fontcolor .cbtn').css('background-color', '#' + hex);
                var scolor1 = $('.fontcolor .cbtn').css('background-color');
                document.execCommand("ForeColor", false, scolor1);
            }
        });
        $(".fontColorS ul li").live("click", function () {
            $(this).addClass("selected").siblings().removeClass("selected");
            var scolor = $(".fontColorS ul li.selected").css('background-color');
            if (!$.browser.msie) {
                scolor = scolor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }

                scolor = "#" + hex(scolor[1]) + hex(scolor[2]) + hex(scolor[3]);
            }
            document.execCommand("ForeColor", false, scolor);
        });
        $(".fontcolor,.baseItem").live("click", function () {
            if ($(this).children(".fontColorS").css("display") == "none") {
                $(this).children(".fontColorS").css('display', 'block');
            } else {
                $(this).children(".fontColorS").css('display', 'none');
            }
            $(".fontColorS ul li").removeClass("selected");
        });

        $(".colpick").live("click", function () {
            $(".fontColorS").css('display', 'block');
        });
        $(".fontsize").live("click", function () {
            if ($(this).children("select").css("display") == "none") {
                $(this).children("select").css('display', 'block');
            } else {
                $(this).children("select").css('display', 'none');
            }
        });

        $(".fontsize select option").live("click", function () {

            $(this).addClass("select").siblings().removeClass("select");
            var sfontsize = $(".fontsize select option.select").val();
            document.execCommand("FontSize", false, sfontsize);
        });

        $('.btn-group .italic').live("click", function () {
            document.execCommand("Italic", false, '');
        });
        $('.btn-group .bold').live("click", function () {
            document.execCommand('Bold', false, '');
        });
        $('.btn-group .underline').live("click", function () {
            document.execCommand('underline', false, '');
        });
        $('.btn-group .justifyleft').live("click", function () {
            document.execCommand('justifyleft', false, '');
        });
        $('.btn-group .justifycenter').live("click", function () {
            document.execCommand('justifycenter', false, '');
        });
        $('.btn-group .justifyright').live("click", function () {
            document.execCommand('justifyright');
        });
        $('.btn-group .insertunorderedlist').live("click", function () {
            document.execCommand('InsertUnorderedList');
        });
        $('.btn-group .insertorderedlist').live("click", function () {
            document.execCommand('insertorderedlist');
        });
        $('.btn-group .indent').live("click", function () {
            document.execCommand('indent');
        });
        $('.btn-group .outdent').live("click", function () {
            document.execCommand('outdent');
        });
        $('.btn-group .addLink button').live("click", function () {
            var link = $(this).siblings("input").val();
            $(".addLink").css('display', 'none');
            document.execCommand('CreateLink', 'false', link);
        });
        $(".btn-group .link").live("click", function () {
            if ($(this).siblings(".addLink").css("display") == "none") {
                $(this).siblings(".addLink").css('display', 'block');
            } else {
                $(this).siblings(".addLink").css('display', 'none');
            }
        });
        //$(".lineheight").live("click",function(e){

        //if(window.getSelection) {

        //var textObj = $("div[contenteditable]");
        //var selectedText = window.getSelection().toString();

        ////父节点的值
        //var parentStr=window.getSelection().focusNode.parentNode.innerHTML;

        //selectedText = "<span style='line-height:5.0'>"+selectedText+"</span>";


        //var start = window.getSelection().anchorOffset;
        //var end = window.getSelection().focusOffset;
        //var tempStr1 = parentStr.substring(0,start);
        //var tempStr2 = parentStr.substring(end);
        //alert("start:"+start + ",end:" + end);
        //document.getElementsByClassName("wbd-baseStyle").innerHTML = tempStr1 + selectedText + tempStr2 ;
        ////设置父节点里面的文档
        //window.getSelection().focusNode.parentNode.innerHTML = selectedText ;
        //
        //}
        //
        //
        //});
    }

    resumeEditor();
    //图片裁剪
    function resumeImage() {
        var imgae_aspectRatio = 3 / 4;
        if (head_message != null && head_message != "" && head_message.square) {//在resume.js中的设置的头像是否是圆形
            imgae_aspectRatio = 1;
            $(".head_image").find("span").removeClass("checked");
            $(".head_image").find("span[data-option='1']").addClass("checked");
        }
        var $image = $('.cut_out_img_head>img'),
            options = {
                aspectRatio: imgae_aspectRatio,
                preview: '.img-preview-head',
                crop: function (data) {
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
        $(document.body).on('click', '.head_image span[data-method]', function () {
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
//	          $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
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
        var $inputImage = $('#inputImage'),
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
                        //$inputImage.val('');
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
    };
    //图片裁剪提交
    $("#upload_image_submit").click(function () {
        var resumeId = $("#hidden_data_resume_id").val();
        if (resumeId === "" || resumeId == null || resumeId == 0) {
            layer.msg("先保存简历！");
            return false;
        }
        var $image = $('.cut_out_img_head>img');
        var $isCoopered = $(".cut_out_img_head").find("div");//判断是否有上传
        if ($isCoopered == null || $isCoopered.length == 0) {
            layer.msg("请先上传图片!");
            return;
        }
        var upload_file = document.getElementById("inputImage").files;
        if (upload_file.length > 0) {
            var upload_file_size = upload_file[0].size / 1024;
            if ((upload_file_size / 1024) > 1) {
                layer.msg("请上传小于2M的图片");
                return;
            }
        }
        $(".zx-loading").show();
        $("#upload_image_submit").prop("disabled", true);
        //图片上传---直接上传裁剪的照片
        var image_cut_data = $image.cropper("getCroppedCanvas");
        var image_cut_data_data = image_cut_data.toDataURL("image/jpeg");
        //$("#resume_head .resume_head").attr("src","");
        //把裁剪好的图片上传
        $.post(wbdcnf.base + '/file/upload/cropper_image/', {
            "resumeId": resumeId,
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
                $("#resume_head .resume_head").attr("src", result);
//				 $(".resume_head_div").append('<img class="resume_head" height="200" src="'+result+'">');
            }
            $('#setHeadModal').modal("hide");
            $("#upload_image_submit").prop("disabled", false);
            $(".zx-loading").hide();
        });
    });
    //图片上传
//		$.ajaxFileUpload({
//			type : 'post',
//			secureuri : false,
//			dataType : 'content',
//			fileElementId : 'inputImage',
//			url : wbdcnf.base + '/file/uploadedithead/',
//			data : {"token" : getCookie("token")},
//			success : function(data, status) {
//				if(data == "error") {
//					alert("修改失败！");
//				} else if(data == "notlogin") {
//					alert("上传头像请先登录！");
//	        	} else if(data == "ntosuport") {
//	        		alert("文件格式不支持！");
//	        	} else {
//	        		//裁剪
//	    			var image_cut_message=$image.cropper("getData");
//	    			image_cut_message.x= parseInt(image_cut_message.x)+1;
//	    			image_cut_message.y= parseInt(image_cut_message.y)+1;
//	    			image_cut_message.width= parseInt(image_cut_message.width)+1;
//	    			image_cut_message.height= parseInt(image_cut_message.height)+1;
//	    			var image_cut_data123 = $image.cropper("getCroppedCanvas");
//	    			console.log(image_cut_data123);
//	    			var org_image_message=$image.cropper("getImageData");
//	    			org_image_message.naturalWidth= parseInt(org_image_message.naturalWidth);
//	    			org_image_message.naturalHeight= parseInt(org_image_message.naturalHeight);
//	    			console.log(image_cut_message);
//	    			$.post(wbdcnf.base + "/file/cutedithead/", {x1 : image_cut_message.x, y1 : image_cut_message.y, width : image_cut_message.width, height : image_cut_message.height, originalw : org_image_message.naturalWidth, cutwidth : head_message.width, cutheight : org_image_message.naturalHeight, square : org_image_message.square}, function(data){ //	    				if(data == "error") {
//	    					alert("修改失败！");
//	    				} else if(data == "fileerror") {
//	    					alert("图片文件错误，请重写选择图片！");
//	    				} else if(data == "notlogin") {
//	    					alert("上传头像请先登录！");
//	    				} else if(data == "notfoundfile") {
//	    					alert("文件不存在！");
//	    				} else {
//	    					$("#resume_head img").remove();
//	    					$(".resume_head_div").append('<img class="resume_head" height="200" src="'+data+'">');
//	    				}
//	    				$('#setHeadModal').modal("hide");
//	    				resumeImage();//重新还原裁剪设置
//	    				$(".cut_out_img_head").find("div").remove();//移除预览
//	    				$("#setHeadModal .img-preview-head").removeAttr("style").find("img").remove();
//	    			});
//	        	}
//			},
//			error: function (data, status, e) {
//				alert("发生错误" + e);
//			}
//		});
//	});
    /**
     * isReloadFlag:是否是页面加载
     */
    //自定义添加文本
    function resumeText(isReloadFlag) {
        $(".text-draggable").draggable({
            handle: ".drag-text",
            containment: ".wbd-baseStyle"
        });//拖动
        $(".text-draggable div[contenteditable]").click(function () {
            $(this).parents().parents(".text-draggable").addClass("show");
            $(".resumebg").stop().show();
            $(".resumebg").css('z-index', '9995');
            $(".resumebg").click(function () {
                $(this).stop().hide();
                $(".resumebg").css('z-index', '9998');
                $(".text-draggable").removeClass("show");
            });
        });
        $(".text-draggable .resume_delete").click(function () {
            $(".resumebg").stop().hide();
        });
        //吸色工具重新绑定---colpick不支持jquery的live方法
        $('.fontcolor .cbtn').colpick({
            layout: 'hex',
            color: 'string',
            submit: 0,
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $('.fontcolor .cbtn').css('background-color', '#' + hex);
                var scolor1 = $('.fontcolor .cbtn').css('background-color');
                document.execCommand("ForeColor", true, scolor1);
            }
        });
        if (isReloadFlag != null && isReloadFlag) {
            $(".resume_textarea .ui-resizable-handle").remove();
        }
        $(".text-draggable").resizable();//缩放
        //$(".text-draggable1").resizable();//缩放

    }

    $("#intextBtn").click(function () {
        var resumeText_html = '<div class="text-draggable resume_textarea resume_delete_area" style="width:200px;height:200px">'
            + '<div  class="wbd-fontBar"><div class="inner"><div class="btn-group"><a class="abtn fontsize" href="javascript:;">字号<select multiple="multiple"><option value="1" style="font-size: 12px;">H1</option><option value="2" style="font-size: 14px;">H2</option><option value="3" style="font-size: 18px;">H3</option><option value="4" style="font-size: 24px;">H4</option><option value="5" style="font-size: 30px;">H5</option><option value="6" style="font-size: 36px;">H6</option><option value="7" style="font-size: 48px;">H7</option></select></a></div><div class="btn-group"><a class="abtn fontcolor" href="javascript:;">字体颜色<span></span><div class="fontColorS"><div><ul class="clearfix"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul><s class="cbtn">自定义</s></div></div></a></div><div class="btn-group"><a class="abtn bold"  href="javascript:;" title="加粗">加粗</a><a class="abtn italic" href="javascript:;" title="倾斜">倾斜</a><a class="abtn underline" href="javascript:;" title="下划线">下划线</a></div><div class="btn-group"><a class="abtn justifyleft" href="javascript:;" title="居左">居左</a><a class="abtn justifycenter" href="javascript:;" title="居中">居中</a><a class="abtn justifyright" href="javascript:;" title="居右">居右</a></div><div class="btn-group"><a class="abtn insertunorderedlist" href="javascript:;" title="无序列表">无序列表</a><a class="abtn insertorderedlist" href="javascript:;" title="有序列表">有序列表</a><a class="abtn indent" href="javascript:;" title="左缩进">左缩进</a><a class="abtn outdent" href="javascript:;" title="右缩进">右缩进</a></div><div class="delete wbdfot resume_delete"></div></div></div>'
            + '<div class="text-draggable1">'
            + '<div contenteditable="true"><div>自定义文本框</div></div>'
            + '</div>'
            + '<span class="drag-text">拖动我</span>'
            + '</div>';
        $('#resume_body').append(resumeText_html);
        $(".resumebg1").css('display', 'none');
        $(".insertModal").css('left', '-300px');
        $(".text-draggable1 div[contenteditable]").focus();
        resumeText(false);
    });
    resumeText(true);
    /**
     *isReloadFlag： 是否是页面加载
     */
    //自定义图片缩放
    function resumeImg(isReloadFlag) {
        if (isReloadFlag != null && isReloadFlag) {
            $(".resume_image .ui-resizable-handle").remove();
        }
        $(".resume_image").resizable({
            aspectRatio: true,
            containment: ".wbd-baseStyle"
        });//缩放
    }

    resumeImg(true);
    function mbList() {
        //列表鼠标经过效果
        $(".zx-mblist-box .list-con").each(function () {
            $(this).on('mouseenter', function (e) {
                var e = e || window.event;
                var angle = direct(e, this)
                mouseEvent(angle, this, 'in')
            })
            $(this).on('mouseleave', function (e) {
                var e = e || window.event;
                var angle = direct(e, this)
                mouseEvent(angle, this, 'off')
            })
        });
        function direct(e, o) {
            var w = o.offsetWidth;
            var h = o.offsetHeight;
            var top = o.offsetTop;                    //包含滚动条滚动的部分
            var left = o.offsetLeft;
            var scrollTOP = document.body.scrollTop || document.documentElement.scrollTop;
            var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
            var offTop = top - scrollTOP;
            var offLeft = left - scrollLeft;
            //console.log(offTop+";"+offLeft)
            // e.pageX|| e.clientX;
            //pageX 是从页面0 0 点开始  clientX是当前可视区域0 0开始  即当有滚动条时clientX  小于  pageX
            //ie678不识别pageX
            //PageY=clientY+scrollTop-clientTop;(只讨论Y轴,X轴同理,下同) 页面上的位置=可视区域位置+页面滚动条切去高度-自身border高度
            var ex = (e.pageX - scrollLeft) || e.clientX;
            var ey = (e.pageY - scrollTOP) || e.clientY;
            var x = (ex - offLeft - w / 2) * (w > h ? (h / w) : 1);
            var y = (ey - offTop - h / 2) * (h > w ? (w / h) : 1);

            var angle = (Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90) + 3) % 4 //atan2返回的是弧度 atan2(y,x)
            var directName = ["上", "右", "下", "左"];
            return directName[angle];  //返回方向  0 1 2 3对应 上 右 下 左
        }

        function mouseEvent(angle, o, d) { //方向  元素  鼠标进入/离开
            var w = o.offsetWidth;
            var h = o.offsetHeight;

            if (d == 'in') {
                switch (angle) {
                    case '上':
                        $(o).find(".hover-btn").css({left: 0, top: -h + "px"}).stop(true).animate({
                            left: 0,
                            top: 0
                        }, 300)
//						setTimeout(function(){
//							$(o).find(".hover-btn a").css({left:'50%',top:-h+"px"}).stop(true).animate({left:'50%',top:'90px'},200)
//						},200)
                        break;
                    case '右':
                        $(o).find(".hover-btn").css({left: w + "px", top: 0}).stop(true).animate({left: 0, top: 0}, 300)
//					   setTimeout(function(){
//						   $(o).find(".hover-btn a").css({left:w+"px",top:'90px'}).stop(true).animate({left:'50%',top:'90px'},200)
//					   },200)
                        break;
                    case '下':
                        $(o).find(".hover-btn").css({left: 0, top: h + "px"}).stop(true).animate({left: 0, top: 0}, 300)
//					   setTimeout(function(){
//						   $(o).find(".hover-btn a").css({left:'50%',top:h+"px"}).stop(true).animate({left:'50%',top:'90px'},200)
//					   },200)
                        break;
                    case '左':
                        $(o).find(".hover-btn").css({left: -w + "px", top: 0}).stop(true).animate({
                            left: 0,
                            top: 0
                        }, 300)
//					   setTimeout(function(){
//						   $(o).find(".hover-btn a").css({left:-w+"px",top:'90px'}).stop(true).animate({left:'50%',top:'90px'},200)
//					   },200)
                        break;
                }
            } else if (d == 'off') {
                switch (angle) {
                    case '上':
//					   $(o).find(".hover-btn a").stop(true).animate({left:'50%',top:-h+"px"},300)
                        setTimeout(function () {
                            $(o).find(".hover-btn").stop(true).animate({left: 0, top: -h + "px"}, 300)
                        }, 200)
                        break;
                    case '右':
//					   $(o).find(".hover-btn a").stop(true).animate({left:w+"px",top:'90px'},300)
                        setTimeout(function () {
                            $(o).find(".hover-btn").stop(true).animate({left: w + "px", top: 0}, 300)
                        }, 200)
                        break;
                    case '下':
//					   $(o).find(".hover-btn a").stop(true).animate({left:'50%',top:h+"px"},300)
                        setTimeout(function () {
                            $(o).find(".hover-btn").stop(true).animate({left: 0, top: h + "px"}, 300)
                        }, 200)
                        break;
                    case '左':
//					   $(o).find(".hover-btn a").stop(true).animate({left:-w+"px",top:'90px'},300)
                        setTimeout(function () {
                            $(o).find(".hover-btn").stop(true).animate({left: -w + "px", top: 0}, 300)
                        }, 200)
                        break;
                }
            }
        }
    }

    mbList();
    //选择模板弹窗
    var select_template_page = 1;
    //搜索
    $("#templateSeach").click(function () {
        select_template_page = 1;
        reload_template_list();
    });
    $("#templateKeyword").keyup(function () {
        if (event.keyCode == 13) {
            // 回车键事件
            select_template_page = 1;
            reload_template_list();
        }
    });
    //排序
    $(".templateSort a").click(function () {
        if ($(this).hasClass("current")) {
            return;
        } else {
            var $sortList = $(".templateSort a");
            $sortList.removeClass("current");
            $(this).toggleClass("current");
            select_template_page = 1;
            reload_template_list();
        }
    });
    //简历模板点击事件
    $(".changeModal .zx-tag a").click(function () {
        $("#templateKeyword").val("");
        select_template_page = 1;
        reload_template_list();
    });
    function reload_template_list() {
        $("#loadingBtn").addClass("loadingBtn");
        var data_sort = $(".templateSort a.current").attr("data_sort");
        var keyword = $("#templateKeyword").val();
        var current_resume_type = $("#current_resume_type").val();
        //console.log(page);
        $("#without_tips").hide();
        $("#loadingBtn").show();
        if (select_template_page == 1) {
            $("#data_template_list").load("/editresume/select_template/", {
                "type": current_resume_type,
                "pageNum": select_template_page,
                "sort": data_sort,
                "keyword": keyword
            }, function () {
                var $li = $("#data_template_list").find("li");
                if ($li == null || $li.length == 0) {
                    $("#without_tips").show();
                    $("#loadingBtn").hide();
                } else if ($li.length < 15) {
                    $("#loadingBtn").hide();
                }
                $("#loadingBtn").removeClass("loadingBtn");
                mbList();
            });
        } else {
            $.get("/editresume/select_template/", {
                "type": current_resume_type,
                "pageNumber": select_template_page,
                "sort": data_sort,
                "keyword": keyword
            }, function (result) {
                if (result != null && result != "") {
                    $("#data_template_list li:last").after(result);
                    $("#loadingBtn").removeClass("loadingBtn");
                    mbList();
                } else {
                    $("#loadingBtn").hide();
                }
            });
        }
    };
    $("#loadingBtn").click(function () {
        select_template_page = select_template_page + 1;
        console.log(select_template_page);
        reload_template_list();
    });
    //预览
    $(".preview").click(function () {
        //隐藏侧边栏
        $(".wbdzx-barR").css("display", "none");
        $(".wbdzx-header").css("display", "none");
        $(".wbdzx-toolbar").css("display", "none");

        //文本不可编辑
        $(".wbdzx-container").addClass("resetEditStyle");
        $(".wbdzx-container").prepend('<div class="no_edit_background"></div>');
    });
});
