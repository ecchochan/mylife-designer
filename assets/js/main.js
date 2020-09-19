import { makeCurtains }  from './curtain.js';
import {styler} from "./styler.min.js";
const Canvg = canvg.Canvg;
/*

  Configurations

*/

var DEBUG = false;

var CARDS_PER_PAGE = 6;
var MAX_AUDIO_VOL = 0.7;

var WHATSAPP_TEL = "+85261404750";

const urlParams = decodeURI(window.location.search)
.replace('?', '')
.split('&')
.map(param => param.split('='))
.reduce((values, [ key, value ]) => {
  values[ key ] = value
  return values
}, {});
DEBUG = urlParams.debug

/** 

  Utils

**/

var counter = [0,0,0,0,0];
var colors = "abdfbd,ffcfcd,aecfde,ffdc99,ccffff".split(',');
var sharable_link;
var best_type;

const get_best_type = ()=>{

  var all_chosen = CARDS.filter(e=>e.chosen).map(e=>e);

  var counter_ = all_chosen.reduce((acc, curr)=>(acc[curr.type] ? acc[curr.type]++ : acc[curr.type] = 1)&&acc, {});
  Object.keys(counter_).forEach(k=>counter[k]=counter_[k]);
  var total = all_chosen.length;
  var inner = document.querySelector('result-description-inner');
  
  var rows = Array.from(doc.querySelectorAll('row'));
  rows.sort((a,b)=>parseInt(a.getAttribute('data-type')) == parseInt(b.getAttribute('data-type'))? 0: (parseInt(a.getAttribute('data-type')) > parseInt(b.getAttribute('data-type')) ? 1 : -1));

  rows.forEach((e,i)=>{
    e.dtype = i;
    e.score = counter[i];
    e.querySelector('left h1').innerHTML = (parseInt((counter[i] / total)*100))+ '<span font-smaller>%</span>' + ``;
    
    var history = e.querySelector('.chosen-history');
    if (history){
      var this_chosen = all_chosen.filter(e=>e.type == i);
      if (this_chosen.length == 0){
        history.nextElementSibling.remove();
        history.remove();
      }else{
        history.nextElementSibling.innerHTML = "";
        this_chosen.forEach(e=>{
          var li = doc.createElement('li');
          li.setAttribute('en', e.name.en);
          li.setAttribute('zh', e.name.zh);
          history.nextElementSibling.appendChild(li)
  
        })
        setLang();
      }

    }
    
  });

  rows.sort((a,b)=>a.score == b.score? 0: (a.score < b.score ? 1 : -1))
  doc.querySelectorAll('left h1').forEach((e, i)=>{
    var p = parseInt((counter[i] / total)*100)
    e.innerHTML = (p)+ '<span font-smaller>%</span>';
  })


  rows.forEach(e=>inner.appendChild(e));
  inner.appendChild(doc.getElementById('result-credit'));
  best_type = rows[0].dtype;
  document.getElementById('body').setAttribute('best_type', ''+best_type);
  var TYPE = CARDS_TYPES[best_type];
  
  var encoded = all_chosen.reduce(
    (e, x, i)=>{
      var temp = new BigNumber('1');
      for (var j=0; j<i; j++)
        temp = temp.multipliedBy(encoded_expand_base)
      temp = temp.multipliedBy(x.id)
      return e.plus(temp)
    }, new BigNumber('0')
  ).toString(encoded_base);
  sharable_link = window.location.origin+'/'+TYPE.code+'-'+current_lang+'?d='+encoded;
  return best_type;
}



const hide_footer2 = ()=>{
  var footer2 = doc.querySelector('#body .footer2');
  var footer3 = doc.querySelector('#body .footer3');
  footer2.style.opacity = 0;
  footer3.style.opacity = 0;
  footer3.style.pointerEvents = "none";
  setTimeout(()=>{
    // footer2.style.display = "none";
    // footer3.style.display = "none";
  }, 1000)
}



function getRandomSubarray(arr, size) {
  if (size === undefined)size = arr.length;
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  var ret = shuffled.slice(0, size);
  i = 0;
  while (ret.length < 0)
    shuffled.push(arr[Math.floor((arr.length) * Math.random())])
  return ret;
  
}


function requestFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
      return clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
      document.body.appendChild(textarea);
      textarea.select();
      try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
      }
      catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
      }
      finally {
          document.body.removeChild(textarea);
      }
  }
}

var pointerEventToXY = function(e){
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.originalEvent?(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]):e.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  return out;
};
document.querySelectorAll('.fullscreen').forEach(e=>{
  e.addEventListener('click',requestFullScreen);
  e.addEventListener('touchstart',requestFullScreen);
})

function min(a, b) {
  if (b === undefined)
    return 
  return a > b ? b : a;
}

function max(a, b) {
  return a > b ? a : b;
} 
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
Array.prototype.sum = function() {
  return this.reduce((a, b)=>(a+b), 0);
};

Object.defineProperty(Array.prototype, 'shuffle', {
  value: function() {
      for (let i = this.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this[i], this[j]] = [this[j], this[i]];
      }
      return this;
  }
});

const mix = function(a, b, p, h, k) {
  var d = k - h;
  if (p - h > 0) {
    p = (p - h) / d;
    if (p > 1) p = 1;
    if (p < 0) p = 0;
    return a * (1 - p) + b * p
  }
  return a
}

