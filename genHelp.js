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
  }
//
//  Check Configuration
//
  chkConfFormat() {
    let h0, h1, h2;
    // Canvas width and height
    let w0 = int(innerWidth-4);    
    h0 = int(innerHeight-4);
    let nr = 0;
    for(let i=0;i<this.displayformatArray.length;i++) {
      if (this.displayformatArray[i][0] 
          ==displayformat[0]) {
        nr=i;
      }
    }
    let x = w0 / this.displayformatArray[nr][1];
    if (x*this.displayformatArray[nr][2]>h0) {
      x = h0 / this.displayformatArray[nr][2];
      canvaswidth = int(
        x*this.displayformatArray[nr][1]);
      canvasheight = h0;
    } else {
      canvaswidth = w0;
      canvasheight = int(
        x*this.displayformatArray[nr][2]);
    }
  }
  XchkConfRectangle() {
    let h0, h1, h2;
    // Count rectangles in X and Y and the size
    rectsize = int(canvaswidth/cntrectx.val-1);
    cntrecty = int(canvasheight/rectsize);
    this.tstConf("Count X|Y|Size",
                 cntrectx.val,cntrecty,rectsize);
    // Compute cntralization vector
    h0 = (canvaswidth-(cntrectx*rectsize))/2;
    h1 = (canvasheight-(cntrecty*rectsize))/2;
    addv = createVector(h0,h1);
  }
  chkConfColor() {
    let h0, h1, h2;
    // Colors
    for (let i=0;i<this.colorArray.length;i++) {
      if (this.colorArray[i][0]==bgcolor[0]) {
        let j = (i+1==this.colorArray.length?0:i+1);
        linecolor = this.colorArray[j].slice(0);
      }
    }
  }
//
// Colors
//
  colNextLinecolor() {
    let i = int(random(this.colorArray.length));
    if (this.colorArray[i][0]==bgcolor[0]) {
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
// Min-Max-Values
//
class MinMaxValue {
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
  tst(){return(this.nam+"="+this.val);}
}
