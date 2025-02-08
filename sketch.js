// R. Gorr-Grohmann
//  October 2024
//
let fileInOut;
let canvas;
let bgColor;
let sColor;
let dialog;
let snailsAda;
//
// number of draw calls per second
let nrFrameRate = 20;
// mean number of makeSnail calls which create a snail
let nrMeanMakeCalls = 20;
// Number of rectangles in X and Y
let nrXRectangles = 12;
let nrYRectangles = 12;
// size of snails
let snailSize = 5;
//
function setup() {
  // File In/Out
  fileInOut = new FileInOut("snail","jpg");
  // Canvas
  canvas = createCanvas(500, 500);
  // Color
  colorMode(RGB, 255);
  bgColor = new ChangingColors('Background', 
    [64,0,128,255],[192,128,255,255],
    [96,32,192,255],[1,1,1,0]); 
  sColor = new ChangingColors('Snails', 
    [192,192,0,255],[255,255,64,255],
    [224,224,32,255],[7,11,1,0]); 
  // Main dialog
  dialog = new Dialog(
    //initDrawInit
    (p1_,p2_) => {background(bgColor.getStepColor());},
    //runningDrawRunning
    (p1_,p2_) => {
      if (int(random(nrMeanMakeCalls))==1) {
        snailsAda.makeSnail();
      }
      snailsAda.drawSnail();
      snailsAda.deleteSnail();
    },
    //runningStopInit
    (p1_,p2_) => {snailsAda = new SnailsAda();}
  );
  // Snails Adapter
  snailsAda = new SnailsAda();
  //print(snailsAda.toString());
}
//
function draw() {
  frameRate(nrFrameRate); // framesPerSec
  dialog.auto.event(dialog.enumDRAW, {});
}
//
// Snails Adapter
//
class SnailsAda {
  constructor () {
    //print("SnailsAda|const");
    this.snails = new Snails 
      (nrXRectangles,nrYRectangles);
    this.snailsLen = this.snails.arr.length;
    this.arr = [];
  }
  noToString() {
    let s = "SnailsAda Numbers";
    s += " #snails="+this.snailsLen;
    s += " #drawing="+this.arr.length;
    return(s);
  }
  drawSnail() {
    //print("SnailsAda|drawSnail B ");
    for(let i=0;i<this.arr.length;i++) {
      this.arr[i].draw();
    }
    //print("SnailsAda|drawSnail E ");
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
    circle(x,y,snailSize);
    return(true);
  }
}
