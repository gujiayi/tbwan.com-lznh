$(function(){
  var Gu={}
  Gu.title=$('.gift').attr('data-gname');
  if(Gu.title){
    if(Gu.title.indexOf('迷失')>=0){
      var sub= Gu.title.slice(4)
      $('#footer .left .sub').text(sub)
      return
     }
    if(Gu.title.indexOf('掌门人')>=0){
      $('#footer .left .sub').text('沉默单职业')
      return
    }
     $('#footer .left .sub').text(Gu.title)
  }
  if(!$('.ios_code img').attr('src')){
    $('.ios_code img').hide().after('<div style="width:124px;height:74px;text-align:center;background:#fff;padding-top:50px;margin-bottom:7px;">敬请期待</div>')
  }
  $('.download').click(function(e){
    if(!$('.ios_down').attr('href')){
      preventDefault(event)
      alert('敬请期待')
    }
  })
  $('.download .android_down').click(function(event){
    stopPropagation(event)
  })
  })
  //分页
function pagination(){
  var val=$('.selected .pagination a:first')
  if(val.text().indexOf('共')<0){
    val.text('共'+val.text()+'条')
  }
  $('.selected .pagination a:nth-child(2)').hide();
  $('.selected .pagination a:last').text('下一页');
}
pagination()


localStorage.removeItem('current')
function dolist(that,type,num,next){
  var page=num;
    countPage = $(that).parent().attr('data-count');
    if(next){
        if(localStorage.getItem('current')){
          page=Number(localStorage.getItem('current'))+1;
        }else{
          page=num
        }
       
    }
    $('.selected .page').children().eq(page+1).addClass('current').siblings().removeClass()
    if(page>countPage){
      $('.selected .page').children().eq(page).addClass('current').siblings().removeClass()
      return false;
    }
    var url=window.location.href,
    param={
        'page':page,
        'type':type,
        'json':1,
        "typeid":typeid

    };
    getJson(param,function(res){
      if(res.status==1){
          localStorage.setItem('current',res.current)
          $('.tab_wrap .selected ul').html('')
          var arr=[];
          res.data.forEach(item => {
              var wrap='<li><a href="yz/detail/?id='+item.id+'"><span class="news_list">'+item.title+'</span><span class="times">'+getLocalTime(item.pubdate)+'</span></a></li>'
              arr.push(wrap)
          });
          $(' .tab_wrap .selected ul').empty().append(arr)

      }else{
          console.log(res.msg)
      }
  },url,'post');
    
  

  function getLocalTime(sj)
  {
    var now = new Date(sj*1000);
    var   year=now.getFullYear();    
    var   month=now.getMonth()+1;    
    var   date=now.getDate();    
    return   year+"-"+month+"-"+date;   
       
  }
}

setTimeout(() => {
  $('#guide').height($(document.body).outerHeight(true))
}, 500);
$('#guide .text').click(function(){
  $("#guide").hide();
})
// tab切换角色
$('#title li').hover(function(){
  var i=$(this).index();
  if(i==1){
    $(this).addClass('current2').siblings().removeClass('current1');
  }else{
    $(this).addClass('current1').siblings().removeClass('current2');
  }
  $('#wrap_img div').eq(i).show().siblings().hide();
})
//切换index-list


// tab切换code
$('.code_tab li').hover(function(){
  var i=$(this).index();
  $(this).find('span').addClass('current').parent().siblings().find("span").removeClass('current');
  if(i==0){
    $('#android').show().siblings().hide();
  }else{
    $('#ios').show().siblings().hide()
  }
})

//列表页tab
function tabNews(obj) {
  localStorage.removeItem('current')
  $(obj).addClass("active").siblings().removeClass("active");
  var index = $(obj).index(); //获取索引号
  $(".right .main").eq(index).addClass("selected").siblings().removeClass("selected");
  pagination()
  
}
//去到底部
$(".game_kefu").click(function(){$('html,body').animate({scrollTop:$('#footer').offset().top});});

//礼包领取
 $('.header .gift').click(function(event){
  var e = window.event || event;
  var ele = e.target || e.srcElement;
  var gid = ele.getAttribute("data-gid"); 
  getgift(gid);
 })



//h5游戏礼包列表
function getgift(gid) {
  var url='/csi/NewCard/indexList';   //h5游戏礼包列表
  var param = {
      'card_type':0,  //礼包类型id
      'gameid':gid,
      'not_h5': 1
      
  };
  getJson(param, function (ret) {
      getlist(ret)
  }, url, 'get');

  function getlist(ret) {
    if(ret.status==1){
      var sign=ret.sign;
      var card_type=ret.data[0].id;
      giftBag(card_type,sign,gid)
    }else if(ret.status==-2){
      $('.login-layer').show();
      $('#login').show();
    }else{
      alert(ret.msg)
    }
  }
}
 //领取礼包