function getLinkWhastapp(number, message) {
  return 'https://api.whatsapp.com/send?phone=' + number + '&text=' + encodeURI(message);
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a) => {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

const chunks = (arr, len) => {
  var ret = [], i = 0, n = arr.length;
  while (i < n)
    ret.push(arr.slice(i, i += len));
  return ret;
}

var doc = document;

const encode = (str)=>encodeURIComponent(btoa(unescape(encodeURIComponent(str))));
const decode = (str)=>atob(str);
const hash = (str)=>btoa(unescape(encodeURIComponent(str))).replace(/^=+|=+$|[\+/]/g, '').substr(0,5);


const getBgImageDim = (elem) => {
  var imageSrc = elem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
  var image = new Image();
  image.src = imageSrc;
  var width = image.width,
      height = image.height;
  return {width:width, height:height}
}
window.getBgImageDim = getBgImageDim;

/*

  Debug

*/

var LOGT_STYLE = 'padding:0.3em 0.7em;background: #ddd; color: #000;font-weight:900;';
var LOG = console.log;
var LOGT = (e) => console.log('%c' + e, LOGT_STYLE);
function assert(condition, message) {
  if (!condition) {
      throw message || "Assertion failed";
  }
}

if (!DEBUG){
  doc.getElementById('debug').remove();
}else{
  doc.getElementById('debug').style.display = "";
}












/*

  Actual vh for css

*/

const BODY_MIN_WIDTH = 480;
const BODY_MAX_WIDTH = 480;
const BODY_MAX_HEIGHT = 640;
const scale_to_fit_parent = ()=>{
  doc.querySelectorAll('[scale-to-fit-parent-width]').forEach(e=>{
    var ratio = e.parentElement.clientWidth / e.clientWidth;
    var ratio2 = e.parentElement.clientHeight / e.clientHeight;
    if (ratio <= ratio2)
      ratio = ratio2
    e.scale = ratio;
    e.style.transform = "translateX("+(e.translateX || "0px")+")" + ' scale('+(e.scale || 1)+')';
  })
  doc.querySelectorAll('[scale-to-fit-parent-width-middle]').forEach(e=>{
    var ratio = e.parentElement.clientWidth / e.clientWidth;
    var ratio2 = e.parentElement.clientHeight / e.clientHeight;
    if (ratio <= ratio2)
      ratio = ratio2
    e.scale = ratio;
    e.style.position = "absolute";
    e.style.left = "50%";
    e.style.top = "50%";
    e.style.transform = "translate(-"+(e.clientWidth/2)+"px, -"+(e.clientHeight/2)+"px)"+' scale('+( e.scale || 1)+')';
  });
  doc.querySelectorAll('[scale-to-fit-parent-width-middle-bottom]').forEach(e=>{
    var ratio = e.parentElement.clientWidth / e.clientWidth;
    var ratio2 = e.parentElement.clientHeight / e.clientHeight;
    if (ratio <= ratio2)
      ratio = ratio2
    e.scale = ratio;
    e.style.position = "absolute";
    e.style.transformOrigin = "center bottom ";
    e.style.left = "50%";
    e.style.bottom = "0";
    e.style.transform = "translate(-"+(e.clientWidth/2)+"px, -"+(0)+"px)"+' scale('+( e.scale || 1)+')';
  });
  doc.querySelectorAll('[scale-to-fit-parent-width-middle-top]').forEach(e=>{
    var ratio = e.parentElement.clientWidth / e.clientWidth;
    var ratio2 = e.parentElement.clientHeight / e.clientHeight;
    if (ratio <= ratio2)
      ratio = ratio2
    e.scale = ratio;
    e.style.position = "absolute";
    e.style.transformOrigin = "center top ";
    e.style.left = "50%";
    e.style.top = "0";
    e.style.transform = "translate(-"+(e.clientWidth/2)+"px, -"+(0)+"px)"+' scale('+( e.scale || 1)+')';
  });

  doc.querySelectorAll('[scale-to-fit-parent-height]').forEach(e=>{
    var ratio = e.parentElement.clientHeight / e.clientHeight;
    var ratio2 = e.parentElement.clientWidth / e.clientWidth;
    if (ratio <= ratio2)
      ratio = ratio2
      e.scale = ratio;
      e.style.transform = "translateX("+(e.translateX || "0px")+")" + ' scale('+(e.scale || 1)+')';
  })
}

function update_vh() {
  scale_to_fit_parent();

  let _height = window.innerHeight;
  let _width = window.innerWidth;
  let height = _height;
  let width = _width;


  let scale = 1;
  if (width > BODY_MAX_WIDTH){
    document.getElementById('body').style.width = BODY_MAX_WIDTH+"px"
    document.getElementById('body').style.marginLeft = parseInt((width - BODY_MAX_WIDTH) /  2) + 'px';
    width = BODY_MAX_WIDTH;

  }else{
    document.getElementById('body').style.width = ""
    document.getElementById('body').style.marginLeft =  '';
  }

  if (height > BODY_MAX_HEIGHT){
    document.getElementById('body').style.height = BODY_MAX_HEIGHT+"px"
    document.getElementById('body').style.marginTop = parseInt((height - BODY_MAX_HEIGHT) /  2) + 'px';
    scale = height/BODY_MAX_HEIGHT
    height = BODY_MAX_HEIGHT;

  }else{
    document.getElementById('body').style.height = ""
    document.getElementById('body').style.marginTop =  '';
    document.getElementById('body').style.transform = '';
    scale = 1
  }

  let ideal_aspect_ratio = 480 / 640;
  let aspect_ratio = _width / _height;
  if (aspect_ratio < ideal_aspect_ratio){
    width = _width / scale;
    document.getElementById('body').style.width = width+"px"
    document.getElementById('body').style.marginLeft = parseInt((_width - width) /  2) + 'px';
  }

  document.getElementById('body').style.transform = scale==1?"":'scale('+scale+')';
  let vh = height * 0.01;
  let vw = width * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
  document.documentElement.style.setProperty('--scale', `${scale}`);
  
  document.documentElement.style.setProperty('--window-height', `${height}px`);
  document.documentElement.style.setProperty('--window-width', `${width}px`);
  document.documentElement.style.setProperty('--window-width-for-font', `${mix(400, 400, width, 330, 480)}px`);

  document.getElementById('zh-title-fix').setAttribute('zh',width < 360?`探索
你的旅程`:`探索你的旅程`)
  setLang(current_lang);
  window.setLang = setLang;

  document.querySelectorAll('[full-width-abs]').forEach(e=>{
    if (e.tagName == "svg")
      e.setAttribute("width", width);
    else
      e.style.width = width + 'px';
  })
  document.querySelectorAll('[full-height-abs]').forEach(e=>{
    if (e.tagName == "svg")
      e.setAttribute("height", height);
    else
      e.style.height = height + 'px';
  })

  window.dispatchEvent(new Event('curtain-resize'));
  
}
var onresize = function (event) {
  update_vh();
};
if (window.attachEvent) {
  window.attachEvent('onresize', onresize);
} else if (window.addEventListener) {
  window.addEventListener('resize', onresize, true);
}
window.update_vh = update_vh



/*

  Langs

*/

var userLang = navigator.language || navigator.userLanguage; 
var isChinese = userLang.indexOf('zh') > -1;
var current_lang = isChinese?'zh':'en';
if (urlParams.lang)
  current_lang = urlParams.lang;
doc.getElementById('app').classList.remove('hidden');
FastClick.attach(doc.body);
var setLang = function(L){
  if (!L)L = current_lang;
  document.getElementById('body').setAttribute('lang',L);
  document.querySelectorAll('[en],[zh]').forEach(e=>{
    var EN = e.attributes['en'];
    var ZH = e.attributes['zh'];
    if (EN) EN = EN.value;
    if (ZH) ZH = ZH.value;
    if ((L == 'en' && EN) || (L == 'zh' && !ZH)){
      
      EN = EN
           .replace(/\{(.*?)\}/g,(r)=>e.getAttribute(r.slice(1,-1))|| eval(r.slice(1,-1)))
           .replace(/\\n/g, '<br/>')
           .replace(/c/g,'<span fix-c>c</span>');
      if (e._content != EN){
        e._content = EN;
        if (EN.indexOf('<span')>=0 || EN.indexOf('<br/>')>=0)
          e.innerHTML = EN;
        else
          e.textContent = EN;

      }
        
    }
    if ((L == 'zh' && ZH) || (L == 'en' && !EN)){

      ZH = ZH
           .replace(/\{(.*?)\}/g,(r)=>e.getAttribute(r.slice(1,-1))|| eval(r.slice(1,-1)))
           .replace(/\\n/g, '<br/>')
           .replace(/c/g,'<span fix-c>c</span>');
      if (e._content != ZH){
        e._content = ZH;
        if (ZH.indexOf('<span')>=0 || ZH.indexOf('<br/>')>=0)
          e.innerHTML = ZH;
        else
          e.textContent = ZH;
      }
    }
  })
  window.dispatchEvent(new Event('set-lang'));

}

doc.addEventListener("DOMContentLoaded", function(){
  setLang(current_lang);
  update_vh();
});

if (true){
  var touched = false;
  document.querySelectorAll('#lang-switcher > span').forEach(e=>{
    e.classList.remove('display-none');
    let g = function(e){
      if (e.type == 'touchstart') touched = true;
      if (e.type == 'click' && touched) return;
      document.querySelectorAll('#lang-switcher > span').forEach(e=>e.classList.remove('display-none'));
      this.classList.add('display-none');
      setLang(this.getAttribute('data-lang'));
      current_lang = this.getAttribute('data-lang');
  
    }
    e.addEventListener('click',g)
    e.addEventListener('touchstart',g);
  });
  document.querySelector('#lang-switcher > span').classList.add('display-none');
  
  if (current_lang == 'zh'){
    document.querySelector('#lang-switcher > span:not([class])').click();
  }
}

/*

  Check for mobile

*/


window.mobilecheck = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};



/*

  Data

*/

var CARDS_RAW = `!內在滿足;;Intrinsic satisfaction
精神層面上的\u200b滿足;;Mentally satisfied
與神有親密連繫;;Closely connected with God
持續的認識自我;;Continuous \u200bself-exploration
擁有自我內心的\u200b空間;;Have an inner space 
安全感;;Sense of security
內心的平靜;;Have an inner peace 
新鮮感;;Sense of freshness
感到自在;;Feel comfortable 

!人際關係;;Inter-personal relationship
擁有自在舒適的\u200b人際關係;;Get a comfortable \u200binter-personal \u200brelationship
美滿婚姻;;Happy marriage
有交心知己;;Have best friend forever
有親近的好朋友;;Have good friends
親密的家庭;;A close family 
孝順父母;;Filial piety
和一群人一起打拼;;Work hard with others
讚賞及鼓勵別人;;Appreciate and \u200bencourage others
有意義的愛情;;A meaningful \u200blove-relationship  
幫助別人;;Help others

!物質享受;;Materialistic
有車 / 有樓;;Own a car/house
賺大錢;;Be wealthy
時尚的打扮;;Fashionable \u200bdress up
錢夠用 \u200b(沒有經濟上的\u200b擔憂);;Sufficient amount of money \u200b(without financial burden)
追上科技潮流;;Catch up on technology   
建立社會地位;;Have social status
環遊世界;;Travel around the world
食盡美食;;Enjoy food

!生活模式;;Life style
簡簡單單的生活;;Simple life
參加藝文青活動;;Participate art and \u200bcultural activities 
親親大自然;;Enjoy nature
人生充滿樂趣;;Interesting life
多姿多彩的生活;;Fruitful life
參與宗教、政治、\u200b社團活動;;Participate in religions, \u200bpolitics and/or \u200bdifferent societies
什麼事都不做;;Do nothing
規律的生活;;Regular daily life
安穩的工作;;Stable job
享受獨處的時光;;Enjoy being alone 
做自己喜歡的事;;Do what you like
持續地學習;;Continuous learning 
休息與放鬆;;Rest and relaxing
運動;;Exercises
擁有健康;;Be healthy
長久的生命;;A long life
為夢想奮鬥;;Work hard on your dream
冒險與刺激;;Adventure and excitement
成為眾人焦點;;Be the focus of everyone 
做善事;;Do good deed
擁有自由;;Have freedom
做自己;;Be yourself 
生小朋友;;Have kids
有意義的工作;;A meaningful job

!自我形象;;Self-image 
誠實正直;;Integrity
心地善良;;Kind-hearted 
公平、公正;;Be fair and impartial 
擁有純潔及\u200b真摯的心;;Be pure and true
勇於改變;;Dare to Change 
有自信;;Confident
有正義感;;Have a sense of justice
義氣仔女;;Be loyal to friends 
腳踏實地;;Be practical and \u200bdown-to-earth
勇於接受挑戰;;Dare to accept challenge
努力向上;;Hard-working
用心/盡力做事;;Do your best on everything
有美感;;Be aesthetic 
開放性的思維;;Open minded
寛容;;Tolerance 
廣闊的視野;;Have wide horizon
獨立自主;;Independence
有影響力;;Be an influential person
事業有成;;Successful in your career
能夠發揮所長;;Able to use your talent
擁有一己之長;;Have your own talent`

