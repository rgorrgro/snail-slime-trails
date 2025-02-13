// R. Gorr-Grohmann
//  2025-02-11
//
let hlp;
//
let fileInOut;
let canvas;
let bgColor;
let sColor;
let dialog;
let snailsAda;
//
// size of display
let dwidth = 100;
let dheight = 100;
// number of draw calls per second
let frames = 24;
// format
let sformat = "Smartphone-P";
let aformat = [];
// rectangle and line sizes
let sizeRect = 80;
let sizeLine = 8;
// number of rectangles in X and Y
let cntRectX = 12;
let cntRectY = 12;
// mean number of makeSnail calls which create a snail
let nrMeanMakeCalls = 20;
//
function setup() {
  // Config Help Functions
  hlp = new Help();
  hlp.dspSetSizes1(innerWidth,innerHeight,sformat);
  hlp.dspSetSizes2(sizeLine,sizeRect);
  dwidth = hlp.dspGetWidth();
  dheight = hlp.dspGetHeight();
  sizeLine = hlp.dspGetSizeLine();
  sizeRect = hlp.dspGetRectangleSize();
  cntRectX = hlp.dspGetRectangleX();
  cntRectY = hlp.dspGetRectangleY();
  // File In/Out
  fileInOut = new FileInOut("snail","jpg");
  // Canvas
  canvas = createCanvas(dwidth,dheight);
  // Color
  colorMode(RGB, 255);
  bgColor = new ChangingColors('Background', 
    [64,0,128,255],[192,128,255,255],
    [96,32,192,255],[1,1,1,0]); 
  sColor = new ChangingColors('Snails', 
    [192,192,0,255],[255,255,64,255],
    [224,224,32,255],[7,11,1,0]);
  background(bgColor.getStepColor());
// Main dialog
    dialog = new Dialog(
    //S=Init,E=Run,NS=Running
    (p1_,p2_) => {
      hlp.tst("S=Init,E=Run,NS=Running");
      background(bgColor.getStepColor());
    },
    //S=Running,E=Draw,NS=Running
    (p1_,p2_) => {
      hlp.tst("S=Running,E=Draw,NS=Running");
      if (int(random(nrMeanMakeCalls))==1) {
        hlp.tst("make new snail");
        snailsAda.makeSnail();
      }
      snailsAda.drawSnail();
      snailsAda.deleteSnail();
    },
    //S=Running,E=Stop,NS=Init
    (p1_,p2_) => {
      hlp.tst("S=Running,E=Stop,NS=Init");
      snailsAda = new SnailsAda();
    },
    //S=Confing,E=Config,NS=Init
    (p1_,p2_) => {
      hlp.tst("S=Confing,E=Config,NS=Init");
      frames = dialog.getValue(0);
      //sformat = aformat[dialog.getValue(1)];
      hlp.tst("frames=",frames);
      frameRate(frames);
    }
  );
  // Config Dialog
  
  hlp.tst("frames:",frames);
  dialog.createSlider(
      'frames',25,frames,1,24);
  hlp.tst("sformat:",sformat);
  //aformat = hlp.dspGetFormatNameArray();
  hlp.tst("aformat:",aformat);
  //dialog.createRadio(
  //    'format',50,sformat,aformat);
  // Start adapter
  //hlp.tstOn();
  //hlp.tstAutOn();
  snailsAda = new SnailsAda();
  frameRate(frames);
}
//
function draw() {
  hlp.tst("Main|draw");
  dialog.auto.event(dialog.enumDRAW, {});
}
//
// Snails Adapter
//
class SnailsAda {
  constructor () {
    hlp.tst("SnailsAda|const");
    this.snails = new Snails (cntRectX,cntRectY);
    this.snailsLen = this.snails.arr.length;
    hlp.tst("SnailsAda|const snailsLen",
      this.snailsLen);
    this.arr = [];
  }
  noToString() {
    let s = "SnailsAda Numbers";
    s += " #snails="+this.snailsLen;
    s += " #drawing="+this.arr.length;
    return(s);
  }
  drawSnail() {
    //hlp.tst("SnailsAda|drawSnail B ");
    for(let i=0;i<this.arr.length;i++) {
      this.arr[i].draw();
    }
    //hlp.tst("SnailsAda|drawSnail E ");
  }
  deleteSnail() {
    //print("SnailsAda|deleteSnail B "+
    //     "#arr="+this.arr.length);
    for(let i=this.arr.length-1;i>=0;i--) {
      if (!this.arr[i].drawing) {
        //print("SnailsAda|deleteSnail delete no="+i);
        this.arr.splice(i,1);
      }
    }
    //print("SnailsAda|deleteSnail E "+
    //     "#arr="+this.arr.length);
  }
  makeSnail() {
    //print("SnailsAda|makeSnail B "+
    //     "#arr="+this.arr.length);
    let i = int(random(this.snailsLen));
    for(let j=0;j<this.snailsLen;j++) {
      let k = i+j-
          (i+j>=this.snailsLen
           ?this.snailsLen
           :0);
      if(this.snails.arr[k].arr.length>0) {
        let sAda = new SnailAda 
                  (k,
                   this.snails.getSnail(k));
        sAda.color = sColor.getStepColor();
        sAda.drawing = true;
        this.arr.push(sAda);
        //print("SnailsAda|makeSnail make no="+
        //      this.arr.length);
        let l = this.arr.length-1;
        //print(this.arr[l].toString());
        j = this.snailsLen;
      }
    }
    //print("SnailsAda|makeSnail E "+
    //     "#arr="+this.arr.length);
  }
}
class SnailAda {
  constructor (no_,snail_) {
    //print("SnailAda|constructor "+no_);
    this.no = no_;
    this.color = [0,0,0,255];
    this.cycle0 = 0;
    this.cycle1 = 0;
    this.tempo = 1;
    this.snail = snail_;
    //this.snailPart = this.snail.getSnailPart(0); 
    this.snailPart = this.snail.arr[0];
    //print("SnailPart="+this.snailPart);
  }
  toString() {
    let s = "SnailAda no="+this.no
      +",color="+this.color
      +","+this.snail.toString();
    return(s);
  }
  draw() {
    //print("SnailAda|draw "+this.no+
    //     ",snailPart: "+this.cycle1+
    //     ",snailTop: "+this.cycle0+
    //     "");
    let t = 0;
    this.cycle0 += 1;
    if (this.cycle0<100) {
      t = (this.tempo*this.cycle0)/100
    } else {
      this.cycle0 = 0;
      this.cycle1 += 1;
      if (this.cycle1<this.snail.arr.length) {
        t = 0;
        this.snailPart = this.snail.arr[this.cycle1];
//          this.snail.getSnailPart(this.cycle1); 
        //print("SnailPart="+this.snailPart);
        //this.snailPart = this.snail[this.cycle1];
      } else {
        this.cycle1 = 0;
        this.drawing = false;
        return(false);
      }
    }
    let x = bezierPoint(this.snailPart.aa.x,
      this.snailPart.ac.x, this.snailPart.bc.x, 
      this.snailPart.ba.x, t);
    let y = bezierPoint(this.snailPart.aa.y, 
      this.snailPart.ac.y, this.snailPart.bc.y, 
      this.snailPart.ba.y, t);
    stroke(this.color);
    fill(this.color);
    circle(x,y,sizeLine);
    return(true);
  }
}
