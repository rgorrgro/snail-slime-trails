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
    this.cfgArray.push(["radio1",displayformat,
      () => {return(displayformat.val[0]);},
      (p_) => {displayformat.set(p_);
              hlp.chkDisplayformatAndGeometry();}]);
    this.cfgArray.push(["slider1",rectcntx,
      () => {return(rectcntx.val);},
      (p_) => {rectcntx.set(p_);
              hlp.chkRectcntx(false);}]);
    this.cfgArray.push(["onlyview","rectcnty",
      () => {return(rectcnty);}]);   
    this.cfgArray.push(["onlyview","rectsize",
      () => {return(rectsize);}]);
    this.cfgArray.push(["slider1",linesize,
      () => {return(linesize.val);},
      (p_) => {linesize.set(p_);
               hlp.chkLinesize(false);}]);    
    this.cfgArray.push(["radio1",bgcolor,
      () => {return(bgcolor.val[0]);},
      (p_) => {bgcolor.set(p_);
              hlp.chkColors(false);}]);
    this.cfgArray.push(["radio1",snailtype,
      () => {return(snailtype.val[0]);},
      (p_) => {snailtype.set(p_);}]);
    this.cfgArray.push(["slider1",snailmaxcnt,
      () => {return(snailmaxcnt.val);},
      (p_) => {snailmaxcnt.set(p_);
              hlp.chkSnailparams();}]);
    this.cfgArray.push(["slider1",snailminlen,
      () => {return(snailminlen.val);},
      (p_) => {snailminlen.set(p_);
               hlp.chkSnailparams();}]);
    this.cfgArray.push(["slider1",frames,
      () => {return(frames.val);},
      (p_) => {frames.set(p_);
              hlp.chkFrames();}]);
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
        let arr = this.cfgArray[this.elenr];
        if(arr[0]=="radio") {
          x = arr[4][x];
        }
        if(arr[0]=="radio1") {
          x = arr[1].arr[x];
        }
        arr[3](x);
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
  //  Modify Menue
  //
  makeShowModify() {
    let nr = this.elenr;
    let type = this.cfgArray[nr][0];
    let name = this.cfgArray[nr][1];
    let obj = this.cfgArray[nr][1];
    let getval = this.cfgArray[nr][2];
    let min = this.cfgArray[nr][4];
    let arr = this.cfgArray[nr][4];
    let max = this.cfgArray[nr][5];
    if (type=="slider1") {
      name = obj.nam;
      min = obj.min;
      max = obj.max;
    }
    if (type=="radio1") {
      name = obj.nam;
      arr = obj.arr;
    }
    //
    let x = 50;
    let y = 50;
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
      case "slider1":
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
      case "radio1":
        y += 50;
        this.xType = createRadio(this.data);
        this.xType.position(x,y);
        this.xType.size(200);
        for(let i=0;i<obj.arr.length;i++) {
          this.xType.option(i,obj.arr[i]);
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
                  50,50,"white",undefined);
    this.divShowOverview.child(bConf);
    let bBack = this.makeButton("BACK",
                  150,50,"yellow",
                  ()=>{this.event(4,this.elenr);});
    this.divShowOverview.child(bBack);
    let x = 50;
    let y = 100;
    for(let i=0;i<this.cfgArray.length;i++) {
      let div = this.makeShowOverview2(i,x,y+i*50);
      this.divShowOverview.child(div);
    }
  }
  makeShowOverview2(nr_,x_,y_) {
    let type = this.cfgArray[nr_][0];
    let name = this.cfgArray[nr_][1];
    if (type=="slider1") {name=name.nam;}
    if (type=="radio1") {name=name.nam;}
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
      case "slider1":
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
      case "radio1":
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
