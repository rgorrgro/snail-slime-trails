//
// Robert Gorr-Grohmann
// 2024-12-15
//
//  Sub dialog of the main dialog for the
//  configuration of global variables
//
"use strict";
class DialogConf {
  constructor(caller_) {
    this.cfgArray = [];
    this.cfgArray.push(["radio","format",
      () => {return(displayformat);},
      (p_) => {displayformat=p_;
              hlp.chkConfFormat();
              hlp.chkConfRectangle();},
      hlp.displayformatArray]);
    this.cfgArray.push(["slider","cntrectx",
      () => {return(cntrectx.val);},
      (p_) => {cntrectx.set(p_);
              hlp.chkConfRectangle();},
      cntrectx.min,cntrectx.max]);   
    this.cfgArray.push(["onlyview","cntrecty",
      () => {return(cntrecty);}]);   
    this.cfgArray.push(["onlyview","sizerect",
      () => {return(rectsize);}]);
    this.cfgArray.push(["slider","linesize",
      () => {return(linesize.val);},
      (p_) => {linesize.set(p_);;},
      linesize.min,linesize.max]);    
    this.cfgArray.push(["radio","bgcolor",
      () => {return(bgcolor);},
      (p_) => {bgcolor=p_;
              hlp.chkConfColor();},
      hlp.colorArray]);
    this.cfgArray.push(["radio","snailtype",
      () => {return(snailtype);},
      (p_) => {snailtype=p_[0];},
      snailtypeArray]);
    this.cfgArray.push(["slider","snailcnt",
      () => {return(snailcnt.val);},
      (p_) => {snailcnt.set(p_);},
      snailcnt.min,snailcnt.max]);
    this.cfgArray.push(["slider","snaillen",
      () => {return(snaillen.val);},
      (p_) => {snaillen.set(p_);},
      snaillen.min,snaillen.max]);
/*    this.cfgArray.push(["slider","frames",
      () => {return(frames);},
      (p_) => {frames=p_;
              hlp.chkConfFrames();},
      framesmin,framesmax]);*/
      this.cfgArray.push(["slider","frames",
      () => {return(frames.val);},
      (p_) => {frames.set(p_);},
      frames.min,frames.max]);
    //
    this.aname = "DiaConf";
    this.caller = caller_;
    this.elenr = 0;
    this.snr = 0;
    this.aState = 
      ["START","INIT","CONFIG","HALT"];
    let sST = 0;
    let sIN = 1;
    let sCO = 2;
    let sHA = 3;
    this.aEvent = 
      ["INIT","MODIFY","SET","RESET","BACK"];
    let eIN = 0;
    let eMO = 1;
    let eSE = 2;
    let eRE = 3;
    let eBA = 4;
	this.mNextState = [
    // INI MOD SET RES BACK
      [sIN,  1, -1, -1, -1], // START
      [ -1,sCO, -1, -1,sHA], // INIT
      [ -1, -1,sIN,sIN, -1], // CONFIG
      [ -1, -1, -1, -1, -1], // HALT
    ];
	this.mNextFunction = [
    // INI MOD SET RES BACK
      [  1, -1, -1, -1, -1], // START
      [ -1,  3, -1, -1,  2], // INIT
      [ -1, -1,  4,  5, -1], // CONFIG
      [ -1, -1, -1, -1, -1], // HALT
    ];
    this.aFunction = [
    // 0
      () => {},
    // 1
      () => {
        this.divShowOverview = createDiv();
        this.makeShowOverview();
        this.divShowOverview.style("display","block");
      },
    // 2
      () => {
        this.divShowOverview.style("display","none");
        this.divShowOverview = undefined;
        this.caller.event(3);
      }, 
    // 3
      (p0_) => {
        this.elenr = p0_;
        this.divShowOverview.style("display","none");
        this.divShowOverview = undefined;
        this.divShowModify = createDiv();
        this.makeShowModify();
        this.divShowModify.style("display","block");
      }, 
    // 4
      () => {
        this.divShowModify.style("display","none");
        this.divShowModify = undefined;
        let x = this.xType.value();
        if(this.cfgArray[this.elenr][0]=="radio") {
          x = this.cfgArray[this.elenr][4][x];
        }
        this.cfgArray[this.elenr][3](x);
        //this.checkConfig();
        this.divShowOverview = createDiv();
        this.makeShowOverview();
        this.divShowOverview.style("display","block");
      },
    // 5
      () => {
        this.divShowModify.style("display","none");
        this.divShowModify = undefined;
        this.divShowOverview = createDiv();
        this.makeShowOverview();
        this.divShowOverview.style("display","block");
      },
    ];
  }
  event(enr_,no_) {
    hlp.tstAut(this.aname+"|event S|E",
               this.aState[this.snr],
               this.aEvent[enr_]);
    let fnr = this.mNextFunction[this.snr][enr_];
    let ret = this.aFunction[fnr](no_);      
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
  // Check Configuration
  //
  XcheckConfig() {
    hlp.chkConfig();
    hlp.tstConfOn();
    hlp.tstConfig();
    hlp.tstConfOff();
  }
  //
  //  Modify Menue
  //
  makeShowModify() {
    let nr = this.elenr;
    let type = this.cfgArray[nr][0];
    let name = this.cfgArray[nr][1];
    let getval = this.cfgArray[nr][2];
    let min = this.cfgArray[nr][4];
    let max = this.cfgArray[nr][5];
    //
    let x = 50;
    let y = 150;
    //
    let bName = this.makeButton(type+": "+name,
                  x,y,"white",undefined);
    this.divShowModify.child(bName);
    y += 50;
    let bValue = this.makeButton(" "+getval(),
                  x,y,"white",undefined);
    this.divShowModify.child(bValue);
    y += 50;
    let bSet = this.makeButton("SET",
                  x,y,"yellow",
                  () => {this.event(2);});
    this.divShowModify.child(bSet);
    let bReset = this.makeButton("BACK",
                  x+100,y,"yellow",
                  () => {this.event(3);});
    this.divShowModify.child(bReset);
//
    let bMin;
    let bMax;
    this.data = getval();
    switch (type) {
      case "slider":
        y += 50;
        bMin = this.makeButton(
                  "min: "+min,
                  x,y,"white",undefined);
        this.divShowModify.child(bMin);
        y += 50;
        bMax = this.makeButton(
                  "max: "+max,
                  x,y,"white",undefined);
        this.divShowModify.child(bMax);
        y += 50;
        this.xType = createSlider(
          min,max,this.data);
        this.xType.position(x,y);
        this.divShowModify.child(this.xType);
      break;        
      case "radio":
        y += 50;
        this.xType = createRadio(this.data);
        this.xType.position(x,y);
        this.xType.size(200);
        for(let i=0;i<this.cfgArray[nr][4].length;i++) {
          this.xType.option(i,this.cfgArray[nr][4][i]);
        }
        this.xType.style("background","yellow");
        this.divShowModify.child(this.xType);
      break;
      default:
        print("default");
      break;
    }
  }
  //
  // Overview Nenue
  //
  makeShowOverview() {
    let bConf = this.makeButton("CONFIG",
                  50,100,"white",undefined);
    this.divShowOverview.child(bConf);
    let bBack = this.makeButton("BACK",
                  150,100,"yellow",
                  ()=>{this.event(4,this.elenr);});
    this.divShowOverview.child(bBack);
    let x = 50;
    let y = 150;
    for(let i=0;i<this.cfgArray.length;i++) {
      let div = this.makeShowOverview2(i,x,y+i*50);
      this.divShowOverview.child(div);
    }
  }
  makeShowOverview2(nr_,x_,y_) {
    let type = this.cfgArray[nr_][0];
    let name = this.cfgArray[nr_][1];
    let getval = this.cfgArray[nr_][2];
    let dOverX = createDiv();
    let bName, bValu, bModi;
    switch(type) {
      case "onlyview":
        bName = this.makeButton(name,
                  x_+100,y_,"white",undefined);
        bValu = this.makeButton(""+getval(),
                  x_+200,y_,"white",undefined);
        dOverX.child(bName);
        dOverX.child(bValu);
      break;
      case "slider":
        bModi = 
          this.makeButton("MODIFY",
            x_,y_,"yellow",()=>{this.event(1,nr_);});
        bName = this.makeButton(name,
                  x_+100,y_,"white",undefined);
        bValu = this.makeButton(""+getval(),
                  x_+200,y_,"white",undefined);
        dOverX.child(bModi);
        dOverX.child(bName);
        dOverX.child(bValu);
      break;
      case "radio":
        bModi = 
          this.makeButton("MODIFY",
            x_,y_,"yellow",()=>{this.event(1,nr_);});
        bName = this.makeButton(name,
                  x_+100,y_,"white",undefined);
        bValu = this.makeButton(""+getval(),
                  x_+200,y_,"white",undefined);
        dOverX.child(bModi);
        dOverX.child(bName);
        dOverX.child(bValu);
      break;
    }
    return(dOverX);
  }
  //
  //  Help functions
  //
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
