// index tab news
getList();
var li_span=[];
var list=[];
function getList(){
    var url="/lianyun/Article/list",
    param={
      'index':1,
      'typeid':28
  };
    getJson(param,function(res){
      var arr=[];
      list=res;
      for(i in res.type){
        arr.push(res.type[i])
      }
      arr.unshift('最新')
      for(var i=0;i<arr.length;i++){
        $('.page1 .tab_wrap .tab').append(' <li onclick="Move(this)" class="tab-item">'+arr[i]+'</li>')
      }
      $('.page1 .tab_wrap .tab li').eq(0).addClass('active');
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
        + '<a href="/lznh/list/'+name+'" target="_blank">查看更多</a>'
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
      $('.page1 .tab_list').empty().append(ul_main)
      li_span=[];
      function wrap_two(item){
        var time=getLocalTime(item.pubdate)
        var label='<li><a href="/lznh/detail/?id='+item.id+'" target="_blank"><span class="news_list">'+item.title+'</span><span class="times">'+time+'</span></a></li>'
        li_span.push(label)
      }
      for(var i=0;i<newArr.length;i++){
        if(newArr[i] instanceof Array){
          newArr[i].forEach(function(item){
            wrap_two(item)
          })
          $(".page1 .tab_list .main").eq(0).find('ul').empty().append(li_span)
          $('.page1 .tab_list .main').eq(0).addClass('selected')
        }else{
          li_span=[];
          for(j in newArr[i]){
            if(j!=='name'){
              wrap_two(newArr[i][j])
            }
          }
          $(".page1 .tab_list .main").eq(i).find('ul').empty().append(li_span)
        }
      }
    },url)
  }

  

  function Move(obj) {
    $(obj).addClass("active").siblings().removeClass("active");
    var index = $(obj).index(); //获取索引号
    $(".tab_list .main").eq(index).addClass("selected").siblings().removeClass("selected");
  }


// 职业/龙神切换
function slice(obj) {
  var index = $(obj).index(); //获取索引号
  if(index==0){
    $(obj).parent().addClass('active')
  }else{
    $(obj).parent().removeClass('active')
  }
  $(".page2 .main").eq(index).addClass("selected").siblings().removeClass("selected");
  var mySwiper2 = new Swiper ('.longSheng', {
    navigation: {
      nextEl: '.dd',
      prevEl: '.cc',
    },
  
  }) 
}
// 手风琴
$('.page3 .list').click(function(){
  $(this).hide().parent().addClass('active').siblings().removeClass('active').find('.list').show()
  })
  //列表页tab
function tabNews(obj) {
  localStorage.removeItem('current')
  $(obj).addClass("active").siblings().removeClass("active");
  var index = $(obj).index(); //获取索引号
  $(".right .main").eq(index).addClass("selected").siblings().removeClass("selected");
  pagination()
  
}
if(!$('.ios_code img').attr('src')){
  $('.ios_code img').hide().after('<div style="width:105px;height:104px;background:#fff; line-height:105px;text-align:center;margin-bottom:2px;">敬请期待</div>')
}
//是否有ios链接
$('.down,.left .download').click(function(e){
  if(!$('.ios_down').attr('href')){
    e.preventDefault();
    alert('敬请期待')
  }
})
$('.down .android_down,.left .download .android_down').click(function(e){
  e.stopPropagation()
})



$('.gift_wrap').click(function(){
  $('.login-layer').show();
  var logined=localStorage.getItem('logined')
  if(logined){
    $('#gift').show();
    $('#gift span').text(logined)
  }else{
    $('#login').show();
  }
})

$('.navbar .Attention').hover(function(){
  $('.navbar .wrap').show()
},function(){
  $('.navbar .wrap').hide()
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

function getLocalTime(sj)
{
  var now = new Date(sj*1000);
  var   year=now.getFullYear();    
  var   month=now.getMonth()+1;    
  var   date=now.getDate();    
  return   year+"-"+month+"-"+date;   
     
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




 
   
  
