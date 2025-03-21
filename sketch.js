// R. Gorr-Grohmann
//  February 2025
//  Drawing colored snail slime pathes
//  Background format and geometry can be configured.
//  Some colors, numbers and sizes, too.
//  
// Run time global parammeters
let hlp;
let fileInOut;
let canvas;
let dialogMain;
let snailsAda;
//
// Config global parameters
//   number of draw calls per second
let frames;
//   format
let displayformat;
//   canvas size
//let canvaswidthmin = 200;
let canvaswidth, canvasheight;
//   rectangle number and size 
let cntrectx, cntrecty;
let rectsizemin;
let rectsize;
//   line size
let linesize;
//   colors
let bgcolor, linecolor;
//   snail numbers and length
let snailcnt, snaillen;
// etc
let addv;
let snailtype = "All";
let snailtypeArray = ["All","One"];
let colors;
//
function setup() {
  hlp = new Help();
  hlp.tstOff();
  hlp.tstAutOff();
  hlp.tstConfOff();
  // Canvas width and height
  canvaswidth = innerWidth;
  canvasheight = innerHeight;
  displayformat = hlp.displayformatArray[4];
  hlp.chkConfFormat();
  hlp.tstConf("Format|X|Y",displayformat[0],
           displayformat[1],displayformat[2]);
  hlp.tstConf("Display W|H",canvaswidth,canvasheight);
  // Rectangles numbers in X and Y and size
  rectsizemin = 15;
  cntrectx = new MinMaxValue("RectCntX",5,2,
                  int(canvaswidth/rectsizemin-1));
  rectsize = int(canvaswidth/cntrectx.val-1);
  cntrecty = int(canvasheight/rectsize);
  hlp.tstConf("Count X|Y|Size",
               cntrectx.val,cntrecty,rectsize);
  // Centralization vector
  addv = createVector(
    (canvaswidth-(cntrectx*rectsize))/2,
    (canvasheight-(cntrecty*rectsize))/2);
  // Linesize
  linesize = new MinMaxValue("Linesize",
                  int(rectsize/5),
                  1,int(rectsize/4));
  hlp.tstConf("Linesize",linesize.val);
  //
  snailcnt = new MinMaxValue("SnailMaxCnt",5,1,20);
  snaillen = new MinMaxValue("SnailMinLen",3,1,5);
  hlp.tstConf("Snail MaxCnt|MinLen",
               snailcnt.val,snaillen.val);
  // Colors
  bgcolor = hlp.colorArray[6];
  linecolor = hlp.colorArray[7];
  hlp.chkConfColor();
  hlp.tstConf("Color BG|Line",bgcolor,linecolor);
  colorMode(RGB, 255);
  background(bgcolor[1]);
  //
  frames   = new MinMaxValue("Frames",24,1,24);
  frameRate(frames.val);
  hlp.tstConfOff();
  // Canvas
  canvas = createCanvas(canvaswidth,canvasheight);
  // Dialog
  dialogMain = new DialogMain(
    //S=Init,E=Run,NS=Running
    (p1_,p2_) => {
      snailsAda = new 
        SnailsAdaFixNumberOfSnails();
      hlp.tst("S=Init,E=Run,NS=Running");
      //background(colors.getBgcolor());
      background(bgcolor[1]);
    },
    //S=Running,E=Draw,NS=Running
    (p1_,p2_) => {
      hlp.tst("S=Running,E=Draw,NS=Running");
      snailsAda.drawSnail();
    }
  );
  dialogMain.init();
}
//
function draw() {
  hlp.tst("Main|draw ");
  dialogMain.event(4);
}
//
// Snails Adapter
//
class SnailsAdaFixNumberOfSnails {
  constructor () {
    //hlp.tst("SnailsAda|const");
    //this.snailcntmax = snailcntmax_;
    this.isDraw0 = false;
    //
    this.makeNewSnails();
  }
  makeNewSnails() {
    this.snailsObj = undefined;
    this.snailsObj = 
      new Snails(rectsize,cntrectx.val,cntrecty,addv);
    this.snailsList = [];
    this.snailsList = 
      this.snailsObj.getSnailsAsBezier(snaillen.val);
    this.snailsAdaList = [];
    for (let i=0;i<this.snailsList.length;i++) {
        let x = new SnailAda2(i,this.snailsList[i]);
        this.snailsAdaList.push(x);
    }
  }
  drawSnail() {
    hlp.tst("SnailsAda|drawSnail",
            this.snailsList.length);
    let len = this.snailsList.length;
    let h0 = 0;
    for(let i=0;i<len;i++) {
      hlp.tst("SnailsAda|drawSnail Index",i);
      this.snailsAdaList[i].draw();
      if(this.snailsAdaList[i].type==1) {h0+=1;}
    }
    for (let i=h0;i<snailcnt.val;i++) {
      //print("Index "+i);
      let j = int(random(len));
      for (let k=0; k<len;k++) {
        let l = (j+k<len?j+k:j+k-len);
        if (this.snailsAdaList[l].type==0) {
          this.snailsAdaList[l].startSnail();
          k = len;
        }
      }
    }
    let allType2 = true;
    for(let i=0;i<len;i++) {
      if(this.snailsAdaList[i].type==0) {
        allType2 = false;
      }
      if(this.snailsAdaList[i].type==1) {
        allType2 = false;
      }
    }
    if (allType2) {
      let col;
      if (this.isDraw0) {
        //background(colors.getBgcolor());
        background(bgcolor[1]);
        this.makeNewSnails();
        len = this.snailsList.length;
        hlp.colNextLinecolor();
        col = linecolor[1];
        this.isDraw0 = false;
      } else {
        col = bgcolor[1];
        this.isDraw0 = true;
      }
      for(let i=0;i<len;i++) {
        this.snailsAdaList[i].reinit(col);
      }
    }
  }
}
class SnailAda2 {
  constructor (nr_,path_) {
    this.nr = nr_;
    this.path = [];
    for (let i=0;i<path_.length;i++) {
      this.path.push(path_[i]);
    }
    this.part = this.path[0];
    this.tempo = 1;
    this.type = 0;
    this.colorDraw = linecolor[1];
  }
  reinit(color_) {
    this.part = this.path[0];
    this.tempo = 1;
    this.type = 0;
    this.colorDraw = color_.slice(0);    
  }
  startSnail() {
    //print("Start Snail "+this.nr);
    this.type=1;
    this.cycle0=0;
    this.cycle1=0;
    this.drawHlp();
  }
  draw() {
    switch(this.type) {
      case 0:
      break;
      case 1:
        if(!this.drawHlp()) {
          this.type = 2;
        }
      break;
      case 2:
      break;
    }
  }
  drawHlp() {
    let t = 0;
    this.cycle0 += 1;
    if (this.cycle0<100) {
      t = (this.tempo*this.cycle0)/100
    } else {
      this.cycle0 = 0;
      this.cycle1 += 1;
      if (this.cycle1<this.path.length) {
        t = 0;
        this.part = this.path[this.cycle1];
      } else {
        this.cycle1 = 0;
        this.drawing = false;
        return(false);
      }
    }
    let x = bezierPoint(this.part[0][0],
      this.part[1][0], this.part[2][0], 
      this.part[3][0], t);
    let y = bezierPoint(this.part[0][1],
      this.part[1][1], this.part[2][1], 
      this.part[3][1], t);
    //stroke(this.colorDraw);
    noStroke();
    fill(this.colorDraw);
    circle(x,y,linesize.val);
    return(true);
  }
}
