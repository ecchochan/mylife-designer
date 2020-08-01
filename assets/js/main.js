import { makeCurtains }  from './curtain.min.js';
/*

  Configurations

*/

var DEBUG = false;

var CARDS_PER_PAGE = 6;

var MAX_AUDIO_VOL = 0.5;

var OPACITY = {
  EASING: 'easeOutQuad',
  DURATION: 500,
};
var TRANSITION = {
  EASING: 'easeOutQuart',
  DURATION: 500,
};


const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)

/** 

  Utils

**/

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
const BODY_MAX_WIDTH = 480;

function update_vh() {
  let height = window.innerHeight;
  let width = window.innerWidth;
  let vh = height * 0.01;
  let vw = width * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
  if (width > BODY_MAX_WIDTH){
    document.body.style.width = BODY_MAX_WIDTH+"px"
    document.body.style.marginLeft = parseInt((width - BODY_MAX_WIDTH) /  2) + 'px';
    width = BODY_MAX_WIDTH;

  }else{
    document.body.style.width = ""
    document.body.style.marginLeft =  '';
  }
  
  document.documentElement.style.setProperty('--window-height', `${height}`);
  document.documentElement.style.setProperty('--window-width', `${width}`);
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



/*

  Langs

*/

var userLang = navigator.language || navigator.userLanguage; 
var isChinese = userLang.indexOf('zh') > -1;
var lang = isChinese?'zh':'en';
doc.getElementById('app').classList.remove('hidden');
FastClick.attach(doc.body);
var setLang = function(L){
  document.querySelectorAll('[en],[zh]').forEach(e=>{
    var EN = e.attributes['en'];
    var ZH = e.attributes['zh'];
    if (EN) EN = EN.value;
    if (ZH) ZH = ZH.value;
    if ((L == 'en' && EN) || (L == 'zh' && !ZH))
      e.textContent = EN;
    if ((L == 'zh' && ZH) || (L == 'en' && !EN))
      e.textContent = ZH;
  })

}

doc.addEventListener("DOMContentLoaded", function(){
  setLang(lang);
  update_vh();
});

if (DEBUG){
  document.querySelectorAll('#lang-switcher > span').forEach(e=>{
    e.classList.remove('display-none');
    e.addEventListener('click',function(e){
      document.querySelectorAll('#lang-switcher > span').forEach(e=>e.classList.remove('display-none'));
      this.classList.add('display-none');
      setLang(this.textContent);
  
    })
  });
  document.querySelector('#lang-switcher > span').classList.add('display-none');
  
  if (lang == 'zh'){
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
精神層面上的滿足;;Mentally Satisfied
與神有親密連繫;;Closely connected with God
持續的認識自我;;Continuous self-exploration
擁有自我內心的空間;;Have an inner space 
安全感;;Sense of secure
內心的平靜;;Have an inner peace 
新鮮感;;Sense of freshness
感到自在;;Feel comfortable 

!人際關係;;Inter-personal relationship
擁有自在舒適的人際關係;;Got a comfortable inter-personal relationship
美滿婚姻;;Happy marriage
有交心知己;;Have Best Friend Forever
有親近的好朋友;;Have good friends
親密的家庭;;A close family 
孝順父母;;Filial Piety
和一群人一起打拼;;Work hard with others
讚賞及鼓勵別人;;Appreciate and encourage others
有意義的愛情;;A meaningful love-relationship  
幫助別人;;Help others

!物質享受;;Materialistic
有車 / 有樓;;Own a Car/House
賺大錢;;Be wealthy
時尚的打扮;;Fashionable dress up
錢夠用 (沒有經濟上的擔憂);;Sufficient amount of money (without financial burden)
追上科技潮流;;Catch up on technology   
建立社會地位;;Have social status
環遊世界;;Travel around the world
食盡美食;;Enjoy food

!生活模式;;Life style
簡簡單單的生活;;Simple life
參加藝文青活動;;Participate art and cultural activities 
親親大自然;;Enjoy nature
人生充滿樂趣;;Interesting life
多姿多彩的生活;;Fruitful life
參與宗教、政治、社團活動;;Participate in religions, politics and/or different societies
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
擁有純潔及真摯的心;;Be pure and true
勇於改變;;Dare to Change 
有自信;;Confident
有正義感;;Have a sense of justice
義氣仔女;;Be loyal to friends 
腳踏實地;;Be practical and down-to-earth
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
          picked: false,
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





window.CARDS = CARDS;
window.CARDS_TYPES = CARDS_TYPES;
window.CARDS_ITEMS = CARDS_ITEMS;
window.CARDS_SHUFFLED = CARDS_SHUFFLED;
window.CARDS_CHUNKS = CARDS_CHUNKS;







/*

  Resources Loading

*/



var MUSIC_URL = 'https://www.bensound.com/bensound-music/bensound-beyondtheline.mp3';
var files = [];

var files_loaded = 0;
var files_total = files.length;

var load_counter = doc.getElementById('load-percent');
var load_wrapper = doc.getElementById('loading-wrapper')
var increment_files_loaded = function () {
  load_counter.textContent = files_total?parseInt(++files_loaded / files_total * 100):100;
  if (files_loaded == files_total){
    LOGT('All assets loaded.');

    start();
  }
};
files.forEach(fn => loadjs(fn, increment_files_loaded));
if (files_total == 0)
document.addEventListener("DOMContentLoaded", increment_files_loaded);



/*

  Resources Loading

*/



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

var audio;
var AUDIO_ON = volumeSwitchContainer.classList.contains('switchOn');
var setVolume = (v)=>{
  anime({
    targets: audio,
    volume: v,
    duration: 500,
    easing: 'easeOutQuad',
  })

};
var playMusic = ()=>{
  if (!audio) {
    audio = new Audio(MUSIC_URL);
    audio.volume = MAX_AUDIO_VOL;
  }
  
  audio.play();
}

var toggleMusic = ()=>{
  if (AUDIO_ON) {
    AUDIO_ON = false;
    setVolume(0);
    volumeSwitchContainer.classList.remove('switchOn');
    volumeSwitchContainer.classList.add('switchOff');
  }else{
    AUDIO_ON = true;
    setVolume(MAX_AUDIO_VOL);
    volumeSwitchContainer.classList.add('switchOn');
    volumeSwitchContainer.classList.remove('switchOff');
    playMusic();
  }
}
volumeButton.onclick = toggleMusic;


var listen_once = function(target, event, func){
  var triggered = false;
  var temp_func = function(e){
    if (triggered) return;
    try{
      target.removeEventListener(event);
    }catch(err){
      triggered=true;
    }
    func(e);
  }
  target.addEventListener(event, temp_func)

};


var stage_divs = Array.from(document.getElementsByClassName('stage'));

var _stages = stage_divs.map(e=>e.id);

LOGT('_stages');
LOG(_stages)

var stages = {};

for (var i=0;i<_stages.length;i++){
  stages[_stages[i].replace(/\-/g,'_')] = document.getElementById(_stages[i]);
}

var setActive = function(a, b){
  document.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));
  if (a) a.classList.add('active');
  if (b) b.classList.add('active');
}

/*
    Start
*/

var start = function () {
  stages.intro.style.opacity = 1;
  setActive(stages.intro);  
  goNextFade(0, load_wrapper, e => {
    LOGT('Load wrapper removed.');
    curtains[0].show();
  });
}




/*
    Stage Defaults
*/

const defaultNextCutain = (self) => {
  return [function () {
    var nextCurtain = self.obj.querySelector('.curtain-page');
    if (nextCurtain) nextCurtain.curtain.show();
  }, self.opened ? 0 : 500];
}



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



window.intro_next = function (self){
  var obj = self.obj;
  timeline([
    [
      function(){}, 1000
    ],
    defaultNextCutain(self),
    [
      function(){
        document.getElementById('float-top-right').classList.remove('hidden');
        playMusic();
      }, 500
    ]

  ])
}
const intro_drags = Array.from(document.querySelectorAll('#intro [drag]')).map(e=>[e, parseInt(e.getAttribute('drag'))]);
window.coverUpdate = (p, p2)=>{
  return;
  intro_drags.forEach(e=>{
    var t = e[0];
    var drag = e[1];
    t.style.transform = "translateX("+-drag*p2+"px)";

  })
}




/*
    Generate Card Selection
*/

var colorPalette = 'ffac81-ff928b-fec3a6-efe9ae-cdeac0'.split('-')

var colorPalette = '547A41-d6f6dd-dac4f7-f4989c-ebd2a4-acecf7'.split('-')
var cardSelectionTemplate = doc.getElementById('selection-1');

CARDS_CHUNKS.forEach((chunk, i)=>{
  var divClone = cardSelectionTemplate.cloneNode(true);
  divClone.style.background = '#'+colorPalette[i%colorPalette.length];
  divClone.id = 'selection-'+(i+1);
  divClone.querySelector('.cards').innerHTML = chunk.map(e=>
    `<li en="${e.name.en}" zh="${e.name.zh}"></li>`).join('');
  //console.log(chunk.map(e=>`<li en="${e.name.en}" zh="${e.name.zh}"></li>`).join(''))
  //console.log(divClone.querySelector('.cards').innerHTML)
  cardSelectionTemplate.parentNode.insertBefore(divClone, cardSelectionTemplate.nextSibling);
});

cardSelectionTemplate.remove();




/*
    Stage Trigger
*/


const stage_next = function(self){
  var obj = self.obj;
  timeline([
    ()=>{
      return new Promise(function(resolve, reject) {
        setTimeout(() => {
          console.log('promise done');
          resolve("done");
        }, 1000);
      })
    },
    (ret)=>{
      return new Promise(function(resolve, reject) {
        setTimeout(() => {
          console.log(ret+' good');
          resolve(ret+' good');
        }, 1000);
      })
    },
    defaultNextCutain(self),

  ])
}
window.stage_next = stage_next










/*
    Enable Curtains
*/

var curtains = makeCurtains(doc.getElementById('stages') );
