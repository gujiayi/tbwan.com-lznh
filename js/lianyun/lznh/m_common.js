var link='';
localStorage.getItem('link')?link=localStorage.getItem('link'):link=window.location.href;

var initScreen = function () {
  $("html").css("font-size", document.documentElement.clientWidth / 375 * 312.5 + "%");
}
$(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function () {
  setTimeout(initScreen, 200);
});

//微信右上角分享
$(function(){
  var u = navigator.userAgent;
  var ua = navigator.userAgent.toLowerCase();
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if(ua.match(/MicroMessenger/i)=="micromessenger") {   //微信内置浏览器+应用宝链接
　　        //跳安卓下载地址
    $('.share').click(function(){
      $('#share-wx').show() 
    })
  }else{
    $('.share').click(function(){
      $('#share-m').show() ;
      $('#indexLink').text(link)
    })
  if(isiOS){
    $('.button').click(function(e){
      if(!$('.button').attr('href')){
        e.preventDefault();
        alert('敬请期待')
      }
    })
  }
}
})
function shareClose(){
  $('#share-m').hide() ;
  $('#share-wx').hide() 
}
// index tab news
$('.page2 .tab').delegate('li', 'click', function () {
  $(this).addClass("active").siblings().removeClass("active");
  var index = $(this).index(); //获取索引号
  $(this).parent().next().children().eq(index).addClass("selected").siblings().removeClass("selected")
  pagination()
})

$('.page3 .tab').delegate('li', 'click', function () {
  $(this).children().addClass("active").parent().siblings().children().removeClass("active");
  var index = $(this).index(); //获取索引号
  $(this).parent().siblings().children().eq(index).addClass("selected").siblings().removeClass("selected")
})

// $('.navbar ul').delegate('li','click',function(){
//   $(this).find('a').addClass('active').end().siblings().children().removeClass('active')
// })






$('.gift').click(function(){
  $('.login-layer').show();
  var logined=localStorage.getItem('logined')
  if(logined){
    $('#gift').show();
    $('#gift span').text(logined)
  }else{
    $('#login').show();
  }
})



// 账号登录获取礼包
function submit() {
  var form = $('#login_form');
  var error=$('#error_text');
  var param = form.serialize();
  var cellphone = form.find('input[name=phoneNum]');
  var captcha = form.find('input[name=captcha]');
  var cellphoneVal = cellphone.val();
  var captchaVal = captcha.val();
  var param = {
    'captcha' : captchaVal,
    'card_type':19,
    'username':cellphoneVal,
    'gid':1333
  };
  if(cellphoneVal.length < 11 || cellphoneVal.length > 11) {
    error.text('请重新输入正确的手机号').show();
    return false;
  }
  if(captchaVal.length !==6){
    error.html('请重新输入正确验证码').show();
    captcha.focus();
    return false;
  }
  $.post('/lianyun/index/giftBag', param, function (res) {  // 账号登录
    if (res.status == 1) {
      localStorage.setItem('logined',res.msg)
      $('#login').hide();
      $('#gift').show();
      setTimeout(() => {
        $('#gift span').text(res.msg)
      }, 500);
      cellphone.val('');
      form.find('input[name=code]').val('');
      captcha.val('');
      error.hide();
    }else{
      getCode()
      error.html('<p>'+res.msg+'</p>').show();
      cellphone.focus();
    }
  }, 'json');
}