var SEP = ';;';
var LANGS = ["zh","en"];
var CARDS_NUM_LANGS = LANGS.length;
var CARDS_TYPES = [];
var CARDS_ITEMS = {};
var CARDS = [];
var _bucket = [];
var _last_type;
CARDS_RAW.split('\n').filter(e=>e.trim()).forEach(e=>{
    var line, dat;
    if (e.startsWith('!')){
        if (_bucket.length > 0)
            CARDS_ITEMS[_last_type] = _bucket
        line = e.substr(1).split(SEP).map(e=>e.trim());
        assert(line.length == CARDS_NUM_LANGS, "invalid data: "+line);
        dat = {
          id: CARDS_TYPES.length,
          name: {}
        }
        LANGS.forEach((e, i)=>{dat.name[e] = line[i];} );
        dat.code = hash(dat.name[LANGS[0]]);
        _last_type = dat.id;
        CARDS_TYPES.push(dat);
    }else{
        line = e.split(SEP).map(e=>e.trim());
        assert(line.length == CARDS_NUM_LANGS, "invalid data: "+line);
        _bucket.push(line);
        dat = {
          id: CARDS.length,
          name: {},
          type: _last_type,
          chosen: false,
          droped: false,
        };
        LANGS.forEach((e, i)=>{dat.name[e] = line[i];} );
        CARDS.push(dat);
    }
});
if (_bucket.length > 0)
    CARDS_ITEMS[CARDS_TYPES[CARDS_TYPES.length-1].id] = _bucket
    
var CARDS_SHUFFLED = CARDS.slice(0);
shuffle(CARDS_SHUFFLED);

var CARDS_CHUNKS = chunks(CARDS_SHUFFLED, CARDS_PER_PAGE);


/*

window.CARDS = CARDS;
window.CARDS_TYPES = CARDS_TYPES;
window.CARDS_ITEMS = CARDS_ITEMS;
window.CARDS_SHUFFLED = CARDS_SHUFFLED;
window.CARDS_CHUNKS = CARDS_CHUNKS;

*/


var encoded_base = BigNumber.ALPHABET.length;
var encoded_expand_base = CARDS.length;
const get_decoded = (encoded)=>{
  var decoded = new BigNumber(encoded,encoded_base);
  var decoded_vals = [];
  for (var j=0; j < 100; j++){
    var mod = parseInt(decoded.modulo(encoded_expand_base).toString());
    if (j > 0 && mod == 0) break;
    decoded_vals.push(mod);
    decoded = decoded.minus(mod).dividedBy(encoded_expand_base);
  }
  return decoded_vals;

}


let d = urlParams.d;
if (d){
  try{
    let decoded = get_decoded(d);
    urlParams.skip = 8;
    decoded.forEach(i=>CARDS[i].chosen=true);

  }catch(err){

  }
}




/*

  Skip

*/

const bgs = Array.from(document.querySelectorAll('[id^="selection"] background')).filter(e=>e).map(e=>e.innerHTML);

const skip = parseInt(urlParams.skip);
if (skip){
  var stages_divs = Array.from(document.getElementById('stages').children);
  stages_divs.splice(1,skip).forEach(e=>{e.remove()});
  document.querySelector('#lang-switcher').classList.add('hidden')
  
}


if (urlParams.chosen || urlParams.num_cards){
  let wanted_type = urlParams.type;
  let debug_chosen_count = 0;
  urlParams.num_cards = urlParams.num_cards || urlParams.chosen || 1;
  getRandomSubarray(CARDS).forEach(e=>{
    if (urlParams.num_cards && debug_chosen_count >= urlParams.num_cards)
      return;
    if (wanted_type !== undefined && e.type != wanted_type)
      return ;

    e.chosen=true;
    debug_chosen_count += 1

  })
}





