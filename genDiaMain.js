//
// Robert Gorr-Grohmann
// 2024-12-15
//
"use strict";
class DialogMain {
  constructor(initRunRunning_,runningDrawRunning_) {
    this.initRunRunning = initRunRunning_;
    this.runningDrawRunning = runningDrawRunning_;
    this.aname = "DiaMain";
    //
    this.snr = 0;
    //
    this.aState = 
      ["START","INIT","HALT","CONFIG","RUN",
       "PAUSE"];
    let sST = 0;
    let sIN = 1;
    let sHA = 2;
    let sCO = 3;
    let sRU = 4;
    let sPA = 5;
    this.aEvent = 
      ["INIT","RUN","CONFBEG","CONFEND","DRAW",
       "PAUSE","SAVE","HALT"];
    let eIN = 0;
    let eRU = 1;
    let eCB = 2;
    let eCE = 3;
    let eDR = 4;
    let ePA = 5;
    let eSA = 6;
    let eHA = 7;
	this.mNextState = [
    // INI RUN CBE CEN DRA PAU SAV HAL
      [  1,  1, -1, -1, -1, -1, -1, -1], // START
      [ -1,sRU,sCO, -1,sIN,sIN, -1, -1], // INIT
      [ -1, -1, -1, -1,sHA,sHA, -1, -1], // HALT
      [ -1, -1, -1,sIN,sCO,sCO, -1, -1], // CONFIG
      [ -1, -1, -1, -1,sRU,sPA, -1, -1], // RUN
      [ -1,sRU, -1, -1,sPA,sPA,sPA,sHA], // PAUSE
    ];
	this.mNextFunction = [
    // INI RUN CBE CEN DRA PAU SAV HAL
      [  1, -1, -1, -1, -1, -1, -1, -1], // START
      [ -1,  2,  8, -1, 10,  0, -1, -1], // INIT
      [ -1, -1, -1, -1,  0,  0, -1, -1], // HALT
      [ -1, -1,  0,  9,  0,  0, -1, -1], // CONFIG
      [ -1, -1, -1, -1,  4,  3, -1, -1], // RUN
      [ -1,  5, -1, -1,  0,  0,  6,  7], // PAUSE
    ];
    this.aFunction = [
    // 0
      () => {},
    // 1
      () => {
        // Menue INIT
        let bRun1 = this.makeButton("RUN",
                    50,100,"yellow",() => {
                    this.event(eRU);});
        let bConf1 = this.makeButton("CONFIG",
                    150,100,"yellow",() => {
                    this.event(eCB);});
        this.divINIT = createDiv();
        this.divINIT.child(bRun1);
        this.divINIT.child(bConf1);
        this.divINIT.style("display","none");
        //
        let bRun2 = this.makeButton("RUN",
                    50,100,"yellow",() => {
                    this.event(eRU);});
        let bSave = this.makeButton("SAVE",
                    150,100,"yellow",() => {
                    this.event(eSA);});
        let bHalt = this.makeButton("HALT",
                    250,100,"yellow",() => {
                    this.event(eHA);});
        this.divPAUSING = createDiv();
        this.divPAUSING.child(bRun2);
        this.divPAUSING.child(bHalt);
        this.divPAUSING.child(bSave);
        this.divPAUSING.style("display","none");
        // Display Dialog INIT
        this.divINIT.style("display","block");
      },
    // 2
      ()=>{
        canvas.mouseClicked(() => { 
          this.event(5);
        });
        this.divINIT.style("display","none");
        this.makeCanvas();
        background(bgcolor[1]);
        this.initRunRunning();
      }, 
    // 3
      () => {
        this.divPAUSING.style("display","block"); 
      },
    // 4
      () => {
        this.runningDrawRunning();
      }, 
    // 5
      () => {
        this.divPAUSING.style("display","none"); 
      }, 
    // 6
      () => {
        //work.save("mysketch");
        //this.divPAUSING.style("display","none"); 
      },
    // 7
      () => {
        this.divPAUSING.style("display","none"); 
        //this.runningStopInit();
      },
    // 8
      () => {
        this.divINIT.style("display","none"); 
        this.diaConf = new DialogConf(this);
        this.diaConf.init();
      }, 
    // 9
      () => {
        this.divINIT.style("display","block");
        this.diaConf = undefined;
      }, 
    // 10
      ()=>{
        background(bgcolor[1]);
      } 
    ];
  }
  event(enr_,p_) {
    hlp.tstAut(this.aname+"|event S|E",
               this.aState[this.snr],
               this.aEvent[enr_]);
    let fnr = this.mNextFunction[this.snr][enr_];
    let ret = this.aFunction[fnr](p_);      
    let nsnr = this.mNextState[this.snr][enr_]; 
    if (Array.isArray(nsnr)) {
      let x = nsnr[ret];
      nsnr = x;
    } 
    this.snr = nsnr;
    hlp.tstAut(this.aname+"|event NextS",
               this.aState[this.snr]);
  }
  init() {
    this.event(0);
  }
  //
  //  Help functions
  //
  makeCanvas() {
    //hlp.tstConf("DialogMain frames",frames);
    hlp.tstConf("DialogMain");
    hlp.tstConf("  "+frames.tst());
    hlp.tstConf("  format",displayformat);
    hlp.tstConf("  width|height",canvaswidth,canvasheight);
    hlp.tstConf("  rectsize|cntrectx|cntrecty",
            rectsize,cntrectx.val,cntrecty);
    //hlp.tstConf("  sizeLine",sizeline);
    hlp.tstConf("  "+linesize.tst());
    frameRate(frames.val);
    canvas = createCanvas(canvaswidth,canvasheight);
  }
  makeButton(text_,x_,y_,color_,func_) {
    let button = createButton(text_);
    button.position(x_,y_);
    button.size(90,40);
    button.style("background",color_);
    if (!(func_==undefined)) {
      button.mousePressed(func_);
    }
    return(button);
  }
}
