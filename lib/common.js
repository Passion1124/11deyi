var ebase = "http://120.76.156.87:660";
var token = "NzVmNmFkMTYtZmQ0MC0xMWU1LWE4Y2UtYWE1MTk0ZjUwZTY2LDE1ODI4NTUwMTY1LDcwNEZFODQ3LTQ3QzItNEM5Mi1BNzJFLUQ4MjQ2RDFBRUREMyxqdE84WXBWcjVCZWYrWVBRV2VVRlNPMTdkSU5pOEd5aA==";
var pageindex = 1;
var pagesize = 10;

if (location.search){
    var tel = getUrlParam("tel");
    var name = getUrlParam("name");
    var type = getUrlParam("type");
}

function initLocalStorage(){
    if (location.search){
        if (!localStorage.judge && tel && name ){
            var judge = {"tel": tel, "name": name, "type": type, "jcylw": true};
            localStorage.judge = JSON.stringify(judge);
        }
    }
    if (!localStorage.login){
        var login = {};
        localStorage.login = JSON.stringify(login);
    }
    if (!location.search && localStorage.judge){
        localStorage.removeItem("judge");
    }
}

initLocalStorage();


function getToken(callback,data,Type){
    if (location.search && tel && name){             //判断是否是基层医联网进入的
        var loginToken = getLocalStroagelogin();
        //alert(tel);
        //alert(loginToken.tel);
        addLocalStorageJudge(function (judge) {
            judge.tel = tel;
            judge.name = name;
            judge.type = type;
            localStorage.judge = JSON.stringify(judge);
        });
        if (loginToken.token){
            if (tel !== loginToken.tel){
                var reg =  /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!reg.test(tel)){
                    alert("账号数据异常");
                    $(".consult_loading").addClass("hide");
                }else {
                    autoRegister(tel,name,data,Type);
                }
            }else {
                callback();
            }
        }else {
            autoRegister(tel,name,data,Type);
        }
    }else {
        console.log("PC端");
        callback();
    }
}
//自动注册功能
function autoRegister(tel,name,info,Type){
    $.ajax({
        url:ebase+"/api/User/Register",
        type:"POST",
        data:{"appToken":"","para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "phone":tel
        }},
        dataType:"json",
        success:function(data){
            console.log(data);
            //console.log(info);
            var Data = data.Data;
            if (data.Code === "0006"){
                addLocalStorageLogin(function(login){
                    login.token = Data.appToken;
                    login.name = Data.Name;
                    login.tel = Data.Phone;
                    login.faceimg = Data.FaceImgUrl;
                    localStorage.login = JSON.stringify(login);
                });
                if (Type === "consult"){
                    issue_consult(info.title,info.sex,info.age,info.depid,info.depname,info.questionpics,info.isanonymous,info.pricevalue,info.doctorid);
                }else if (Type === "turnyard"){
                    issue_turnyard(info.title, info.sex, info.age, info.depid, info.depname, info.pics, info.isanonymous, info.describe, info.userAddress)
                }else if (Type === "concern"){
                    getConcernDoctor();
                }else if (Type === "myConsult"){
                    getMyConsult();
                }else if (Type === "myTurnYard"){
                    getMyTurnYard();
                }
            }
            else  if (data.Code === "0000"){
                addLocalStorageLogin(function(login){
                    login.token = Data.appToken;
                    localStorage.login = JSON.stringify(login);
                });
                update_info(tel,name,Data.UserId,info,Type)
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//发布转院求助信息
function issue_turnyard(title,sex,age,depid,depname,pics,isanonymous,describe,address){
    var token = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,"para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "patientdes":title,
            "sex":sex,
            "age":age,
            "departmentid":depid,
            "departmentname":depname,
            "pics":pics,
            "isanonymous":isanonymous,
            "medicinedes":describe,
            "addr":address
        }};
    console.log(postData);
    $.ajax({
        url:ebase+"/api/TransHospital/Submit",
        type:"POST",
        data:postData,
        dataType:"json",
        success:function(data){
            if (data.Code === "0000"){
                $(".issue_box section .issue").removeAttr("disabled");
                $(".issue_box").addClass("hide");
                $(".turnyard").removeClass("hide");
                queryListForPublishByme();
            }
        },
        error:function(xhr ,errorType ,error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//发布病情咨询信息
function issue_consult(title,sex,age,depid,depname,questionpics,isanonymous,pricevalue,doctorid){
    var token = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,"para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "title":title,
            "sex":sex,
            "age":age,
            "depid":depid,
            "depname":depname,
            //"questionpics":questionpics,
            "isanonymous":isanonymous,
            "pricevalue":pricevalue,
            "doctorid":doctorid
        }};
    console.log(postData);
    $.ajax({
        url:ebase+"/api/Question/Submit",
        type:"POST",
        data:postData,
        dataType:"json",
        success:function(data){
            //console.log(data)
            if (data.Code === "0000"){
                $(".consult_loading img").addClass("result").attr("src","img/success@2x.png");
                $(".consult_loading p").text("发布成功");
                setTimeout(function(){
                    location.href = "index.html"+location.search;
                },400)
            }else {
                $(".consult_loading p").text("发布失败");
                $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
                setTimeout(function(){
                    $(".consult_loading").addClass("hide");
                },300);
            }
        },
        error:function(xhr ,errorType ,error) {
            //alert("错误");
            $(".consult_loading p").text("发布失败");
            $(".consult_loading img").addClass("result").attr("src","img/fail@2x.png");
            setTimeout(function(){
                $(".consult_loading").addClass("hide");
                $(".consult_loading img").removeClass("result").attr("src","img/loading.gif");
            },300);
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//修改用户信息
function update_info(tel,name,userid,info,Type){
    var login = getLocalStroagelogin();
    var token = login.token;
    var userType = "U";
    if (type === "doctor"){
        userType = "D"
    }
    var postData = {
        "appToken": token,
        "para":{
            "device_type":"PC",
            "device_id":" ",
            "api_version":"1.0.0.0",
            "update_userid":userid,
            "faceimgurl":"http://www.11deyi.com/img/30.png",
            "nikename":name,
            "sex":"M",
            "type": userType,
            "adviser":"bg-jcylw(村医)"
        }
    };
    $.ajax({
        "url":ebase+"/api/User/UpdateUser",
        "type": "POST",
        "data":postData,
        "dataType":"json",
        success:function(data){
            console.log(data);
            if (data.Code === "0000"){
                var userInfo = data.Data.userInfo;
                addLocalStorageLogin(function(login){
                    login.tel = userInfo.Phone;
                    login.name = userInfo.Name;
                    login.faceimg = userInfo.FaceImgUrl;
                    localStorage.login = JSON.stringify(login);
                });
                if (Type === "consult"){
                    issue_consult(info.title,info.sex,info.age,info.depid,info.depname,info.questionpics,info.isanonymous,info.pricevalue,info.doctorid);
                }else if (Type === "turnyard"){
                    issue_turnyard(info.title, info.sex, info.age, info.depid, info.depname, info.pics, info.isanonymous, info.describe, info.userAddress)
                }else if (Type === "concern"){
                    getConcernDoctor();
                }else if (Type === "myConsult"){
                    getMyConsult();
                }else if (Type === "myTurnYard"){
                    getMyTurnYard();
                }
            }
        },
        error: function (xhr ,errorType ,error) {
            console.log("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//获取科室列表
function getDepList(){
    if (getLocalStroagelogin().token){
        token = getLocalStroagelogin().token;
    }
    var postData = {"appToken":token,"para":{
        "device_type":"PC",
        "device_id":"",
        "api_version":"1.0.0.0"
    }};
    $.ajax({
        url:ebase+"/api/Admin/Question/QueryDepList",
        type:"POST",
        data:postData,
        dataType:"json",
        success: function (data) {
            console.log(data);
            $(".loading").addClass("hide");
            $("section").removeClass("hide");
            var Data = data.Data;
            for (var i = 0; i < Data.length; i++){
                var option = "<option class='opt' depid='"+Data[i].ParentID+"'>"+Data[i].ParentName+"</option>";
                $(".elect .department select").append(option)
            }
        },
        error: function (xhr ,errorType ,error) {
            //alert("错误");
            console.log(xhr);
            console.log(errorType);
            console.log(error)
        }
    })
}
//获取年龄
function initSelectData(){
    for (var k = 1; k < 13; k++){
        var ele = "<option value='"+k+"月'>"+k+"月</option>";
        $(".elect .age select").append(ele)
    }
    for (var i = 1; i < 101; i++){
        if (i == 18){
            var ele = "<option value='"+i+"岁' selected>"+i+"岁</option>";

        }else {
            var ele = "<option value='"+i+"岁'>"+i+"岁</option>";

        }
        $(".elect .age select").append(ele)
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

$(".case_science").on("click",function(){
    location.href = "case_science.html"+location.search;
});
$(".index").on("click",function(){
    location.href = "index.html"+location.search;
});
$(".turn_yard").on("click",function(){
    location.href = "turn_yard.html"+location.search;
});

//对登陆弹窗的操作
$(".popup button:nth-of-type(1)").on("click",function(){
    createBackUrl(location.href);
    location.href = "login.html";
});
$(".popup button:nth-of-type(2)").on("click",function(){
    createBackUrl(location.href);
    location.href = "register.html";
});
$(".popup .login_popup span").on("click",function(){
    $(".popup").addClass("hide");
});

$(".switch p:nth-of-type(1)").on("click",function(){
    location.href = "concern_doctor.html"+location.search;
});
$(".switch p:nth-of-type(2)").on("click",function(){
    location.href = "myconsult.html"+location.search;
});
$(".switch p:nth-of-type(3)").on("click",function(){
    location.href = "my_turnyard.html"+location.search;
});

//添加localStorage的里面的judge的属性
function addLocalStorageJudge(callback){
    var newData = JSON.parse(localStorage.judge);
    callback(newData);
    //localStorage.judge = JSON.stringify(newData);
}
//获取localStorage里的judge数据
function getLocalStroagejudge(){
    var newData = JSON.parse(localStorage.judge);
    return newData;
}
//添加localStorage的里面的login的属性
function addLocalStorageLogin(callback){
    var newData = JSON.parse(localStorage.login);
    callback(newData);
    //localStorage.judge = JSON.stringify(newData);
}
//获取localStorage里的login数据
function getLocalStroagelogin(){
    var newData = JSON.parse(localStorage.login);
    return newData;
}

function createQuestionId(questionid){
    var question = questionid;
    localStorage.questionid = question;
}
function getLocalStorageQuestionId(){
    var question = localStorage.questionid;
    return question;
}

function createBackUrl(backurl){
    var backUrl = backurl;
    localStorage.backurl = backUrl;
}
function getLocalStorageBackUrl(){
    var backurl = localStorage.backurl;
    return backurl;
}

function createUserId(userid){
    var user = userid;
    localStorage.userid = user;
}
function getLocalStorageUserId(){
    var user = localStorage.userid;
    return user;
}

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
//判断打开页面的浏览器是否是微信
function wxBrowser(){
    if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //在微信中打开
            $("header").addClass("hide");
        }
    }
}
wxBrowser();


var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            childElements,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {


            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        var clickedListItem = closest(eTarget, function(el) {
            return el.tagName === 'FIGURE';
        });

        if(!clickedListItem) {
            return;
        }


        // find index of clicked item
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if(!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of docs for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },

            // history & focus options are disabled on CodePen
            // remove these lines in real life:
            historyEnabled: false,
            focus: false

        };

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
    }
};

function getImageWidth(url,k,callback){
    var img = new Image();
    img.src = url;
    // 如果图片被缓存，则直接返回缓存数据
    if(img.complete){
        callback(img.width, img.height,k);
    }else{
        // 完全加载完毕的事件
        img.onload = function(){
            callback(img.width, img.height,k);
        }
    }
}