//分页
function pagination(){
  var val=$('.selected .pagination a:first')
  if(val.text().indexOf('共')<0){
    val.text('共'+val.text()+'条')
  }
  $('.selected .pagination a:nth-child(2)').hide();
  $('.selected .pagination a:last').text('下一页')
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
        'json':1
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
          $('.tab_wrap .selected ul').append(arr)

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


$('.close ').click(function(){
  var form = $('#login_form');
  $('#error_text').text('').hide();
  form.find('input[name=phoneNum]').val('');
  form.find('input[name=captcha]').val('');
  form.find('input[name=code]').val('');
  $('#gift').hide();
  $('#login').hide();
  $('.login-layer').hide();
  $('#video-layer').hide();
  $('video').trigger('pause');
})

$('.palyer').click(function(){
  $('.login-layer').show();
  $('#video-layer').show();
  $('video').trigger('play');
})
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

//发送验证码
function sendCaptcha(){
  var form = $('#login_form'),
  cellphone = form.find('input[name=phoneNum]').val(),
  code = form.find('input[name=code]').val(),
  error=$('#error_text'),
  url='/csi/ImageVerify/sendSms',
  param = {
    'LOGIN_ACCOUNT' : cellphone,
    'code':code
  }
  if(cellphone.length < 11 || cellphone.length > 11) {
    error.text('请重新输入正确的手机号').show();
    return false;
  }
  if(code.length !==4){
    error.text('请重新输入正确验证码').show();
    return false;
  }
  getJson(param, function(res){
    if (res.status == 0) {
      error.hide();
      $('.icon-code').attr('disabled','disabled').addClass('w-button-disabled');
      capt_cd = 60;
      var capt_timer = setInterval(function(){
        capt_cd--;
        $('.icon-code').text(capt_cd+'秒后重试');
        if (capt_cd == 1) {
          $('.icon-code').text('发送验证码').removeAttr('disabled').removeClass('w-button-disabled');
          clearInterval(capt_timer);
        }
      },1000)
    }else{
      error.show().text(res.msg)
      getCode()
    }
  }, url,'POST');
}
function getCode(){
  var img = document.getElementById('php-code');
  img.src ="/csi/ImageVerify/getImageCode?"+Math.random();
}
function attention(boolean){
  boolean? $('.sharemask').show(): $('.sharemask').hide()
}


$('.share-btn_qq').click(function(){
//  var url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(u("qqzone")) + "&title=" + encodeURIComponent(y.title) + "&desc=" + encodeURIComponent(y.desc) + "&pics=" + encodeURIComponent(y.imgurl);
var url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+link +"&title=龙之怒吼官网"+link;
  window.location.href=url
})

$('.share-btn_wx').click(function(e){
  e.stopPropagation();
  $('.share_ctrl').addClass('show_qrcode');
  $('.share_buttons').hide();
})
$('.share-btn_cp').click(function(e){
  e.stopPropagation();
  $('.share_ctrl').addClass('show_link');
  $('.share_buttons').hide();
})

$('.share_qrcode .btn-close ').click(function(e){
  e.stopPropagation();
  $('.share_ctrl').removeClass('show_qrcode');
  $('.share_buttons').show();
})

$('.share_link .btn-close ').click(function(e){
  e.stopPropagation();
  $('.share_ctrl').removeClass('show_link');
  $('.share_buttons').show();
})

$(".share-btn_qqfan").click(function(){
  var url = qqFriend();
  window.location.href=url
}); 

function qqFriend() {
  var p = {
      url : link, /*获取URL，可加上来自分享到QQ标识，方便统计*/
      desc:'',
      title:'龙之怒吼官网',
      summary : link, /*分享摘要(可选)*/
      pics : '', /*分享图片(可选)*/
      flash : '', /*视频地址(可选)*/
      site : '', /*分享来源(可选) 如：QQ分享*/
      style : '201',
      width : 32,
      height : 32
  };
  var s = [];
  for ( var i in p) {
      s.push(i + '=' + encodeURIComponent(p[i] || ''));
  }
  var url = "http://connect.qq.com/widget/shareqq/index.html?"+s.join('&');
  return url;
}


var minHeight=$(window).height()-ulHeight-$('.article').height()-$('.details .title').height()-30
var ulHeight=$('.top').height()+$('.nav').height()+$('.bottom').height()+$('.gy-footer').height()
$('.page2').height($(window).height()-ulHeight-10);
var ulMinHeight=$(window).height()-ulHeight-$('.pagination').height()-$('.tab_wrap').height()-30
$('.tab_list ul').css({
  'minHeight':ulMinHeight
})
$('.details .text_wrap').css({
  'minHeight':minHeight
})

function getLocalTime(sj)
{
  var now = new Date(sj*1000);
  var   year=now.getFullYear();    
  var   month=now.getMonth()+1;    
  var   date=now.getDate();    
  return   year+"-"+month+"-"+date;   
     
}

getList();
var li_span=[];
var list=[];
function getList(){
    var url="/lianyun/Article/list",
    param={'index':1, 'typeid':28};
    getJson(param,function(res){
      var arr=[];
      list=res;
      for(i in res.type){
        arr.push(res.type[i])
      }
      arr.unshift('最新')
      for(var i=0;i<arr.length;i++){
        $('#page2 .tab_wrap .tab').append(' <li onclick="Move(this)" class="tab-item">'+arr[i]+'</li>')
      }
      $('#page2 .tab_wrap .tab li').eq(0).addClass('active');
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
        + '<a href="/lznh/list/'+name+'" target="_blank">+</a>'
        +'<i class="line line_right"></i>'
        +'</div>'
        +'</div>'
      }
      for(var i=0;i<newArr.length;i++){
        if(i=='type')continue;
        if(!newArr[i].name){
          var text= wrap_one('newest')
        }else{
          var text= wrap_one(newArr[i].name)
        }
        ul_main.push(text)
      }
      $('#page2 .tab_list').empty().append(ul_main)
    
      function wrap_two(item){
        var time=getLocalTime(item.pubdate)
        var label='<li><a href="/lznh/detail/?id='+item.id+'" target="_blank"><span class="news_list">'+item.title+'</span><span class="times">'+time+'</span></a></li>'
        li_span.push(label)
      }
      li_span=[];
      for(var i=0;i<newArr.length;i++){
        if(newArr[i] instanceof Array){
          newArr[i].forEach(function(item){
            wrap_two(item)
          })
          $("#page2 .tab_list .main").eq(0).find('ul').empty().append(li_span)
          $('#page2 .tab_list .main').eq(0).addClass('selected')
        }else{
          li_span=[];
          for(j in newArr[i]){
            if(j!=='name'){
              wrap_two(newArr[i][j])
            }
          }
          $("#page2 .tab_list .main").eq(i).find('ul').empty().append(li_span)
        }
      }
    },url)
  }