$(function(){
    getDepList();
    initSelectData();
    if (getLocalStroagelogin().token){
        queryListForPublishByme();
    }else {
        $(".turnyard .list_loading").addClass("hide");
        $(".unMoreData").removeClass("hide");
    }
});

$(".issue_box section .issue").on("click", function () {
    var title = $(".issue_box section .content textarea").val();
    var sex = $(".issue_box section .sex_yes").text();
    if (sex == "男"){
        sex = "M"
    }else {
        sex = "W"
    }
    var age = $(".issue_box section .age span:nth-of-type(1)").text();
    var depname = $(".issue_box section .department span:nth-of-type(1)").text();
    var pics = "";
    $(".issue_box .pics img").each(function(index,item){
        if (index > 0){
            pics += ","+$(this).attr("src")
        }else {
            pics += $(this).attr("src");
        }
    });
    var isanonymous = "N";
    if($(".issue_box section .question_btm p:nth-of-type(1)").hasClass("cryptonym")){
        isanonymous = "N"
    }else {
        isanonymous = "Y"
    }
    var depid = "";
    $(".issue_box section .elect .department select option").each(function(item,index){
        if ($("section .elect .department select").val() === $(this).val()){
            depid = $(this).attr("depid");
        }
    });
    var describe = $(".issue_box section .describe textarea").val();
    var userAddress = $(".issue_box section .address input").val();
    if (depname === "选择科室"){
        alert("请填写科室");
    }else if (!userAddress){
        alert("请填写地址");
    }else if (!title || title.length < 20){
        alert("请填写不少于20字的病情描述");
    }
    if (depname !== "选择科室" && title.length >= 20 && userAddress){
        //alert("进入");
        $(".consult_loading").removeClass("hide");
        $(".consult_loading img").removeClass("result");
        $(this).attr("disabled",true);
        var Type = "turnyard";
        var data = {title:title, sex:sex, age:age, depid:depid, depname:depname, pics:pics, isanonymous:isanonymous, describe:describe, userAddress:userAddress}
        getToken(function () {
            issue_turnyard(title, sex, age, depid, depname, pics, isanonymous, describe, userAddress)
        }, data, Type);
    }
});
$(".issue_box .elect .age select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$(".issue_box .elect .department select").on("change",function(){
    $(this).parent().find("span:nth-of-type(1)").text($(this).val());
});
$(".issue_box section .content textarea").on("input", function () {
    $(".issue_box section .question_btm .initLength").text($(this).val().length);
});
$(".issue_box section .question_btm p:nth-of-type(1)").on("click",function(){
    $(this).toggleClass("cryptonym")
});
$(".issue_box section .elect .sex").on("click", function () {
    $(".issue_box section .elect .sex").each(function(item,index){
        $(this).removeClass("sex_yes")
    });
    $(this).addClass("sex_yes");
});
$(".turnyard .issue_btn").on("click", function () {
    var login = getLocalStroagelogin();
    if (localStorage.judge || login.token){
        $(".issue_box").removeClass("hide");
        $(".turnyard").addClass("hide");
        if ($(".issue_box header").hasClass("hide")){
            $(".issue_box header").removeClass("hide");
        }
    }else {
        $(".popup").removeClass("hide");
        $("html,body").addClass("ovfHiden")
    }
});
$(".issue_box header .back").on("click", function () {
    $(".turnyard,.turnyard .list_loading").removeClass("hide");
    $(".issue_box").addClass("hide");
    $(".turnyard .list").remove();
    queryListForPublishByme();
});
$(".turnyard header .back").on("click", function () {
    history.back();
});
$(".present_box button").on("click", function () {
    $(".present_box").addClass("hide");
    $(".issue_box").addClass("hide");
    $(".turnyard").removeClass("hide");
    queryListForPublishByme();
    $("html,body").removeClass("ovfHiden");
});
function queryListForPublishByme(){
    var token = getLocalStroagelogin().token;
    var postData = {
        "appToken":token,
        "para":{
            "device_type":"PC",
            "device_id":"",
            "api_version":"1.0.0.0",
            "pageindex":pageindex,
            "pagesize":pagesize
        }
    };
    $.ajax({
        "url": ebase+"/api/TransHospital/QueryListForPublishByme",
        "data":postData,
        "dataType":"json",
        "type":"POST",
        success: function (data) {
            console.log(data);
            var Data = data.Data;
            $(".turnyard .list").remove();
            $(".turnyard .list_loading").addClass("hide");
            if (Data.length < 1){
                $(".turnyard .unMoreData").removeClass("hide");
            }
            for (var i = 0; i < Data.length; i++){
                var ele = "<div class='list'>" +
                    "<div class='list_left'>" +
                    "<p class='head_portrait'></p>" +
                    "</div>" +
                    "<div class='list_right'>" +
                    "<p class='title'>" +
                    "<span>"+Data[i].UserName+"</span>" +
                    "<span>"+Data[i].Type+"</span>" +
                    "</p>" +
                    "<p class='address'>" +
                    "<span>"+Data[i].DepName+"</span>" +
                    "<span>"+Data[i].Addr+"</span>" +
                    "</p>" +
                    "<p class='text'>"+Data[i].PatientDes+"</p>" +
                    "<p class='other'>" +
                    "<span>"+Data[i].CreateTime+"</span>" +
                    "<span>"+Data[i].ViewCount+"人看过</span>" +
                    "</p>" +
                    "</div>" +
                    "</div>";
                $(ele).insertBefore(".unMoreData");
                if (Data[i].FaceImgUrl){
                    $(".turnyard section .list:nth-of-type("+parseInt((pageindex-1)*pagesize+(i+4))+") .head_portrait").css("background-image","url('"+Data[i].FaceImgUrl+"')")
                }
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