function  giftBag(card_type,sign,gid){
  var url='/csi/NewCard/giftBag';
  var param = {
    'card_type':card_type,
    'sign':sign,
    'gid':gid,
  }
  getJson(param, function (ret) {
    getlist(ret)
  }, url, 'post');
  function getlist(ret) {
    $('.login-layer').show();
    $('#gift').show();
    if (ret.status == 1) {
      $('#gift .title').show();
      $('#gift p').html(ret.msg)
    }else {
      $('#gift h2').hide();
      $('#gift p').html(ret.msg)
    }
  }
}
//关闭弹框
 $('.login_layer').click(function(){
  $(this).hide();
 });

 function login_tab(ele,otherEle){
  $(ele+'.freereg').click(function(event){
    preventDefault(event)
    $(otherEle).show()
    $(ele).hide()
  })
 }
 login_tab("#login ","#register ")
 login_tab("#register ","#login ")

 $('.login-layer').click(function(){
  $(this).hide();
  $('#login').hide();
  $('#register').hide();
  $('#gift').hide();
 })
$('.close').click(function(){
  $('.login-layer').hide();
  $('#gift').hide();
})

// 同意用户协议
$('#agreement-reg').click(function(){
  var isCheck = $(this).hasClass('icon-cbed');
  if (isCheck) {
    $(this).removeClass('icon-cbed');
    $('.ckterms').attr('checked',false);
  }else{
    $(this).addClass('icon-cbed');
    $('.ckterms').attr('checked',true);
  }
});

 //账号注册
 function registerAccount(e){
  var form = $('#form-register');
  var tips=  $('#register-tips');
  var param =form .serialize();
  var acc = form.find('input[name=LOGIN_ACCOUNT]').val();
  var psw = form.find('input[name=PASSWORD]').val();
  var psw1 = form.find('input[name=PASSWORD1]').val();
  var code = form.find('input[name=code]').val();
    if (!CSRegular.uname(acc)) {
      tips.html('<p>请输入6~16位英文或数字帐号</p>');
      return false;
    }
    if (!CSRegular.pass(psw)) {
      tips.html('<p>请输入6~16位密码</p>');
      return false;
    }
    if(psw!=psw1){
      tips.html('<p>请输入相同密码</p>');
      return false;
    }
    if(!code){
      tips.html('<p>请输入图型验证码</p>');
      return false;
    }
    var ts = form.find('input[name=TERMS]').attr('checked');
    if (!ts) {
      tips.html('<p>同意用户协议才能注册哦！</p>');
      return false;
    }
    $.post('/lianyun/Register/register', param, function(ret) {    //账号注册
      if (ret.status == 1) {
        $('#register').hide();
        showTips('注册成功')
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }else{
        var index_pwd = form.find('input[name=username]');
        $('#register_tips').html('<p>'+ret.msg+'</p>');
        index_pwd.focus();
      }
    },'json');
  }
  