/*

  Resources Loading

*/
var files01 = `
icon-01.jpg
bg01-bg.jpg
bg01-branch01.png
bg01-branch02.png
bg01-branch03.png
bg01-branch04.png
bg01-branch05.png
bg01-branch06.png
bg01-branch07.png
bg01-branch08.png
bg01-branch09.png
bg01-branch10.png
bg01-branch11.png
bg01-branch12.png
bg01-branch13.png
bg01-branch14.png
bg01-branch15.png
bg01-branch16.png
bg01-branch17.png
bg01-branch18.png
bg01-greens.png
bg01-lotus.png
bg01-wave01.png
bg01-wave02.png`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var files02 = `
icon-02.jpg
bg02-bg.jpg
bg02-cloud-right.png
bg02-leaf01.png
bg02-leaf02.png
bg02-leaf03.png
bg02-ripples01.png
bg02-ripples02.png
bg02-ripples03.png
bg02-ripples04.png
bg02-ripples05.png
bg02-ripples06.png
bg02-ripples07.png
bg02-ripples08.png
bg02-ripples09.png
bg02-ripples10.png
bg02-ripples11.png
bg02-ripples12.png
bg02-ripples13.png
bg02-ripples14.png
bg02-ripples15.png
bg02-ripples16.png
bg02-ripples18.png
bg02-ripples19.png
bg02-ripples20.png
bg02-ripples22.png
bg02-ripples23.png
bg02-ripples24.png
bg02-ripples25.png
bg02-ripples26.png
bg02-seed.png
bg02-track.png`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files03 = `
icon-03.jpg
bg03-bg.jpg
bg03-star.png
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files04 = `
icon-04.jpg
bg04-bg.jpg
bg04-cloud.png
bg04-flower01.png
bg04-flower02.png
bg04-flower03.png
bg04-flower04.png
bg04-flower05.png
bg04-flower06.png
bg04-flower07.png
bg04-flower08.png
bg04-flower09.png
bg04-flower10.png
bg04-flower11.png
bg04-flower12.png
bg04-flower13.png
bg04-flower14.png
bg04-flower15.png
bg04-flower17.png
bg04-flower18.png
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files05 = `
icon-05.jpg
bg05-bg.jpg
bg05-layer01.png
bg05-layer02.png
bg05-snow.png
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files06 = `
luggage.jpg
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files07 = ``.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var files08 = ``.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var files00 = `
contact.jpg
ICYSC.png
buddy-figure-01.png
buddy-figure-02.png
buddy-figure-03.png
buddy-figure-04.png
buddy-figure-05.png
buddy-figure-06.png
contact-button-01.jpg
contact-button-02.jpg
contact-button-03.jpg
contact-button-04.jpg
contact-button-05.jpg
contact-button-06.jpg
cloud-bg.png
cloud01.png
cloud02.png
cloud03.png
cloud04.png
cover-bg.jpg
cover-buddy.png
cover-greens.png
cover-leaf-01.png
cover-leaf-02.png
cover-leaf-03.png
cover-leaf-04.png
cover-stamen-01.png
cover-stamen-02.png
cover-stamen-03.png
cover-wave.png
cover.png
intro.jpg`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var files_stages = `
tick-01.png
tick-02.png
tick-03.png
tick-04.png
tick-05.png
tick-06.png
tick-07.png
tick-08.png`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);
var MUSIC_URL = 'assets/audio/bensound-beyondtheline.mp3';
var files = `
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var card_1_bgs = `
bg01-card-bg-01.png
bg01-card-bg-02.png
bg01-card-bg-03.png
bg01-card-bg-04.png
bg01-card-bg-05.png
bg01-card-bg-06.png
bg01-card-bg-07.png
bg01-card-bg-08.png
bg01-card-bg-09.png
bg01-card-bg-10.png
bg01-card-bg-11.png
bg01-card-bg-12.png
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var card_2_bgs = `
bg02-card-bg-01.png
bg02-card-bg-02.png
bg02-card-bg-03.png
bg02-card-bg-04.png
bg02-card-bg-06.png
bg02-card-bg-07.png
bg02-card-bg-08.png
bg02-card-bg-09.png
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var card_3_bgs = `
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var card_4_bgs = `
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var card_5_bgs = `
`.split('\n').filter(e=>e).map(e=>'assets/img/'+e);

var cards_bgs = [
  card_1_bgs,
  card_2_bgs,
  card_3_bgs,
  card_4_bgs,
  card_5_bgs,
]

if (skip && skip == 8){
  var best_type = get_best_type();
  document.getElementById('body').setAttribute('best_type', ''+best_type);
  files.push.apply(files, files00)
  files.push.apply(files, [files01,files02,files03,files04,files05,][best_type])
}else{
  files.push.apply(files, files00)
  files.push.apply(files, files_stages)
  files.push.apply(files, files01)
  files.push.apply(files, files02)
  files.push.apply(files, files03)
  files.push.apply(files, files04)
  files.push.apply(files, files05)
  files.push.apply(files, files06)
  files.push.apply(files, files07)
  files.push.apply(files, files08)
  cards_bgs.forEach((e, i)=>{
    if ((i+1) >= skip){
      files.push.apply(files, e)
    }

  })

}
/*

  Set Landscape

*/

const LANDSCAPE_BG = 'assets/img/desktop-bg.jpg';
const set_landscape = ()=>{
  var is_landscape = window.orientation != 0;
  if (window.orientation === undefined){
    is_landscape = window.innerHeight < window.innerWidth
  }
  if (is_landscape){
    document.body.setAttribute('is-landscape', '');
    document.querySelector('landscape-hint bg image').setAttributeNS("http://www.w3.org/1999/xlink", 'href',LANDSCAPE_BG)
  }else
    document.body.removeAttribute('is-landscape');

}
window.addEventListener("orientationchange", set_landscape, false);
set_landscape();
if (window.matchMedia("(orientation: portrait)").matches) {
  document.body.removeAttribute('is-landscape');
}

if (window.matchMedia("(orientation: landscape)").matches) {
  document.body.setAttribute('is-landscape', '');
  document.querySelector('landscape-hint bg image').setAttributeNS("http://www.w3.org/1999/xlink", 'href',LANDSCAPE_BG)
}


var files_loaded = 0;
var files_total = files.length;

var load_counter = doc.getElementById('load-percent');
var load_wrapper = doc.getElementById('loading-wrapper');
var files_obj = {}


var increment_files_loaded = function (e) {
  load_counter.textContent = files_total?parseInt(++files_loaded / files_total * 100):100;
  files_obj[e.item.id] = e.result
  if (e.item.id == 'assets/img/contact.jpg'){
    let img = doc.querySelector('#loading-bg image');
    img.setAttributeNS("http://www.w3.org/1999/xlink", 'href', 'assets/img/contact.jpg');
    doc.querySelector('#loading-bg background').style.opacity = 1;
    // doc.getElementById('loading-wrapper').style.backgroundImage = 'url(assets/img/contact.jpg)';
  }
  if (files_loaded == files_total){
    start();
    update_vh();
    /*

      Fix old browser for unable to infer height/width automatically when not specified

    */
    const closest = (e, x)=>{
        while (e && e.tagName != x)
            e = e.parentElement;
        return e

    }
    document.querySelectorAll('image').forEach(e=>{
      var src = e.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      var src = e.getAttribute('data-href');
      var obj = files_obj[src];
      if (!obj) return;
      e.setAttributeNS("http://www.w3.org/1999/xlink", 'href', e.getAttribute('data-href'));
      var real_size = obj;
      var w = e.getAttribute('width');
      var h = e.getAttribute('height');
      // var container = closest(e,'SVG');

      h = h?parseFloat(h):h;
      w = w?parseFloat(w):w;
      if (w && h) return;
      if (!w) e.setAttribute('width', (real_size.width * h / real_size.height) + 'px');
      if (!h) e.setAttribute('height', (real_size.height * w / real_size.width) + 'px');
      
    })

    const svgs = document.getElementById('svgs');
    cards_bgs.forEach((e, i)=>e.forEach(card_bg=>{
      if ((i+1) < skip)
        return;
      
      var image = document.createElementNS('http://www.w3.org/2000/svg', 'image')
      image.setAttributeNS("http://www.w3.org/1999/xlink", 'href',card_bg)
      image.setAttribute('id', card_bg.split('/').slice(-1)[0].split('.')[0])
      image.setAttribute('width', "100px")
      image.setAttribute('height', "100px")
      svgs.appendChild(image)
    }))
    document.querySelectorAll('[data-href]').forEach(e=>e.setAttributeNS("http://www.w3.org/1999/xlink", 'href', e.getAttribute('data-href')));

        
    if (skip != 8)
      setTimeout(e=>{
        document.querySelector('.font_preload').classList.add('tick')
      },1000)

  }
};
var preload = new createjs.LoadQueue(false);
preload.setMaxConnections(100);
preload.addEventListener("fileload", increment_files_loaded);
preload.addEventListener("complete", function(e){
});
preload.loadManifest(files.map(e=>{return{"id":e, "src":e, "timeout": 100000000, "loadTimeout": 100000000}}));

if (files_total == 0)
  document.addEventListener("DOMContentLoaded", increment_files_loaded);



/*

  Resources Loading

*/

const id_seen = new Set();
const makeid = ()=>{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  if (id_seen.has(text))
    return makeid()
  id_seen.add(text);
  return text;
}

const prefixes = ['-webkit-','-moz-','-o-','-webkit-',''];
const generate_css = (config)=>{
  var name = 'animation_'+ makeid();
  var rotate = config.rotate;
  var opacity = config.opacity;
  var scale = config.scale;
  var translateX = config.translateX;
  var translateY = config.translateY;
  var attr;
  var frames = [];
  var reverse = config.reverse
  
  var content = (config.direction=='alternate'?
                  [[reverse?1:0,0],[reverse?0:1,50],[reverse?1:0,100]]:
                  [[reverse?1:0,0],[reverse?0:1,100]]).map(e=>{
      var i=e[0];
      var percent=e[1];
      var attrs = [];
      if (rotate)attrs.push(`rotate(${rotate[i]}deg)`);
      if (scale)attrs.push(`scale(${scale[i]})`);
      if (translateX)attrs.push(`translateX(${translateX[i]}px)`);
      if (translateY)attrs.push(`translateY(${translateY[i]}px)`);
      var attr = attrs.join(' ')
      return (
        percent+
        '%{'+
        (attr?(prefixes.map(p=>`${p}transform:${attr}`).join(';')):"")+
          (opacity?`opacity:${opacity[i]}`:"") + '}')
  }).join('');
  return [name, prefixes.map(p=>`@${p}keyframes ${name}{${content}}`).join('\n')];
}
const EASINGS = {
  linear: 'linear',
  swing: 'cubic-bezier(0.5, 0, 0.5, 1)'
}
const apply_css_from_animejs_config = (elem, config)=>{
  var name_class = 'animation_'+ makeid();
  var css = generate_css(config);
  var css_name = css[0];
  var css_keyframes = css[1];
  config.duration *= 1.5;
  config.seek *= 1.5;
  var timeing_func = EASINGS[config.easing || 'linear'];
  var css_elem = prefixes.map(p=>`${p}animation: ${config.duration||0}ms ${timeing_func} -${config.seek||0}ms infinite running ${css_name};`).join('');
  var transformOrigin = elem.style.transformOrigin;
  if (transformOrigin){
    elem.style.webkitTransformOrigin = transformOrigin;
    elem.style.mozTransformOrigin = transformOrigin;
    elem.style.msTransformOrigin = transformOrigin;
    elem.style.oTransformOrigin = transformOrigin;
  }
  styler(name_class,css_keyframes+`.${name_class}{${css_elem}}`)
  elem.classList.add(name_class);

}
const activate_bg_animation = (background) =>{
  if (!background) return;
  var animes = background.querySelectorAll('[anime]');
  animes.forEach(e=>{
      var args = eval('('+e.getAttribute('anime')+')');
      apply_css_from_animejs_config(e,args);

      return;
      try{
        if (args.easing == 'swing'){
          args.easing = "easeInOutQuint"

        }
        args.targets = e;
        args.autoplay = false;
        var animation = anime(args);
        e.anime = animation;
        if (args.seek)
          animation.seek(args.seek)
        animation.play();

      }catch(err){
        LOG(err)
        LOG(e)

      }
  })
}

const deactivate_bg_animation = (background) =>{
  if (!background) return;
  var animes = background.querySelectorAll('[anime]');
  animes.forEach(e=>{
    Array.from(e.classList).forEach(c=>{
      if (c.startsWith('animation_'))
        e.classList.remove(c);
      
    })
    if (e.anime){
      anime.remove(e)

    }
  })
}
window.activate_bg_animation = activate_bg_animation;
window.deactivate_bg_animation = deactivate_bg_animation;

var goNextFade = function(delay, targets, callback){
  anime({
    targets: targets,
    opacity: 0,
    duration: 750,
    easing: 'easeOutQuad',
    delay: delay,
    complete: function (anim) {
      targets.remove();
      callback();
    }
  });

}
var MOUSE = {
  x:0,
  y:0
}
function isMouseInBox(e) {
  MOUSE.x = e.pageX;
  MOUSE.y = e.pageY;
}

document.addEventListener('mousemove', function(e){
    isMouseInBox(e);
})




var volumeButton = doc.getElementById('volume');
var volumeSwitchContainer = volumeButton.querySelector('.switchContainer');

var audio = new Howl({
  src: [MUSIC_URL],
  loop: true,
  html5: true,
  volume: MAX_AUDIO_VOL
});
window.audio = audio;

audio.once('load', function(){
  audio_canplaythrough = true;
  if (audio_can_start){
    playMusic();
  }
});


var audio_can_start = false;
var audio_canplaythrough = false;
var AUDIO_ON = volumeSwitchContainer.classList.contains('switchOn');
var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
var current_volume = MAX_AUDIO_VOL;
var setVolume = (v)=>{
  Howler.volume(v);
  current_volume = v;
};

var playMusic = ()=>{
  if (!audio.playing()){
    Howler.volume(current_volume);
    audio.play();

  }
}
window.playMusic = playMusic;
var volume_recent = 0;
var toggleMusic = ()=>{
  var t = + new Date();
  if (t - volume_recent < 300)
    return
  
  volume_recent = t;

  if (AUDIO_ON) {
    AUDIO_ON = false;
    setVolume(0);
    audio.pause();
    volumeSwitchContainer.classList.remove('switchOn');
    volumeSwitchContainer.classList.add('switchOff');
  }else{
    AUDIO_ON = true;
    setVolume(MAX_AUDIO_VOL);
    audio.play();
    volumeSwitchContainer.classList.add('switchOn');
    volumeSwitchContainer.classList.remove('switchOff');
  }
}
volumeButton.onclick = toggleMusic;
volumeButton.ontouchstart = toggleMusic;

(function() {
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide
    = window.onfocus = window.onblur = onchange;

  function onchange (evt) {
    var v = "visible", h = "hidden",
        evtMap = {
          focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
        };

    evt = evt || window.event;
    var visible = false;
    if (evt.type in evtMap)
      visible = evtMap[evt.type] == "visible";
    else
      visible = !this[hidden];

    if (visible && AUDIO_ON){
      audio.play();
    }else{
      audio.pause();
    }
      
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if( document[hidden] !== undefined )
    onchange({type: document[hidden] ? "blur" : "focus"});
})();


/*
    Start
*/

var start = function () {
  // document.querySelectorAll('[data-href]').forEach(e=>e.setAttributeNS("http://www.w3.org/1999/xlink", 'href', e.getAttribute('data-href')))
  
  goNextFade(0, load_wrapper, e => {
    if (!skip){{
      curtains[0].show();
      curtains[0].nextClick.push(e=>{
      })
    }
    }
  });
  if (skip){
    curtains[0].show();
    curtains[0].endCurtain(true);
    deactivate_bg_animation(doc.getElementById('intro').querySelector('background'));
    activate_bg_animation(doc.getElementById('intro').querySelectorAll('background')[1]);
    setTimeout(update_vh,100)
    document.getElementById('float-top-right').classList.remove('hidden');
    playMusic();

  }
}



/*
    Stage Defaults
*/

const FADE_DURATION = DEBUG?0:200;

const defaultNextCutain = (self) => {
  return [function () {
    var nextCurtain = self.obj.querySelector('.curtain-page');
    //deactivate_bg_animation(self.obj.querySelector('background'));
    if (nextCurtain) {
      activate_bg_animation(nextCurtain.querySelector('background'));
      nextCurtain.curtain.show();
      nextCurtain.curtain.nextFrame.push(update_vh);
    }
  }, self.opened ? 0 : 500];
}

const sleep = (t)=> {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, DEBUG?0:t);
  })
  
}



/*

  Auto-spawn Selection Stages

*/

/*
var cardSelectionTemplate = doc.getElementById('selection-1');
/*
var divClone;
var i = 1;
for (var i = 2; i <= 4; i++){
  divClone = cardSelectionTemplate.cloneNode(true);
  divClone.id = 'selection-'+i;
  cardSelectionTemplate.parentNode.insertBefore(divClone, cardSelectionTemplate.nextSibling);

}
*/


/*
  Curtain Behaviour

  default: function (self) {
      var obj = self.obj
      setTimeout(function () {
        var nextCurtain = obj.querySelector('.curtain-page');
        if (nextCurtain) nextCurtain.curtain.show();

      }, self.opened ? 0 : 500);
    }

*/


const timeline = function(frames){
  if (frames.length == 0) return;
  var index = 0;
  var frame = frames[0];
  const handler = (result)=>setTimeout(()=>consumer(result), frame.duration || frame[1] || 0);
  const consumer = function(result){
    var func = frame.func || frame[0] || frame;
    var ret;
    if (typeof func === 'function')
      ret = func(result);
    else
      throw "timeline contains non-callable elements";
     
    index += 1;
    if (index < frames.length){
      frame = frames[index];
      if (ret && ret.then)
        ret.then((result)=>handler(result))
      else
        handler();
    }
  }
  handler();
}

const fadeIn = (selector, duration)=>{
  if (!DEBUG)
    duration = duration || FADE_DURATION;
    
  var animation = anime.timeline({
    targets: selector,
    delay: anime.stagger(duration || FADE_DURATION),
    easing: 'linear',
  }).add({
    opacity: 1,
  });
  if (DEBUG)
    return;
  return animation.finished;
}

window.intro_next = function (self){
  document.querySelector('html').style.background = self.obj.style.background
  var obj = self.obj;
  timeline([
    ()=> audio_can_start=true,
    ()=> audio_canplaythrough?document.getElementById('float-top-right').classList.remove('hidden'):0,
    ()=> document.querySelector('#lang-switcher').classList.add('hidden'),
    ()=> hide_footer2(),
    ()=> sleep(500),
    ()=> playMusic(),
    ()=> sleep(500),
    ()=> deactivate_bg_animation(doc.getElementById('intro').querySelector('background')),
    ()=> fadeIn('#intro-tran-text p', 600),
    ()=> sleep(200),
    defaultNextCutain(self)

  ])
}


const intro_drags = Array.from(document.querySelectorAll('#intro [drag]')).map(e=>[e, parseInt(e.getAttribute('drag'))]);
window.coverUpdate = (self, p, p2)=>{
  intro_drags.forEach(e=>{
    var t = e[0];
    var drag = e[1];
    t.translateX = -drag*p2+"px";
    t.style.transform = "translateX("+t.translateX+")" + ' scale('+(t.scale || 1)+')';
  })
}



/*
    Stage Trigger
*/

var current_cards_i = 0;
var recent_touch = 0;
var no_click = false;

// for safari, this event not working under clip-path
// click event is dispatched even user clicks on
// somewhere that is not masked (that is hidden by mask)
var current_stage = 0;
function is_hidden(el) {
  return (el.offsetParent === null)
}
const card_click_listener = function(e){
  var is_scroll = false;
  var scroll_up = false;
  if (no_click && e.type == 'click')
    return;
  var cursor = pointerEventToXY(e);
  if (e.type == 'touchend'){
    if (last_start_cursor !== null && Math.sqrt(Math.pow(cursor.x - last_start_cursor.x,2) + Math.pow(cursor.y - last_start_cursor.y,2)) > 20){
      is_scroll = true
      scroll_up = last_start_cursor.y < cursor.y;

    }
  }
  var this_touch = + new Date();
  if (this_touch - recent_touch < 50)
    return;
  recent_touch = this_touch;
  last_start_cursor = null;



  var cards = Array.from(doc.querySelectorAll('card'));
  

  if (!is_scroll){
    cards.forEach(e=>{
      if (is_hidden(e))return;
      var bbox = e.getBoundingClientRect();
      if (cursor.x < bbox.x || cursor.y < bbox.y) return;
      if (cursor.x > bbox.x + bbox.width || cursor.y > bbox.y + bbox.height) return;
      // clicked card
      e.classList.toggle('chosen');
      var card_id = parseInt(e.id);
      var card = CARDS[card_id];
      card.chosen = !card.chosen;
      n_chosen_at_last += card.chosen?1:-1;
      setLang();

      window.dispatchEvent(new Event('card-clicked'));
    
    })
  }
  
  if (current_stage == 8){


    /*
    if (!is_scroll){
      var u = e.target;
      while (u && u.tagName != "LEFT")
        u = u.parentElement;
  
      if (u){
        LOG(u);
        u.parentElement.classList.toggle('show-cards');
        return;

      }
    }*/



    var u = e.target;
    while (u && u.tagName != "RESULT-DESCRIPTION")
      u = u.parentElement;
    
    if (u){
      var container = document.querySelector('result-container');
      if (is_scroll){
        if (container.classList.contains('active')){
          if (!(document.querySelector('result-description').scrollTop <= 0 && scroll_up))
            return;
          
        }else if (scroll_up){
          return
        }
      }
      // if (!is_scroll && container.classList.contains('active'))
      //   return;
      
      document.querySelector('result-description').scrollTop = 0
      
      container.classList.toggle('active');
  
      if (container.classList.contains('active'))
        doc.body.setAttribute('float-higher','');
      else
        doc.body.removeAttribute('float-higher');
        
    }
    var u = e.target;
    while (u && u.tagName != "LEARN-MORE")
      u = u.parentElement;
    
    if (u){
      var container = document.getElementById('result');
      if (is_scroll)return;
      container.classList.toggle('switch')
      document.body.classList.toggle('credit')
    }

    var u = e.target;
    while (u && !u.classList.contains('contact-us'))
      u = u.parentElement;
    
    if (u){
      if (is_scroll && !document.querySelector('.contact-us-opened'))return;

      var t = e.target;
      var popup = document.querySelector('popup');
      var opened = popup.classList.contains('opened');
      while (true){
        if (!t) break;
        if (t.classList.contains('contact-us-button'))
          break
        t = t.parentElement;
      }
      
      
      if (!is_scroll && t && document.querySelector('.contact-us-opened')){

        var channel = popup.last_contact_us.getAttribute('contact-us-channel');
        var p = t.querySelector('p');
        if (p){
          var chat_about = p.getAttribute(current_lang+'-text') || p.getAttribute(current_lang);
          var send_text = "";
          if (current_lang == 'zh')
            send_text = "我想傾吓"+ chat_about.replace(/\\n/g, '') + "。";
          else
            send_text = "I want to talk about " + chat_about +'.';

          send_text += "\n" + sharable_link;


          if (channel == 'whatsapp'){
            var link = getLinkWhastapp(WHATSAPP_TEL, send_text);
            var win = window.open(link, '_blank');
            win.focus();

          }else if (channel == 'telegram'){
            var link = 'https://t.me/taliphoneservice';
            copyToClipboard(send_text);
            var prompt;
            if (current_lang == 'zh')
              prompt = '已將文字信息複製，請在打開 Telegram 後貼上信息！'
            else
              prompt = 'Contact message is copied! You can paste it after Telegram is opened!'

            alert(prompt);
            var win = window.open(link, '_blank');
            win.focus();

          }
          return;
          
        }


      }     
      
      var offset = doc.getElementById('app').getBoundingClientRect();
      var scale = parseFloat(document.documentElement.style.getPropertyValue('--scale') || 1);
      var center;
      

      if (!opened){
        center = {
          x: (cursor.x - offset.x) / scale,
          y: (cursor.y - offset.y) / scale,
          
        };
        popup.style.transition = "";
        popup.style.clipPath = "circle(0% at "+center.x+"px "+center.y+"px)";
        popup.style.webkitClipPath = "circle(0% at "+center.x+"px "+center.y+"px)";
        popup.offsetHeight; // no need to store this anywhere, the reference is enough
        popup.style.transition = "all 2s cubic-bezier(0.2, 0.9, 0.25, 1)";
        popup.style.clipPath = "circle(150% at "+center.x+"px "+center.y+"px)";
        popup.style.webkitClipPath = "circle(150% at "+center.x+"px "+center.y+"px)";
        popup.style.pointerEvents = "all";

      }else{
        var bbox = popup.last_contact_us.getBoundingClientRect();
        center = {
          x: (bbox.x+bbox.width/2 - offset.x) / scale,
          y: (bbox.y+bbox.height/2 - offset.y) / scale,
          
        };
        popup.style.transition = "all 1s cubic-bezier(0.2, 0.9, 0.25, 1)";
        popup.style.clipPath = "circle(0% at "+center.x+"px "+center.y+"px)";
        popup.style.webkitClipPath = "circle(0% at "+center.x+"px "+center.y+"px)";
        popup.style.pointerEvents = "none";


      }

      popup.classList.toggle('opened')

      document.getElementById('result').classList.toggle('contact-us-opened')
    

      popup.last_contact_us = u;


    }

  }
}

var last_cursor;
var last_start_cursor;
doc.getElementById('app').addEventListener('touchstart',e=>{
  last_cursor = pointerEventToXY(e);
  last_start_cursor = last_cursor;
  if (sort_container_cards)
    sort_container_cards_last_scroll_top = sort_container_cards.scrollTop
  no_click=true;
});
var sort_container_cards = document.querySelector('#sort-container cards');
var sort_container_cards_last_scroll_top;

doc.getElementById('app').addEventListener('touchmove',e=>{
  if (current_stage != 6 || !sort_container_cards) return;
  e.preventDefault()
  e.stopPropagation();
  var cursor = pointerEventToXY(e);
  if (!last_cursor)last_cursor = cursor;
  var dy = (cursor.y - last_cursor.y) / parseFloat(document.documentElement.style.getPropertyValue('--scale') || 1);
  sort_container_cards.scrollTop = sort_container_cards_last_scroll_top-dy;
});
doc.getElementById('app').addEventListener('click',card_click_listener);
doc.getElementById('app').addEventListener('touchend',card_click_listener);



var mousedowning = false;
doc.getElementById('app').addEventListener('mousedown',e=>{
  if (no_click || !sort_container_cards) return;
  last_cursor = pointerEventToXY(e);
  sort_container_cards_last_scroll_top = sort_container_cards.scrollTop;
  mousedowning = true;
});
doc.getElementById('app').addEventListener('mouseup',e=>{
  if (no_click) return;
  mousedowning = false;
  card_click_listener(e)
});

doc.getElementById('app').addEventListener('mousemove',e=>{
  if (no_click || !mousedowning || !sort_container_cards) return;
  if (current_stage != 6) return;
  e.preventDefault()
  e.stopPropagation();
  var cursor = pointerEventToXY(e);
  if (!last_cursor)last_cursor = cursor;
  var dy = (cursor.y - last_cursor.y) / parseFloat(document.documentElement.style.getPropertyValue('--scale') || 1);
  sort_container_cards.scrollTop = sort_container_cards_last_scroll_top-dy;
});






/*

  Fix clip-path in Safari

*/

// the only scrollable that is blocked by clip-path








const stage_get_arrows = (obj)=>{
  return Array.from(obj.children).filter(e=>e.tagName == 'ARROWS')[0]
}
const move_bg = (obj, level, total)=>{
  return new Promise(function(resolve, reject) {
    var img = Array.from(obj.children).filter(e=>e.tagName == 'BACKGROUND')[0].querySelector('bg g');
    img.translateX = "calc((-100% + var(--window-width, 100vw)) / "+total+" * "+level+")";
    img.style.transform = "translateX("+img.translateX+")" + ' scale('+(img.scale || 1)+')';
    resolve();
  })
}

const arrange_cards = (card_type, card_divs, right, full_height)=>{
  card_divs = Array.from(card_divs).filter(e=>e.classList.contains('active'));
  var _bgs = getRandomSubarray(cards_bgs[card_type]);
  var swaps = [];
  card_divs.forEach((e, i)=>{
    var bg = e.querySelector('[card-bg]');
    var img = e.querySelector('image');
    bg.style.display = _bgs[i]?'unset':'none';
    if (_bgs[i]){
      let _id = _bgs[i].split('/').slice(-1)[0].split('.')[0];
      swaps.push([
        img.parentNode, doc.getElementById(_id), img
      ])
    }
      // img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', _bgs[i] )
      //img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#'+_bgs[i].split('/').slice(-1)[0].split('.')[0] )
  })
  var swapped = [];
  swaps.forEach(e=>{
    swapped.push(e[1]);
    if (!swapped.some(a=>a == e[2]))
      svgs.append(e[2]);
    e[0].appendChild(e[1]);

  })
  
  var alt = right===undefined? Math.random() > 0.5: right;
  var card_count = card_divs.length;
  var start = (alt?0:-0) - 0.125;
  var end = (alt?0.85:(full_height?0.85:0.75))+Math.random()*0.01 - 0.06;
  var h = end-start;
  var d = 0.06;
  var seg = h / card_count - d * 2;

  var last_left = 0;
  var actual_width = parseInt(document.documentElement.style.getPropertyValue('--window-width'));
  var horizon = mix(0.075, 0.1, actual_width, 340, 480);
  var padding_right = mix(0.01, 0.03, actual_width, 340, 480);
  var padding_left = mix(0.01, 0.03, actual_width, 340, 480) * 0.5;
  var height_adjust = 0;
  var last_div;
  var left = (e)=>{
    var p=Math.random()*horizon; 
    last_left = p;
    p=p*(1-padding_left)+padding_left;
    e.style.left=(p*100)+'%';
    e.style.right="unset";
    return p;
  }
  var right = (e)=>{
    var max_right = min(horizon, (1-last_left-horizon));
    var p=Math.random()*max_right; 
    p=p*(1-padding_right)+padding_right;
    
    e.style.right=(p*100)+'%';
    e.style.left="unset";
  }

  var height_proportions = card_divs.map(e=>e.querySelector('card-text').clientHeight);
  var min_proportion = height_proportions.min();
  var max_proportion = height_proportions.max();

  height_proportions = height_proportions.map(e=>(((e-min_proportion) / max_proportion)**2 + 1)**1.3);
  var total_proportions = height_proportions.sum();
  
  card_divs.forEach((e, i)=>{
      var p = (height_proportions.slice(0,i).sum() + height_proportions[i]/2) / total_proportions * (card_divs.length  );
      var t = start+Math.random()*seg + d + p*(seg+2*d);
      e.style.top=(t*100)+'%';
      
      (i%2 == (alt?1:0)?left:right)(e)
      e.style.pointerEvents = "all";
      last_div = e;
  });
}

const hide = (things) => {
  var h = e=>{
    e.style.pointerEvents = "none";
    anime({
      targets: e,
      opacity: 0,
      duration: 400,
      easing: 'linear',
    })
  };
  things.forEach?things.forEach(h):h(things);
}

const show = (things) => {
  var h = e=>{
    e.style.opacity = "1";
    e.style.pointerEvents = "all";
  };
  things.forEach?things.forEach(h):h(things);
}

const set_card_divs = (card_divs, i) => {
  var chunks = CARDS_CHUNKS[i];
  for (var j = 0; j < card_divs.length; j ++){
    var card_div = card_divs[[j]]
    if (j >= chunks.length){
      card_div.classList.remove('active');
    }else{
      var card = chunks[j];
      card_div.classList.add('active');
      if (card.chosen)
        card_div.classList.add('chosen');
      else
        card_div.classList.remove('chosen');
      card_div.setAttribute('id', card.id);
      var p = card_div.querySelector('p');
      
      Object.keys(card.name).forEach(
        lang=> p.setAttribute(lang, card.name[lang].replace(/ *\u200b/g, '\n'))
      )
      setLang(current_lang);

    }

  }

}

const wait_for_arrows = (obj) =>{
  var arrows = stage_get_arrows(obj);
  arrows.style.opacity = 1;
  arrows.style.transform = "translateX(0)";
  
  return new Promise(function(resolve, reject) {
    var click = (e)=>{
      arrows.removeEventListener('click', click);
      arrows.removeEventListener('touchend', click);
      arrows.style.opacity = 0;
      resolve();
    };

    arrows.addEventListener('click', click);
    arrows.addEventListener('touchend', click);
  })
}

window.stage_next = function(self){
  document.querySelector('html').style.background = self.obj.style.background
  var obj = self.obj;
  var max_i = self.max_i;
  var card_type = self.card_type;
  var card_divs = Array.from(Array.from(obj.children).filter(e=>e.tagName == 'BACKGROUND')[0].querySelectorAll('card'));
  var intro_text_container = Array.from(obj.children).filter(e=>e.classList.contains('thin-body'))[0];
  var intro_texts = intro_text_container.querySelectorAll('p');

  var last_page_is_left = ()=>card_divs.filter(e=>e.classList.contains('active')).length % 2 == 0;


  var tl = [];

  tl.push.apply(tl,[
    // Intro text
    ()=> move_bg(obj, 0, max_i),
    ()=> sleep(1500),
    ()=> fadeIn(intro_texts, 600),
    ()=> deactivate_bg_animation( obj.parentElement.querySelector('background')),
    ()=> sleep(500),
    ()=> wait_for_arrows(obj),
    ()=> hide(intro_text_container),
  ])
  for (let i = 0; i < max_i; i++){
    tl.push.apply(tl,[
      // i th selection
      ()=> hide(card_divs),
      ()=> sleep(500),
      ()=> move_bg(obj, i+1, max_i),
      ()=> sleep(2000),
      ()=>{
        Array.from(obj.querySelector('background').querySelectorAll('[anime]')).filter(e=>(parseInt(e.getAttribute('x')) + parseInt(e.getAttribute('width'))) < 600 / max_i).forEach(e=>{
          Array.from(e.classList).forEach(c=>{
            if (c.startsWith('animation_'))
              e.classList.remove(c);
            
          })})
      },
      ()=> set_card_divs(card_divs, current_cards_i++),
      ()=> arrange_cards(card_type, card_divs, (i==max_i-1)?!last_page_is_left():undefined, (i==max_i-1)?true:undefined),
      ()=> fadeIn(getRandomSubarray(card_divs)),
      ()=> sleep(800),
      ()=> (i==max_i-1)?1:wait_for_arrows(obj),
    ])
  }

  tl.push.apply(tl,[

    defaultNextCutain(self),

  ]);
  timeline(tl)
}





/*
    Sort result
*/

var n_chosen_at_last = 0;


window.sort_start = function (self){
  document.querySelector('html').style.background = self.obj.style.background
  var obj = self.obj;
  var card_divs = [];
  var intro_text_container = Array.from(obj.children).filter(e=>e.classList.contains('thin-body'))[0];
  var intro_texts = intro_text_container.querySelectorAll('p');
  var sort_container = doc.getElementById('sort-container');
  var cards_container = sort_container.querySelector('cards');
  n_chosen_at_last = 0;

  var all_chosen = CARDS.filter(e=>e.chosen).map(e=>e);
  var counter = all_chosen.reduce((acc, curr)=>(acc[curr.type] ? acc[curr.type]++ : acc[curr.type] = 1)&&acc, {});

  const check_if_cards_enough = (obj) =>{
    var nextCurtain = self.obj.querySelector('.curtain-page');
    deactivate_bg_animation(self.obj.querySelector('background'));
    activate_bg_animation(nextCurtain.querySelector('background'));
    if (n_chosen_at_last <= 10 && n_chosen_at_last > 0){
      if (nextCurtain) {
        nextCurtain.curtain.show();
        nextCurtain.curtain.nextFrame.push(update_vh);
      }

    }else{
      if (nextCurtain) {
        nextCurtain.curtain.hide();
        nextCurtain.curtain.nextFrame.push(update_vh);
      }

    }
  }


  if (all_chosen.length == 0){
    intro_texts[0].setAttribute('zh','認真聆聽你內心的聲音，有什麼是你想要的？');
    intro_texts[0].setAttribute('en','Listen carefully to your inner voice, what do you want?');

    intro_texts[1].setAttribute('zh','（請最少選擇一張卡）');
    intro_texts[1].setAttribute('en','(Please choose at least 1 card)');
    setLang()
    timeline([
      ()=> sleep(1000),
      ()=> fadeIn(intro_texts, 600),
      ()=> wait_for_arrows(obj),
      ()=> hide(intro_texts),
      ()=> window.location = '/',
    ]);





  }else if (all_chosen.length <= 10){
    var nextCurtain = self.obj.querySelector('.curtain-page');
    nextCurtain.style.display = '';
    nextCurtain.style.clipPath = '';
    nextCurtain.style.webkitClipPath = '';
    nextCurtain.style.opacity = 0;
    nextCurtain.style.transition = "0.5s ease all";
    nextCurtain.curtain.finishCurtain();
    obj.offsetHeight; // no need to store this anywhere, the reference is enough
    setTimeout(()=>{
      deactivate_bg_animation( obj.parentElement.querySelector('background'))
    }, 1500);
    setTimeout(()=>{
      nextCurtain.style.opacity = 1;
      setTimeout(()=>{
        update_vh();
      }, 5);

    },5)

  }else {

    timeline([
      ()=> sleep(1000),
      ()=> fadeIn(intro_texts, 600),
      ()=> wait_for_arrows(obj),
      ()=> hide(intro_texts),
      ()=> sleep(500),
      ()=> sort_container.style.display = "flex",
      ()=> all_chosen.shuffle().forEach(card=>{
        var card_div = doc.createElement('card');
        var card_text_div = doc.createElement('card-text');
        
        var p = doc.createElement('p');
        card_div.classList.add('card-sort');
        Object.keys(card.name).forEach(
          lang=> p.setAttribute(lang, card.name[lang].replace(/ *\u200b/g, '\n'))
        )
        card_div.appendChild(card_text_div);
        card_text_div.appendChild(p);
        card.chosen = false;
        
        card_div.setAttribute('id', card.id);
  
        cards_container.appendChild(card_div);
        card_divs.push(card_div);
  
      }),
      ()=> setLang(),
      ()=>{
        var cards = Array.from(document.querySelectorAll('.card-sort'));
        cards.forEach((e,i)=>{
            if (i %2 == 0) return;
            e.style.marginTop = (cards[i-1].clientHeight+50) + 'px'


        })
      },
      ()=> show(sort_container),
      ()=> card_divs.slice(8).forEach(e=>e.style.opacity=1),
      ()=> current_stage = 6,
      ()=> fadeIn(doc.querySelectorAll('#sort-container .thin-body p'), 600),
      ()=> fadeIn(getRandomSubarray(card_divs.slice(0,8)), 200),
      ()=> window.addEventListener('card-clicked', check_if_cards_enough, false),
      ()=> check_if_cards_enough(),
      //defaultNextCutain(self)
  
    ])
  }

}


/*
    Pre result
*/

var result_bg_loaded = false;

window.pre_result = function (self){
  document.querySelector('html').style.background = self.obj.style.background
  var obj = self.obj;
  var intro_text_container = Array.from(obj.children).filter(e=>e.classList.contains('thin-body'))[0];
  var intro_texts = intro_text_container.querySelectorAll('p');

  obj = doc.getElementById('result')
  document.querySelector('html').style.background = obj.style.background;
  var best_type = get_best_type();
  document.getElementById('body').setAttribute('best_type', ''+best_type);

  document.querySelector('html').style.background = '#'+colors[best_type];
  document.getElementById('result').style.background = '#'+colors[best_type];
  var background = document.getElementById('result').querySelector('background');
  background.innerHTML = bgs[best_type];
    
  // document.querySelectorAll('[data-href]').forEach(e=>e.setAttributeNS("http://www.w3.org/1999/xlink", 'href', e.getAttribute('data-href')))
  document.getElementById('result-icon').setAttribute('src', 'assets/img/icon-0'+(best_type+1)+'.jpg');

  activate_bg_animation(background);
  result_bg_loaded = true;
  setTimeout(()=>  Array.from(document.querySelectorAll('.snow')).filter(e=>e.getBoundingClientRect().x > 500).forEach(e=>e.style.display = "none"), 200)
  setTimeout(()=>  Array.from(document.querySelectorAll('.star')).filter(e=>e.getBoundingClientRect().x > 500).forEach(e=>e.style.display = "none"), 200)



  
  timeline([
    ()=> sleep(1000),
    ()=> deactivate_bg_animation(doc.getElementById('intro').querySelector('background')),
    ()=> fadeIn(intro_texts, 600),
    defaultNextCutain(self),

  ])
}


/*
    Show result
*/

window.show_result = function (self){
  var obj = self.obj;
  obj = doc.getElementById('result')
  document.querySelector('html').style.background = obj.style.background
  var result_container = obj.querySelector('result-container');
  var all_chosen = CARDS.filter(e=>e.chosen).map(e=>e);


  var counter_ = all_chosen.reduce((acc, curr)=>(acc[curr.type] ? acc[curr.type]++ : acc[curr.type] = 1)&&acc, {});
  Object.keys(counter_).forEach(k=>counter[k]=counter_[k]);
  var total = all_chosen.length;
  var inner = document.querySelector('result-description-inner');
  
  if (!result_bg_loaded){
    
    var rows = Array.from(doc.querySelectorAll('row'));
    rows.sort((a,b)=>parseInt(a.getAttribute('data-type')) == parseInt(b.getAttribute('data-type'))? 0: (parseInt(a.getAttribute('data-type')) > parseInt(b.getAttribute('data-type')) ? 1 : -1));

    rows.forEach((e,i)=>{
      e.dtype = i;
      e.score = counter[i];
      e.querySelector('left h1').innerHTML = (parseInt((counter[i] / total)*100))+ '<span font-smaller>%</span>' + ``;
      
      var history = e.querySelector('.chosen-history');
      var this_chosen = all_chosen.filter(e=>e.type == i);
      if (history){
        if (this_chosen.length == 0){
          history.nextElementSibling.remove();
          history.remove();
        }else{
          history.nextElementSibling.innerHTML = "";
          this_chosen.forEach(e=>{
            var li = doc.createElement('li');
            li.setAttribute('en', e.name.en);
            li.setAttribute('zh', e.name.zh);
            history.nextElementSibling.appendChild(li)
  
          })
          setLang();
        }
      }
      
    });
    rows.sort((a,b)=>a.score == b.score? 0: (a.score < b.score ? 1 : -1))
  
  
    rows.forEach(e=>inner.appendChild(e));
    inner.appendChild(doc.getElementById('result-credit'));
    best_type = rows[0].dtype;
    document.getElementById('body').setAttribute('best_type', ''+best_type);
    var TYPE = CARDS_TYPES[best_type];
    
    document.querySelector('html').style.background = '#'+colors[best_type];
    document.getElementById('result').style.background = '#'+colors[best_type];
    var background = document.getElementById('result').querySelector('background');
    background.innerHTML = bgs[best_type];
  
    // document.querySelectorAll('[data-href]').forEach(e=>e.setAttributeNS("http://www.w3.org/1999/xlink", 'href', e.getAttribute('data-href')))
    document.getElementById('result-icon').setAttribute('src', 'assets/img/icon-0'+(best_type+1)+'.jpg');
    activate_bg_animation(background);
    setTimeout(()=>  Array.from(document.querySelectorAll('.snow')).filter(e=>e.getBoundingClientRect().x > 500).forEach(e=>e.style.display = "none"), 200)
    setTimeout(()=>  Array.from(document.querySelectorAll('.star')).filter(e=>e.getBoundingClientRect().x > 500).forEach(e=>e.style.display = "none"), 200)
    

    var encoded = all_chosen.reduce(
      (e, x, i)=>{
        var temp = new BigNumber('1');
        for (var j=0; j<i; j++)
          temp = temp.multipliedBy(encoded_expand_base)
        temp = temp.multipliedBy(x.id)
        return e.plus(temp)
      }, new BigNumber('0')
    ).toString(encoded_base);
    sharable_link = window.location.origin+'/'+TYPE.code+'-'+current_lang+'?d='+encoded;
    



  }

  var dounuts = doc.getElementsByClassName('donut');
  var stoke_max = 879.645943005142;
  const start_dounuts = ()=>{
    var config = {
      targets: Array.from(dounuts).map(e=>e.querySelector('circle')) ,
      easing: 'easeInOutQuint',
      duration: 3000,
    };
    config['stroke-dashoffset'] = function(el, i, l) {
      return [stoke_max,stoke_max * (1 - (counter[i] - 0.0) / total)];
    }
    anime(config);
    var random_rotate = Math.random() * 45;
    anime({
      targets: dounuts,
      easing: 'easeInOutQuint',
      opacity: [0,1],
      rotate: function(el, i, l) {
        return [-450 - random_rotate,-90 - random_rotate+(i==0?0:(360*counter.slice(0,i).sum() / total))];
      },
      duration: 3000,
      
    });
  

  }

  

  const resize_result_desc_inner = ()=>{
    inner.style.height = '';
    // rows.forEach(e=>e.style.flex = "");
    Array.from(document.querySelectorAll('result-description-inner > *')).forEach(e=>e.style.height = '')
    inner.style.height = Array.from(document.querySelectorAll('result-description-inner > *')).map(e=>e.clientHeight).sum() + 'px';

    // rows.forEach(e=>e.style.flex = "1")
  }

  window.addEventListener('set-lang',resize_result_desc_inner)

  timeline([
    ()=> sleep(1000),
    ()=> show(result_container),
    ()=> start_dounuts(),
    ()=> sleep(2000),
    ()=> doc.querySelector('result-description').classList.add('active'),
    ()=> doc.querySelector('learn-more').classList.add('active'),
    ()=> resize_result_desc_inner(),
    ()=> current_stage = 8,
    ()=> sleep(1000),
    ()=> allow_get_icon(),

  ])
}







/*
    Enable Curtains
*/

var curtains = makeCurtains(doc.getElementById('stages') );

/*
    Skip
*/
if (skip){
  current_cards_i = [0,0,3,6,8,10,12][skip];
  hide_footer2()
}else{
  
  activate_bg_animation(doc.getElementById('intro').querySelectorAll('background')[0]);
}
// setInterval(update_vh,1000)

const allow_get_icon = function (){
  const result_icon = doc.getElementById('result-icon');
  var timerLongTouch;
  var longTouch = false;

  var callback = function(e) {
    generate_result();
    e.preventDefault();
  }
  result_icon.addEventListener('contextmenu', callback, false);

  result_icon.addEventListener('touchstart', function(event){
    setTimeout(function(){
      result_icon.removeEventListener('contextmenu', callback, false);
    },200);
    event.preventDefault();
    timerLongTouch = setTimeout(function() {
      generate_result();
        
    }, 600);

  })
  var clearLongTouch = function(event){
    event.preventDefault();
    clearTimeout(timerLongTouch);
    if(longTouch)
        longTouch = false;
    
  }
  result_icon.addEventListener('touchmove', clearLongTouch);
  result_icon.addEventListener('touchend', clearLongTouch);


}
setInterval(update_vh,4000);

var generating = false;
var resultURL = null;

const generate_result = ()=>{
  if (generating)
    return;

  if (resultURL){
    var dlLink = document.createElement('a');
    dlLink.download = "result";
    dlLink.href = resultURL;
  
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
    return;
  }
  document.querySelector('#super-overlay').classList.add('show');
    
  generating = true;
  const canvas = document.createElement('canvas');
  canvas.width  = 630;
  canvas.height = 1260;
  
  const ctx = canvas.getContext('2d');
  var dounuts = Array.from(document.querySelectorAll('dounut-container > svg')).map(e=>e.cloneNode(true));

  var back = dounuts[0].querySelector('circle');
  back.removeAttribute('style');
  back.removeAttribute('class');
  back.setAttribute('cy', "180");

  var preload = new createjs.LoadQueue(true, null, true);
  preload.setMaxConnections(100);
  var L = current_lang == 'zh'?'c':'e';
  var bg_pic = `00${best_type+1}-result-bg_${L}.jpg`;
  // var icon_pic = `icon-0${best_type+1}.jpg`;
  preload.loadManifest([
    `/assets/img/` + bg_pic,
    // `/assets/img/` + icon_pic,
  ])
  /*
  var qrcode_blob = new QRious({
    value: sharable_link,
    size: 120,
    level: "H",
    backgroundAlpha: 0,
  }).toDataURL();
  var qrcode_blob_2 = new QRious({
    value: sharable_link,
    size: 120,
    foreground: "#FFF8",
    level: "H",
    backgroundAlpha: 0,
  }).toDataURL();
  */


  preload.addEventListener("complete", (e)=>{
    var bg_blob = URL.createObjectURL(preload.getResult(`/assets/img/` + bg_pic, true));
    // var icon_blob = URL.createObjectURL(preload.getResult(`/assets/img/` + icon_pic, true));
    
    var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 315 630">
    <image x="0px" y="0px" width="315px" height="630px" xlink:href="`+bg_blob+`" >
    </image>
    `;
    // svg += back.outerHTML + '\n';

  svg += `
  <g style="transform:scale(0.858) translate(26px, 14.5px);tr  nsform-origin: 157.5px 180px; ">`
    dounuts.slice(1).forEach((dounut)=>{
        var circle = dounut.querySelector('circle');
  
        circle.removeAttribute('class');
        circle.setAttribute('cy', "180");
        circle.setAttribute('style', 'transform:'+ dounut.style.transform + ';transform-origin: 157.5px 180px; ');
        svg += circle.outerHTML + '\n';
    })
    svg += `
    </g>
    `;
  
    svg += "</svg>";
  
    let v = canvg.Canvg.fromString(ctx, svg);
  
    v.start();
  
    setTimeout(()=>{
      var MIME_TYPE = "image/png";
  
      var imgURL = canvas.toDataURL(MIME_TYPE);

      resultURL = imgURL;
    
      var dlLink = document.createElement('a');
      dlLink.download = "result";
      dlLink.href = imgURL;
    
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

      document.querySelector('#super-overlay').classList.remove('show');
      generating = false;
  
    }, 100)
    
  });


  return;
  
}
window.generate_result = generate_result;


setInterval(update_vh,4000);








