// Robert Gorr-Grohmann
// 2025-01-01
// Collection of helpful functions
//   Calculating global configuration variables
//   Test handling
//   Error handling
class Help {
  constructor() {
    this.btst = false;
    this.btstAut = false;
    this.btstConf = false;
    this.btstRuntime = false;
//   color
  this.colorArray = [
  ["red",[255,0,0,255]],
  ["green",[0,255,0,255]],
  ["yellow",[0,255,255,255]],
  ["petrol",[0,95,106,255]],
  ["blue",[0,0,255,255]],
  ["cyan",[0,255,255,255]],
  ["magenta",[255,0,255,255]],
  ["gold",[255,215,0,255]],
  ["türkis",[64,224,208,255]],
  ["silber",[192,192,192,255]],
  ["white",[255,255,255,255]],
  ["black",[0,0,0,255]]
];
//   format
  this.displayformatArray = [
  ["A4-Portrait",15,22],
  ["A4-Landscape",22,15],
  ["Widescreen-P",12,19],
  ["Widescreen-L",19,12],
  ["Smartphone-P",9,16],
  ["Smartphone-L",16,9]
];
// Snailtypes
  this.snailtypeArray = [
    ["All",0],
    ["One",1]
  ];  
  }
//
//  Check and set configuration
//
  chkDisplayformatAndGeometry() {
    let h0, h1, h2;
    // Canvas width and height
    let w0 = int(innerWidth-4);    
    h0 = int(innerHeight-4);
    let nr = 0;
    for(let i=0;i<this.displayformatArray.length;i++) {
      if (this.displayformatArray[i][0] 
          ==displayformat.val[0]) {
        nr=i;
      }
    }
    let x = w0 / displayformat.val[1];
    if (x*displayformat.val[2]>h0) {
      x = h0 / displayformat.val[2];
      canvaswidth = int(
        x*displayformat.val[1]);
      canvasheight = h0;
    } else {
      canvaswidth = w0;
      canvasheight = int(
        x*displayformat.val[2]);
    }
    hlp.tstConf("displayformat|X|Y|W|H",
                displayformat.val[0],
                displayformat.val[1],
                displayformat.val[2],
                canvaswidth,
                canvasheight);
    this.chkRectcntx(true);
  }
  chkRectcntx(setval_) {
    if (setval_) {
      rectcntx = new SliderValue("rectcntx",6,2,
                    int(canvaswidth/rectsizemin-1));
    }
    rectsize = int(canvaswidth/rectcntx.val-1);
    rectcnty = int(canvasheight/rectsize);
    hlp.tstConf("rectcntx|rectcnty|rectsize",
                rectcntx.val,rectcnty,rectsize);
    this.chkLinesize(true);
  }
  chkLinesize(setval_) {
    if (setval_) {
      linesize = new SliderValue("linesize",
                  int(rectsize/6),1,int(rectsize/4));
    }
    hlp.tstConf("linesize",linesize.val);
    this.chkCentralvector();
  }
  chkCentralvector() {
    centralvector = createVector(
      (canvaswidth-(rectcntx.val*rectsize))/2,
      (canvasheight-(rectcnty*rectsize))/2);
    hlp.tstConf("centralvector X|Y",
                centralvector.x,centralvector.y);
  }
  chkSnailparams() {
    snailtype = 
      new RadioValue("snailtype",0,
                     this.snailtypeArray);
    snailmaxcnt = 
      new SliderValue("snailmaxcnt",10,1,30);
    snailminlen = 
      new SliderValue("snailminlen",2,1,5);
    hlp.tstConf("snailmaxcnt|snailminlen",
               snailmaxcnt.val,snailminlen.val);    
  }
  chkColors(setval_) {
    let rand = 0;
    if (setval_) {
      rand = int(random(this.colorArray.length));
      bgcolor = 
        new RadioValue("bgcolor",rand,this.colorArray);
    } else {
      for (let i=0;i<this.colorArray.length;i++) {
        if (bgcolor[0]==this.colorArray[i]) {
          rand = i;
        }
      }
    }
    rand = (rand+1==this.colorArray.length?0:rand+1);
    linecolor = this.colorArray[rand].slice(0);
    hlp.tstConf("linecolor",linecolor[0]);
    hlp.tstConf("bgcolor",bgcolor.val[0]);
  }
  chkFrames() {
    frames   = new SliderValue("frames",24,1,24);
    frameRate(frames.val);
    hlp.tstConf("frames",frames.val);
  }
//
// Colors
//
  colNextLinecolor() {
    let i = int(random(this.colorArray.length));
    if (this.colorArray[i][0]==bgcolor.val[0]) {
      i = (i+1==this.colorArray.length?0:i+1);
    }
    linecolor = this.colorArray[i];
  }
//
//  Test handling
//
  tst() {
    if (this.btst) {
      let s = "Tst "+arguments[0]+"=>";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstOn() {this.btst = true;}
  tstOff() {this.btst = false;}
  tstAut() {
    if (this.btstAut) {
      let s = "AutTest "+arguments[0]+": ";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstAutOn() {this.btstAut = true;}
  tstAutOff() {this.btstAut = false;}
  tstConf() {
    if (this.btstConf) {
      let s = "ConfTest "+arguments[0]+": ";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstConfOn() {this.btstConf = true;}
  tstConfOff() {this.btstConf = false;}
  tstRuntime() {
    if (this.btstRuntime) {
      let s = "Runtime "+arguments[0]+": ";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstRuntimeOn() {this.btstRuntime = true;}
  tstRuntimeOff() {this.btstRuntime = false;}
//
//  Error handling
//
  err() {
    let s = "Error "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
  errAut() {
    let s = "AutError "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
}
//
// Slider-Values
//
class SliderValue {
  constructor(name_,default_,min_,max_) {
    this.nam = name_;
    this.val = int(default_);
    this.min = min_;
    this.max = max_;
  }
  set(value_){
    this.val = (value_<this.min
        ?this.min
        :(value_>this.max?this.max:int(value_)));
  }
//  tst(){return(this.nam+"="+this.val);}
}
//
// Radio-Values
//
class RadioValue {
  constructor(name_,default_,array_) {
    this.nam = name_;
    this.arr = array_.slice(0);
    this.val = this.arr[int(default_)].slice(0);
  }
  set(value_){
    this.val = value_;
  }
}
