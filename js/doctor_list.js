//        console.log(document.referrer)
$(function(){
    //var parentid = location.href.split("?")[1].split("&")[2].split("=")[1];
    //var token = "NzVmNmFkMTYtZmQ0MC0xMWU1LWE4Y2UtYWE1MTk0ZjUwZTY2LDE4MDMwNDk4MzMwLDMzYTBiY2FjLWM5ZjQtNDBkYy1hNjRjLWY3NDIzM2UyMGE4YSw4aVQ0ZjVQQUd0Z3pKUkhVeVN0dTN3TGxyWmtIY3o1dg==";
    //$.ajax({
    //    url:"http://120.76.156.87:660/api/Doctor/QueryDoctorWithDepId",
    //    type:"POST",
    //    data:{"appToken":token,"para":{
    //        "device_type":"PC",
    //        "device_id":" ",
    //        "api_version":"1.0.0.0",
    //        depid: parentid,
    //        pageindex:"1",
    //        pagesize:"10"
    //    }},
    //    dataType:"json",
    //    success:function(data){
    //        $(".loading").addClass("hide");
    //        $("section,header").removeClass("hide");
    //        $("header .title").text(decodeURI(location.href.split("?")[1].split("&")[3].split("=")[1]));
    //        console.log(data);
    //        var Data = data.Data;
    //        for (var i = 0; i < Data.length; i++){
    //            var ele = "<div class='doctor' doctorid='"+Data[i].DoctorId+"'>" +
    //                "<div class='head_portrait'></div>" +
    //                "<div class='doctor_info'>" +
    //                "<span class='doctor_name'>"+Data[i].DoctorName+"</span>" +
    //                "<span>"+Data[i].DepartmentName+"</span>" +
    //                "<span>"+Data[i].JobLevelName+"</span>" +
    //                "<h4>"+Data[i].HName+"</h4>" +
    //                "</div>" +
    //                "<div class='advisory'>" +
    //                "<img src='img/doctor_list_go.png' alt=''>" +
    //                "</div>" +
    //                "</div>";
    //            $("section").append(ele);
    //            if (Data[i].FaceImgUrl != null){
    //                $("section .doctor:nth-of-type("+(i+1)+") .head_portrait").css("background-image","url('"+Data[i].FaceImgUrl+"')")
    //            }
    //            if (Data[i].JobLevelName === null){
    //                $("section .doctor:nth-of-type("+(i+1)+") span:nth-of-type(3)").addClass("hide")
    //            }
    //        }
    //    },
    //    error: function (xhr ,errorType ,error) {
    //        alert("错误")
    //        console.log(xhr)
    //        console.log(errorType)
    //        console.log(error)
    //    }
    //});
    $("header .back").on("click",function(){
//            var tel = location.href.split("?")[1].split("&")[0].split("=")[1];
//            var name = location.href.split("?")[1].split("&")[1].split("=")[1];
//            location.href = "index.html?tel="+tel+"&name="+name;
        history.back();
//            location.reload();
    });
    //$("section").on("click",".doctor",function(){
    //    var tel = location.href.split("?")[1].split("&")[0].split("=")[1];
    //    var name = location.href.split("?")[1].split("&")[1].split("=")[1];
    //    var doctorid = $(this).attr("doctorid");
    //    location.href = "doctor_info.html?tel="+tel+"&name="+name+"&doctorid="+doctorid;
    //})
})
//        console.log(location.href);
//        console.log(location.href.split("?"));
//        console.log(location.href.split("?")[1].split("&"));
//        var getUrl = location.href.split("?")[1].split("&");
//        var tel = getUrl[1].split("=")[1];
//        alert(decodeURI(tel));