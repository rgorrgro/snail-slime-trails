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
let rectcntx, rectcnty;
let rectsizemin;
let rectsize;
//   line size
let linesize;
//   colors
let bgcolor, linecolor;
//   snail numbers and length
let snailtype, snailmaxcnt, snailminlen;
// etc
let centralvector;
let cyclesperrect = 30;
//let snailtype = "All";
//let snailtypeArray = ["All","One"];
let colors;
//
function setup() {
  hlp = new Help();
  hlp.tstOff();
  hlp.tstAutOff();
  hlp.tstConfOn();
  canvaswidth = innerWidth;
  canvasheight = innerHeight;
  //displayformat = hlp.displayformatArray[4];
  displayformat = 
    new RadioValue("displayformat",
                   4,hlp.displayformatArray);
  rectsizemin = 15;
  // Check and set
  //   Canvas width and height
  //   Rectangles numbers in X and Y and size
  //   Linesize
  //   Centralization vector
  hlp.chkDisplayformatAndGeometry();
  // Snail params
  hlp.chkSnailparams();
  // Colors
  hlp.chkColors(true);
  colorMode(RGB, 255);
  background(bgcolor.val[1]);
  // Frames
  hlp.chkFrames();
  hlp.tstConf("That´s all!")
  frameRate(frames.val);
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
      background(bgcolor.val[1]);
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
    this.makeNewSnails();
  }
  makeNewSnails() {
    this.snailsObj = undefined;
    this.snailsObj = 
      new Snails(rectsize,rectcntx.val,
                 rectcnty,centralvector);
    this.snailsList = [];
    this.snailsList = 
      this.snailsObj.getSnailsAsBezier(
        snailminlen.val);
    this.snailsAdaList = [];
    this.timemaxlen = 0;
    this.timemeanlen = 0;
    for (let i=0;i<this.snailsList.length;i++) {
      let x = new SnailAda2(i,this.snailsList[i]);
      if (this.timemaxlen<=this.snailsList[i].length) {
        this.timemaxlen = this.snailsList[i].length;
      }
      this.timemeanlen += this.snailsList[i].length;
      this.snailsAdaList.push(x);
    }
    this.timemeanlen = 
      this.timemeanlen/this.snailsList.length;
    //this.starttime(maxlen,meanlen);
    this.drawstate = 0;
  }
  drawSnail() {
    if (this.drawstate==0) {
      this.drawstart();
      this.drawstate = 1;
    }
    if (this.drawstate==2) {
      this.drawend();
      this.drawstart();
      for(let i=0;i<this.snailsList.length;i++) {
        this.snailsAdaList[i].reinit(bgcolor.val[1]);
      }
      this.drawstate = 3;
    }
    if (this.drawstate==4) {
      this.drawend();
      background(bgcolor.val[1]);
      hlp.colNextLinecolor();
      this.makeNewSnails();
      this.drawstate = 0;
      return;
    }
    let cnt = [0,0,0,0,0];
    for(let i=0;i<this.snailsList.length;i++) {
      this.snailsAdaList[i].draw();
      cnt[this.snailsAdaList[i].type] += 1;
    }
    //
    if (this.drawstate==1) {
      if (cnt[0]>0) {
        if (cnt[1]<snailmaxcnt.val) {
          let j = int(random(this.snailsList.length));
          for (let k=0; k<this.snailsList.length;k++) {
            let l = (j+k<this.snailsList.length
                     ?j+k
                     :j+k-this.snailsList.length);
            if (this.snailsAdaList[l].type==0) {
              this.snailsAdaList[l].startSnail(1);
              k = this.snailsList.length;
            }
          }
        }
      } else {
        if (cnt[1]==0) {this.drawstate = 2;}      
      }
    }
    //
    if (this.drawstate==3) {
      if (cnt[2]>0) {
        if (cnt[3]<snailmaxcnt.val) {
          let j = int(random(this.snailsList.length));
          for (let k=0; k<this.snailsList.length;k++) {
            let l = (j+k<this.snailsList.length
                     ?j+k
                     :j+k-this.snailsList.length);
            if (this.snailsAdaList[l].type==2) {
              this.snailsAdaList[l].startSnail(3);
              k = this.snailsList.length;
            }
          }
        }
      } else {
        if (cnt[3]==0) {this.drawstate = 4;}      
      }
    }
  }
  drawstart () {
    let d = new Date();
    this.timestart = d.getTime();
    this.timetarget = 150; 
    hlp.tstRuntime("timetarget",this.timetarget);
    hlp.tstRuntime("timemaxlen",this.timemaxlen);
    hlp.tstRuntime("timemeanlen",this.timemeanlen);
    this.timecntsnails = this.snailsList.length;
    hlp.tstRuntime("timecntsnails",
                     this.snailsList.length);
    //}
  }
  drawend () {
    let d = new Date();
    this.timeend = d.getTime();
    this.timedelta = 
      (this.timeend-this.timestart)/1000; 
    hlp.tstRuntime("timedelta",this.timedelta);
    hlp.tstRuntime("cyclesperrect1",cyclesperrect);
    let x = this.timetarget/this.timedelta;
    cyclesperrect *= x;
    cyclesperrect = (cyclesperrect<25?25
                     :(cyclesperrect>250?250
                       :int(cyclesperrect)));
    hlp.tstRuntime("cyclesperrect2",cyclesperrect);
    hlp.tstRuntimeOff();
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
    this.colorDraw = color_.slice(0);    
  }
  startSnail(state_) {
    this.type=state_;
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
      case 3:
        if(!this.drawHlp()) {
          this.type = 4;
        }
      break;
    }
  }
  drawHlp() {
    let t = 0;
    this.cycle0 += 1;
    if (this.cycle0<cyclesperrect) {
      t = (this.tempo*this.cycle0)/cyclesperrect;
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