// 账号登录
function login() {
  var form = $('#login_form');
  var tips=$('#login-tips');
  var param = form.serialize();
  var label_acc = form.find('input[name=username]');
  var label_psw = form.find('input[name=password]');
  var username = label_acc.val();
  var pwd = label_psw.val();
    
  if(username.length < 4 || username.length > 30) {
    tips.html('账户名不存在，请重新输入');
    label_acc.focus();
    return false;
  }
  if(pwd.length < 4){
    tips.html('账号与密码不匹配，请重新输入');
    label_psw.focus();
    return false;
  }
  
  $.post('/lianyun/Login/login', param, function (ret) {  // 账号登录
    if (ret.status == 1) {
      $('#login').hide();
      showTips('登录成功')
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }else{
      var index_pwd = form.find('input[name=username]');
      tips.html('<p>'+ret.msg+'</p>');
      index_pwd.focus();
    }
  }, 'json');
}
if ($_COOKIE['Puser']) {
    $('#USERNAME').val($_COOKIE['Puser']);
  }


  //注册正则
  var CSRegular = {
    special:function(v){
      return /[~#^$@%&!?%*.]/.test(v) || /^[\u4e00-\u9fa5]{0,}$/.test(v) || /\s/.test(v)
    },
    uname : function(v){
      var rule1 = /^[a-zA-Z0-9\_]{6,16}$/.test($.trim(v));
      var rule2 = !/9377/.test($.trim(v));
      return rule1 && rule2;
    },
    pass : function(v){
      return /^[a-zA-Z\d]{6,16}$/.test(v)
    },
    captcha : function(v){
      return /^\d{4,6}$/.test(v);
    },

  }

// 获取json数据
function getJson(data, callback, url, type, dType){
$.ajax({
  'url': url ?  url : 'index.php',
  'type': type ? type : 'GET',
  'data': data,
  'dataType': dType ? dType : 'json',
  'async': true,
  'cache': false,
  success: function(info){
    callback(info);
    return false;
  },
  error: function(e){
    alert('网络繁忙！');
  }
})
}
//阻止默认行为
function preventDefault(event){
  var e = window.event || event;
  if(!e.target){
    e.returnValue = false; //支持IE
  }else{
    e.preventDefault();//IE不支持
  }
}

function stopPropagation(event){
  var e = window.event || event;
    if(!e.target){
      e.cancelBubble = true; //支持IE
    }else{
      e.stopPropagation();//IE不支持
    }
}

function showTips(text){
  var text='<p id="text">'+text+'</p>'
  $('#gift').after(text)
  setTimeout(function(){
    $('#text').remove();
  },1500)
}

//二维码识别
$(function(){
  var u = navigator.userAgent;
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(ua.match(/MicroMessenger/i)=="micromessenger") {   //微信内置浏览器+应用宝链接
　　        //跳安卓下载地址

    $('.code_tab').hide()  //隐藏tab条
    $('.button a').click(function(event){
      preventDefault(event)
      $("#guide").show();
    })
    if(isiOS){
      $('.code_tab').hide();
      $('#android').hide();
      $('#ios').show();
      appendDiv('block') ;
    }else if(isAndroid){
      $('.code_tab').hide();
      $('#android').show();
      $('#ios').hide();
     
    }
  }else{
    $('.button').click(function(e){
      if(!$('.ios a').attr('href')){
        preventDefault(event)
        showTips('敬请期待')
      }
    })
    $('.button .android').click(function(event){
      stopPropagation(event)
    })
    if(isiOS){
      $('.code_tab').hide();
      $('#android').hide();
      $('#ios').show();
      appendDiv()
    }else if(isAndroid){
      $('.code_tab').hide();
      $('#android').show();
      $('#ios').hide();
    }else{ //pc
      appendDiv()
    }
  }
  function appendDiv(){
    if(!$('#ios img').attr('src')){
      console.log( $('#ios').find('img'))
      $('#ios').find('img').hide().end().append('<div style="position: absolute;top: 3px; left: 6px;width:155px;height:155px;font-size:16px;text-align:center;background:#fff;line-height:155px;margin-bottom:7px;">敬请期待</div>')
    }
  }
});

function getLocalTime(sj)
{
  var now = new Date(sj*1000);
  var   year=now.getFullYear();    
  var   month=now.getMonth()+1;    
  var   date=now.getDate();    
  return   year+"-"+month+"-"+date;   
     
}
$(function(){
  if(link=='zmr'){
    show_index_list('zmr')
  }else{
    show_index_list('dzy')
  }
function show_index_list(link) {
  getList();
  var li_span = [];
  var list = [];

  function getList() {
    var url = "/lianyun/Article/list",
      param = {
        'index': 1,
        'typeid':typeid
      };
    getJson(param, function (res) {
          var arr = [];
          list = res;
          for (i in res.type) {
            arr.push(res.type[i])
          }
          arr.unshift('最新')
          for (var i = 0; i < arr.length; i++) {
            $('.center .list_wrap .tab').append(' <li onclick="Move(this)" class="tab-item">' + arr[i] + '</li>')
          }
          $('.center .list_wrap .tab li').eq(0).addClass('active');
      var newArr=[];
      for(i in res){
        newArr.push(res[i]);
      }
      newArr.unshift(newArr[newArr.length-2]);
      newArr.splice(newArr.length-2,2)
      var ul_main=[];
      function wrap_one(name){
        return ' <div class="main"><ul class="wrap"></ul>'
        +'<div class="more">'
        + '<i class="line line_left"></i>'
        + '<a href="/'+link+'/list/'+name+'" target="_blank">查看更多</a>'
        +'<i class="line line_right"></i>'
        +'</div>'
        +'</div>'
      }
      for(var i=0;i<newArr.length;i++){
        if(i=='type')continue;
        if(!newArr[i].name){
          var text= wrap_one('newest')
        }else{
          var text=wrap_one(newArr[i].name)
        }
        ul_main.push(text)
      }
      $('.center  .tab_list').empty().append(ul_main)
      li_span=[];
      function wrap_two(item){
        var time=getLocalTime(item.pubdate)
        var label='<li><a href="/'+link+'/detail/?id='+item.id+'" target="_blank"><span class="news_list">'+item.title+'</span><span class="times">'+time+'</span></a></li>'
        li_span.push(label)
      }
      for(var i=0;i<newArr.length;i++){
        if(newArr[i] instanceof Array){
          newArr[i].forEach(function(item){
            wrap_two(item)
           
          })
          $(".center .tab_list .main").eq(0).find('ul').empty().append(li_span)
          $('.center .tab_list .main').eq(0).addClass('selected')
        }else{
          li_span=[];
          for(j in newArr[i]){
            if(j!=='name'){
              wrap_two(newArr[i][j])
            }
          }
          $(".center .tab_list .main").eq(i).find('ul').empty().append(li_span)
        }
      }
    },url)
  }
  }
})


  function Move(obj) {
  $(obj).addClass("active").siblings().removeClass("active");
  var index = $(obj).index(); //获取索引号
  $(".center .list_wrap .main").eq(index).addClass("selected").siblings().removeClass("selected");
}