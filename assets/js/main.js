window.mobilecheck = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
var doc = document;
var MUSIC_URL = 'https://www.bensound.com/bensound-music/bensound-beyondtheline.mp3';
var MAX_AUDIO_VOL = 0.5;
var files = ['https://www.hdwallpapers.in/walls/halloween_2013-wide.jpg', 'https://www.hdwallpapers.in/walls/2013_print_tech_lamborghini_aventador-wide.jpg', 'https://www.hdwallpapers.in/walls/ama_dablam_himalaya_mountains-wide.jpg', 'https://www.hdwallpapers.in/walls/arrow_tv_series-wide.jpg', 'https://www.hdwallpapers.in/walls/anna_in_frozen-wide.jpg', 'https://www.hdwallpapers.in/walls/frozen_elsa-wide.jpg', 'https://www.hdwallpapers.in/walls/shraddha_kapoor-wide.jpg', 'https://www.hdwallpapers.in/walls/sahara_force_india_f1_team-HD.jpg', 'https://www.hdwallpapers.in/walls/lake_sunset-wide.jpg', 'https://www.hdwallpapers.in/walls/2013_movie_cloudy_with_a_chance_of_meatballs_2-wide.jpg', 'https://www.hdwallpapers.in/walls/bates_motel_2013_tv_series-wide.jpg', 'https://www.hdwallpapers.in/walls/krrish_3_movie-wide.jpg', 'https://www.hdwallpapers.in/walls/universe_door-wide.jpg', 'https://www.hdwallpapers.in/walls/night_rider-HD.jpg', 'https://www.hdwallpapers.in/walls/tide_and_waves-wide.jpg', 'https://www.hdwallpapers.in/walls/2014_lamborghini_veneno_roadster-wide.jpg', 'https://www.hdwallpapers.in/walls/peeta_katniss_the_hunger_games_catching_fire-wide.jpg', 'https://www.hdwallpapers.in/walls/captain_america_the_winter_soldier-wide.jpg', 'https://www.hdwallpapers.in/walls/puppeteer_ps3_game-wide.jpg', 'https://www.hdwallpapers.in/walls/lunar_space_galaxy-HD.jpg', 'https://www.hdwallpapers.in/walls/2013_wheelsandmore_lamborghini_aventador-wide.jpg', 'https://www.hdwallpapers.in/walls/destiny_2014_game-wide.jpg', 'https://www.hdwallpapers.in/colors_of_nature-wallpapers.html', 'https://www.hdwallpapers.in/walls/sunset_at_laguna_beach-wide.jpg'];
var LOGT_STYLE = 'padding:0.3em 0.7em;background: #ddd; color: #000;font-weight:900;';
var LOG = console.log;
var LOGT = (e) => console.log('%c' + e, LOGT_STYLE);
var files_loaded = 0;
var files_total = files.length;

var load_counter = doc.getElementById('load-percent');
var load_wrapper = doc.getElementById('loading-wrapper')
var increment_files_loaded = function () {
  load_counter.textContent = parseInt(++files_loaded / files_total * 100);
  if (files_loaded == files_total){
    LOGT('All assets loaded.');
    start();
  }
};
files.forEach(fn => loadjs(fn, increment_files_loaded));

var start = function () {
  anime({
    targets: load_wrapper,
    opacity: 0,
    duration: 750,
    easing: 'linear',
    startDelay: 600,
    complete: function (anim) {
      load_wrapper.remove();
      LOGT('Load wrapper removed.');
    }
  });
}

var audio;
var AUDIO_ON = false;
var AUDIO_VOL = MAX_AUDIO_VOL;
var _AUDIO_VOL = AUDIO_VOL;
var meps = 0.001;
var mmax = 0.01;
var playMusic = ()=>{
  if (!audio) audio = new Audio(MUSIC_URL);
  audio.play();
  _AUDIO_VOL = 0;
}
var toggleMusic = ()=>{
  if (AUDIO_ON) {
    AUDIO_ON = false;
    _AUDIO_VOL = 0
  }else{
    AUDIO_ON = true;
    playMusic();
  }
}
var musicVolStep = () => {
  if (AUDIO_VOL != _AUDIO_VOL){
    var diff = AUDIO_VOL - _AUDIO_VOL;
    if ((diff > 0 && diff < meps) || (diff < 0 && -diff < meps)) AUDIO_VOL = _AUDIO_VOL
    else{
      diff *= 0.07;
      if (diff > 0  && diff > mmax) diff = mmax;
      if (diff < 0  && -diff > mmax) diff = -mmax;
      if ((diff > 0 && diff < meps) || (diff < 0 && -diff < meps)) diff = meps;
      AUDIO_VOL -= diff;
    }
    if (AUDIO_VOL < 0) AUDIO_VOL = 0;
    if (AUDIO_VOL > 1) AUDIO_VOL = 1;
    audio.volume = AUDIO_VOL;
    

  }
  window.requestAnimationFrame(musicVolStep);
};
window.requestAnimationFrame(musicVolStep);

doc.getElementById('volume').onclick = toggleMusic;

if ('addEventListener' in doc) {
  doc.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(doc.body);
    



  }, false);
}