import {
  styler
} from "./styler.min.js"

var css = `.curtain {pointer-events: none;position: absolute;z-index: 999;left: 0;top: 0;-webkit-transform-origin: top left;transform-origin: top left;}`

styler('curtain-css', css);

var makeCurtain = (function () {
  var ua = window.navigator.userAgent;
  var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  var webkit = !!ua.match(/WebKit/i);
  var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

  const map = (value, inMin, inMax, outMin, outMax) => {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  };

  const pointsPositionsCalc = (points, w, h, options) => points.map(e => {
    const x = map(e[0], options.xMin, options.xMax, 0, w)
    const y = map(e[1], options.yMin, options.yMax, h, 0)
    return [x, y]
  })

  const svgCircles = points => points.reduce((acc, point, i, a) =>
    `${acc} <circle cx="${point[0]}" cy="${point[1]}" r="2.5" class="svg-circles" v-for="p in pointsPositions"/>`, '')

  const prec = 2;

  /*creates formated path string for SVG cubic path element*/
  function path(x1,y1,px1,py1,px2,py2,x2,y2)
  {
    return x1.toFixed(prec)+" "+y1.toFixed(prec)+" C "+px1.toFixed(prec)+" "+py1.toFixed(prec)+" "+px2.toFixed(prec)+" "+py2.toFixed(prec)+" "+x2.toFixed(prec)+" "+y2.toFixed(prec);
  }
 

  /*computes control points given knots K, this is the brain of the operation*/
  function computeControlPoints(K)
  {
    var p1=new Array();
    var p2=new Array();
    var n = K.length-1;
    var m;

    /*rhs vector*/
    var a=new Array();
    var b=new Array();
    var c=new Array();
    var r=new Array();

    /*left most segment*/
    a[0]=0;
    b[0]=2;
    c[0]=1;
    r[0] = K[0]+2*K[1];

    /*internal segments*/
    for (var i = 1; i < n - 1; i++)
    {
      a[i]=1;
      b[i]=4;
      c[i]=1;
      r[i] = 4 * K[i] + 2 * K[i+1];
    }

    /*right segment*/
    a[n-1]=2;
    b[n-1]=7;
    c[n-1]=0;
    r[n-1] = 8*K[n-1]+K[n];

    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (i = 1; i < n; i++)
    {
      m = a[i]/b[i-1];
      b[i] = b[i] - m * c[i - 1];
      r[i] = r[i] - m*r[i-1];
    }

    p1[n-1] = r[n-1]/b[n-1];
    for (i = n - 2; i >= 0; --i)
      p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];

    /*we have p1, now compute p2*/
    for (i=0;i<n-1;i++)
      p2[i]=2*K[i+1]-p1[i+1];

    p2[n-1]=0.5*(K[n]+p1[n-1]);

    return {p1:p1, p2:p2};
  }
  
  /*computes spline control points*/
  function updateSplines(V)
  {	
    /*grab (x,y) coordinates of the control points*/
    var L = V.length;
    var x=new Array();
    var y=new Array();
    for (var i=0;i<L;i++)
    {
      /*use parseInt to convert string to int*/
      x[i]=V[i][0]
      y[i]=V[i][1]
    }

    /*computes control points p1 and p2 for x and y direction*/
    var px = computeControlPoints(x);
    var py = computeControlPoints(y);

    /*updates path settings, the browser will draw the new spline*/
    var ret = []
    for (i=0;i<L-1;i++)
          ret.push(path(x[i],y[i],px.p1[i],py.p1[i],px.p2[i],py.p2[i],x[i+1],y[i+1]))

    return "M "+ret.join(' L ') +" Z"
  }


  const svgPath = (points) => {
    const D = updateSplines(points);
    return D
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
  

  function min(a, b) {
    return a > b ? b : a;
  }

  function max(a, b) {
    return a > b ? a : b;
  } 

  function lerp(min, max, fraction) {
    return (max - min) * fraction + min;
  }

  var vh;
  var vw;
  var height;
  var width;

  function update_vh() {
    height = window.innerHeight;
    width = window.innerWidth;
    vh = window.innerHeight * 0.01;
    vw = window.innerWidth * 0.01;
  }
  update_vh();
  var onresize = function (event) {
    update_vh();
  };
  if (window.attachEvent) {
    window.attachEvent('onresize', onresize);
  } else if (window.addEventListener) {
    window.addEventListener('resize', onresize, true);
  }


  var index = 0;
  var debug = false; 
  let but_drag = 1.2;
  let but_size = 50;
  let right_pad = 6;
  let smoothing = 0.15;
  let but_horiz_offset = 0.9;
  let but_horiz_offset2 = 1.3;
  let but_over_ratio = 1;
  let but_over_ratio2 = 1;
  var far_v = 60;
  let friction = 0.09;
  var defaults = {
    start_ended: true,
    closed: false,
    start: false,
    closing: true,
    reversible: true,
    but_y_pos: 0.25,
    startX: right_pad + but_size * but_horiz_offset * 3,
    startY: right_pad + but_size * but_horiz_offset,


    next: function (self) {
      var obj = self.obj
      setTimeout(function () {
        var nextCurtain = obj.querySelector('.curtain-page');
        if (nextCurtain)
          nextCurtain.curtain.show();

      }, self.opened ? 0 : 500);
    }


  }

  function makeCurtain(obj, config) {
    config = config || {}
    var ns = 'http://www.w3.org/2000/svg';
    index += 1
    var current_index = index;
    var curtain_id = "curtainClip-" + index;
    var arrow = document.createElement('span');
    arrow.classList.add('arrow');
    var curtain = document.createElementNS(ns, 'svg');
    var path_dom = document.createElementNS(ns, 'path');
    var clipPath = document.createElementNS(ns, 'clipPath');
    var but_y_pos_actual;
    clipPath.id = curtain_id;
    curtain.appendChild(clipPath);
    curtain.appendChild(document.createElementNS(ns, 'g'));
    clipPath.appendChild(path_dom);
    path_dom.setAttribute('fill', '#9300bb');
    curtain.classList.add('curtain');
    document.body.appendChild(curtain);

    document.body.appendChild(arrow);
    var self = Object.assign({}, defaults, config);
    self.curtain = curtain;
    self.path_dom = path_dom;
    self.endX = self.startX;
    self.endY = self.startY;
    self.mousedown = false;
    obj.style.clipPath = "url(#" + curtain_id + ")";
    obj.style.webkitClipPath = "url(#" + curtain_id + ")";
    if (self.closed) {
      self.startX = 0;
      self.startY = 0;
      self.endX = 0;
      self.endY = 0;

    }

    obj.curtain = self;
    self.obj = obj

    setTimeout(function (e) {
      self.start_ended = true;
    }, 1000);

    curtain.setAttribute("width", width);
    curtain.setAttribute("height", height);
    curtain.setAttribute("viewbox", `0 0 ${width} ${height}`);

    self.x = self.startX, self.y = self.startY;
    self.x2 = right_pad * 2, self.y2 = self.startY;
    self.x3 = right_pad * 2, self.y3 = self.startY;
    self.x4 = right_pad * 2, self.y4 = self.startY;
    self.x5 = right_pad * 2, self.y5 = self.startY;

    function update() {
      try{
      var deltaX = (self.endX - self.startX);
      var deltaY = (self.endY - self.startY);
      var stable = Math.abs(deltaX - self.x) < 1e-5;

      if (!self.start && self.x >= right_pad + but_size ){ 
        obj.style.display = 'none';
        requestAnimationFrame(update);
        return;
      }else if ((self.x < -width && !self.mousedown) || stable){
        requestAnimationFrame(update);
        return;
        
      }else if (obj.style.display == 'none'){
        obj.style.display = '';
      }
      

      if (self.start_ended) {
        if (deltaX > 0)
          deltaX = 0;
      }
      but_y_pos_actual = height * (1 - self.but_y_pos);
      var deltaY_max = max(0, height - but_y_pos_actual - but_size * 2.5);
      if (deltaY > deltaY_max)
        deltaY = deltaY_max
      var deltaY_min = min(0, -but_y_pos_actual + but_size * 2.5);
      if (deltaY < deltaY_min)
        deltaY = deltaY_min;

      if (self.x > -30){
        closeNextCurtain();

      }
      if (!self.start && self.x > -1) {
        deltaX = 60;
      }
      if (deltaX < -width / but_over_ratio - 5)
        deltaX = -width / but_over_ratio - 5;

      self.x = lerp(self.x, deltaX, friction);
      self.y = lerp(self.y, deltaY, friction);

      var but_y = but_y_pos_actual + self.y;

      var follow_speed = 6;

      var percent_done_real = -self.x / width;
      if (percent_done_real < 0) percent_done_real = 0; 
      if (percent_done_real > 1) percent_done_real = 1;
      var percent_done = -self.x / min(500, width);
      if (percent_done < 0) percent_done = 0;
      if (percent_done > 1) percent_done = 1;
      percent_done = percent_done_real
      
      var far = percent_done * far_v;
      
      self.x2 = lerp(self.x2, min(
        (self.x < -width ? -width : self.x), mix(0, right_pad*3, self.x, 0, 60)), friction * 6); 
      self.x3 = lerp(self.x3, min(
        (self.x2 < -width ? -width : self.x2) * mix(self.closing ? 0.1 : 1, 1, percent_done_real, 0.2, 1.0), mix(0, right_pad*2, self.x, 0, 60)), friction * follow_speed);
      self.x4 = lerp(self.x4, min(
        ((self.x3 < -width ? -width : self.x3)) * mix(self.closing ? 0.1 : 1, 1, percent_done_real, 0.2, 1.0), mix(0, right_pad*2, self.x, 0, 60)), friction * follow_speed);
      self.x5 = lerp(self.x5, min(
        ((self.x4 < -width ? -width : self.x4)) * mix(self.closing ? 0.1 : 1, 1, percent_done_real, 0.2, 1.0), mix(0, right_pad*2, self.x, 0, 60)), friction * follow_speed);

      if (self.start || self.x < -60) {
        if (self.x2 < self.x) { 
          self.x2 = self.x;
        }
        if (self.x3 < self.x) {
          self.x3 = self.x;
        }
        if (self.x4 < self.x) {
          self.x4 = self.x;
        } 
        if (self.x5 < self.x) {
          self.x5 = self.x;
        }

      }
      self.x5 = self.x4;

      function mix(a, b, p, h, k) {
        var d = k - h;
        if (p - h > 0) {
          p = (p - h) / d;
          if (p > 1) p = 1;
          if (p < 0) p = 0;
          return a * (1 - p) + b * p
        }
        return a
      }


      var but_scale = self.x < 0 ? 10 / (-self.x) ** 0.5 : 1;
      if (but_scale > 1)
        but_scale = 1;
      but_scale = 0.8 + but_scale * 0.2;

      var but_offset = but_size * (1 / but_scale) * mix(but_horiz_offset, but_horiz_offset2, percent_done, 0.0, 0.9);

      

      var mm = 0.06; 

      var middle_z4 = but_size / but_scale * but_drag * 2 +
        mix(far * 2, far * 5, percent_done_real, 0.7, 1.0) + far_v * 3 +
        ((self.closing ? 1: 0.25) *mix(far, far * 6, percent_done_real, 0.0, 0.3)) -
        (self.closing ? (mix(mix(0, 130, percent_done_real, 0, mm), 0, percent_done_real, 0, 0.7)) : 0) +
          mix(mix(0,200,percent_done_real,mm,0.5),0,percent_done_real,0.3,0.7);
      var middle_z3 = but_size / but_scale * but_drag * 2 +
        mix(far * 1.2, far *2, percent_done_real, mm, 1.0) +
        mix(far * 2, far * 3, percent_done_real, 0.7, 1.0) + far_v / 3 +
        ((self.closing ? 1: 0.25) * mix(0, far * 6, percent_done_real, 0.0, 1.0)) -
        (self.closing ? (mix(mix(0, 30, percent_done_real, 0, mm), 0, percent_done_real, 0, 0.7)) : 0);
      var middle_z2 = but_size / but_scale * but_drag +
        mix(far * 1.2, far *2, percent_done_real, mm, 1.0) +
        (self.closing ? 1 : 0.3) * mix(0, far * mix(4, 5, percent_done_real, 0.25, 0.85), percent_done_real, 0.0, 1.0) +
        (self.closing ? (mix(mix(0, 17, percent_done_real, 0, mm), 0, percent_done_real, 0, 0.5)) : 0);
      var middle_z = but_size / but_scale / mix(2, 3, percent_done_real, 0, mm) + far ** 0.8 +
        (self.closing ? mix(0, far / 4, percent_done_real, 0.8, 1.0) : 0) +
        (self.closing ? 1 : 0.3) * mix(0, far*2, percent_done_real, 0.0, 1.0) +
        (self.closing ? 1 : 0.6) * mix(mix(0, 13, percent_done_real, 0, mm), 0, percent_done_real, 0, 0.5); 

 
      var middle_zx4 = mix(mix(0, self.closing?20:-50, percent_done_real, 0.0, 0.7), 0, percent_done_real, 0.7, 1.0);
      var middle_zx3 = mix(
        mix(0, self.closing ? 50 : -45, percent_done_real, 0, 0.7), 0, percent_done_real, 0.7, 1.0) +
        (self.closing ? 1 : 0) * mix(mix(0, width**1.5 / 1500, percent_done_real, 0, mm), 0, percent_done_real, 0, 1); 

      var middle_zx2 = but_size / 7 - mix(mix(0, self.closing?width / 7:30, percent_done_real, mm, 1.0), 0, percent_done_real, 0.7, 1.0) +
        (self.closing ? (mix(mix(0, 9, percent_done_real, 0, mm), 0, percent_done_real, 0, 0.3)) :
          0);
      var middle_zx = width - right_pad - but_offset + self.x;


      var min_x = (-right_pad - but_offset - 1);
      var min_x_mag = (-(min_x) * 2.5); 

      function adjust_x(x) {
        if (!self.closing) {
          return mix(x, x - min_x - right_pad * 2, percent_done_real, 0.3, 0.7);
        }
        
        var offset = 0.045;
        var offset_amount = 2 * (-(offset ** 2) + offset) * min_x_mag;
        if (x < offset_amount) { 
          var p = ((x - offset_amount) / min_x) * ((min_x_mag) /  ( min_x_mag+ offset_amount)) ;
          var ret = 2 * (-(p ** 2) + p) * (min_x_mag)  + offset_amount;
          return ret;
        }
        return x
      }
      var ad_x = adjust_x(middle_zx);

      let points = [
        [width + 200, but_y - height - 100],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - height - 100],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - height - 100],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - middle_z4 - mix(500,700,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - middle_z4 - mix(300,500,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - middle_z4 - mix(200,300,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y - middle_z4],
        [width - right_pad + self.x4 * but_over_ratio2 - middle_zx3, but_y - middle_z3],
        [width - right_pad - middle_zx2 + self.x2, but_y - middle_z2],
        [ad_x, but_y - middle_z],
        [ad_x, but_y + middle_z],
        [width - right_pad - middle_zx2 + self.x2, but_y + middle_z2],
        [width - right_pad + self.x4 * but_over_ratio2 - middle_zx3, but_y + middle_z3],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y + middle_z4],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y + middle_z4 + mix(100,300,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y + middle_z4 + mix(300,500,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2 - middle_zx4, but_y + middle_z4 + mix(500,700,percent_done_real,0,0.6)],
        [width - right_pad + self.x5 * but_over_ratio2, but_y + height + 100],
        [width - right_pad + self.x5 * but_over_ratio2, but_y + height + 100],
        [width + 200, height + 200],
      ];
      var tt = 7,
        L = points.length; 
      var pp = 0.05;
      var nudge = mix(-1, 0, middle_zx, min_x/2, 0) * mix(0, -20, percent_done_real, 0.60, 0.70); 
      if (!self.closing){
        nudge = 0;
      }
      
      if (true) {
        if (points[tt][0] < points[tt + 1][0]) points[tt][0] = points[tt + 1][0];
        points[tt][0] = mix(points[tt][0], points[tt + 1][0] - nudge, percent_done_real, pp, 1.0);
        points[tt - 1][0] = mix(points[tt - 1][0], points[tt + 1][0] - nudge , percent_done_real, pp, 1.0);
        points[tt - 2][0] = mix(points[tt - 2][0], points[tt + 1][0] - nudge, percent_done_real, pp, 1.0);
        points[tt - 3][0] = mix(points[tt - 3][0], points[tt + 1][0] - nudge, percent_done_real, pp, 1.0);
        points[tt - 4][0] = mix(points[tt - 4][0], points[tt + 1][0] - nudge, percent_done_real, pp, 1.0);
        tt = L - tt - 1;
        if (points[tt][0] < points[tt - 1][0]) points[tt][0] = points[tt - 1][0];
        points[tt][0] = mix(points[tt][0], points[tt - 1][0] - nudge, percent_done_real, pp, 1.0);
        points[tt + 1][0] = mix(points[tt + 1][0], points[tt - 1][0] - nudge, percent_done_real, pp, 1.0);
        points[tt + 2][0] = mix(points[tt + 2][0], points[tt - 1][0] - nudge , percent_done_real, pp, 1.0);
        points[tt + 3][0] = mix(points[tt + 3][0], points[tt - 1][0] - nudge , percent_done_real, pp, 1.0); 
        points[tt + 4][0] = mix(points[tt + 4][0], points[tt - 1][0] - nudge , percent_done_real, pp, 1.0);
      }

      tt = 8;
      points[tt][0] = points[tt][0] + (self.closing ? 0 : mix(0, mix(4, 0, percent_done, 0, 1), percent_done, 0, 0.3));
      tt = L-tt-1;
      points[tt][0] = points[tt][0] + (self.closing ? 0 : mix(0, mix(4, 0, percent_done, 0, 1), percent_done, 0, 0.3));

      
      // points = points.map((e, i)=>[(i>0&&i<points.length-1&&e[0]>width)?width:e[0],height-e[1]])
      points = points.map((e, i) => [e[0], height - e[1]])

      const pointsPositions = pointsPositionsCalc(points, width, height, {
        yMin: 0,
        yMax: height,
        xMin: 0,
        xMax: width
      })
      const path = svgPath(pointsPositions);
      var changed = path_dom.getAttribute('d') != path;
      
      if (changed){
        path_dom.setAttributeNS(null,'d', path);
  
        if (true){
          /*
          var temp = document.createElement('div');
          obj.appendChild(temp);
          obj.offsetHeight; 
          temp.remove();
          */
          obj.style.display = 'inline-flex';
          obj.offsetHeight; // no need to store this anywhere, the reference is enough
          obj.style.display = 'flex';
          
        }
        
      }
      
      if (debug)
        curtain.querySelector('g').innerHTML = svgCircles(pointsPositions);

      requestAnimationFrame(update);
      
      }catch(err){
        console.error(err);
      }
    }

    update();

    function moveCurtain(e) {
      if (!self.mousedown) {
        return;
      }
      var pos = pointerEventToXY(e);
      self.endX = pos.x;
      self.endY = pos.y;
    }
    

    function between(x, a, b) {
      return x < b && x > a;
    }

    function closeNextCurtain(){
      var nextCurtain = obj.querySelectorAll('.curtain-page');
      nextCurtain.forEach(nextCurtain=>nextCurtain.curtain.hide());

    }

    var hasBeenTouchedRecently = false;

    function startCurtain(e) {
      if(hasBeenTouchedRecently) {
        return;
      }
      hasBeenTouchedRecently = true;
      setTimeout(() => { hasBeenTouchedRecently = false; }, 300);
      e.preventDefault();
      e.stopPropagation();
      
      let _x, _y;
      let path = e.composedPath();
      let next_curtain = self.obj.querySelector('.curtain-page');
      
      if (self.closed || !self.start || (!self.obj.contains(path[0]) || (next_curtain && next_curtain.contains(path[0]))))
        return;
        
      var pos = pointerEventToXY(e);
      _x = pos.x;
      _y = pos.y;
      var opened = self.endX <= -width / 2;
      if (!opened) {
        if (!between(_y, but_y_pos_actual - but_size, but_y_pos_actual + but_size)) {
          return;
        }
        if (!between(_x, width - but_size, width + but_size)) {
          return;
        }
      } else if (_x > 40) {
        return;
      }
      if (opened) {
        closeNextCurtain();
      }
      self.closing = !opened;

      self.mousedown = true;
      self.startX = opened ? width : _x;
      self.startY = _y;
      
      moveCurtain(e);
      return true;
    }

    function show() {
      self.start = true;
      self.closing = true;
    }

    function hide() {
      self.start = false;
      self.closing = false;
      self.mousedown = false;
      self.startX = 0;
      self.startY = 0;
      self.endX = 0;
      self.endY = 0;
    }

    function endCurtain(e) {
      e.preventDefault();
      e.stopPropagation();
      
      let _x, _y;
      var pos = pointerEventToXY(e);
      _x = pos.x;
      _y = pos.y;
      
      if (!self.mousedown)
        return;
      self.mousedown = false;
      var opened = !self.closing;
      var clicked = self.closing && self.startX == _x && self.startY == _y;

      if (clicked || (self.endX - self.startX < (!opened ? -width / 3 : -width * 2 / 3))) {
        self.startX = 0;
        self.endX = -width / but_over_ratio - 3;
        if (self.next)
          self.next(self)

        if (!self.reversible)
          self.closed = true;
      } else {
        self.startX = 0;
        self.startY = 0;
        self.endX = 0;
        self.endY = 0;
      }
    }

    self.show = show;
    self.hide = hide;
    self.endCurtain = endCurtain;

    document.addEventListener('mousedown', (e) => {
      if (startCurtain(e))
        document.addEventListener('mousemove', moveCurtain)
    })

    document.addEventListener('mouseup', (e) => {
      endCurtain(e)
      document.removeEventListener('mousemove', moveCurtain);
    })

    document.addEventListener('touchstart', startCurtain);
    document.addEventListener('touchend', function (e) {
      endCurtain(e)
    });

    document.addEventListener('touchmove', moveCurtain, { passive: false });

    return self;

  }
  return makeCurtain;
})();

function makeCurtains(wrapper) {
  var children = Array.from(wrapper.children);
  children.reverse();

  children.forEach((e, i) => {
    if (children[i + 1]) {
      var config = e.getAttribute('curtain-config') || "{}";
      config = eval('(' + config + ')');
      children[i + 1].appendChild(e);
      e.classList.add('curtain-page')
      makeCurtain(e, config);
      if (i == children.length - 2) {
        e.curtain.show();
      } else {
        e.curtain.hide();

      }
    }
  });

}
export {
  makeCurtains
};