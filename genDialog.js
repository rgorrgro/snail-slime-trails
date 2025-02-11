//
// Robert Gorr-Grohmann
// 2024-12-15
//
"use strict";
class Dialog {
  constructor(initRunRunning_,runningDrawRunning_,
               runningStopInit_,confingSetInit_) {
    this.className = "Dialog";
    //
    //this.initDrawInit = initDrawInit_;
    this.initRunRunning = initRunRunning_;
    this.runningDrawRunning = runningDrawRunning_;
    this.runningStopInit = runningStopInit_;
    this.confingSetInit = confingSetInit_;
    //
    this.conf = [];
    //
	this.auto = new Automat ( 'Dialog', 1 );
    //
	this.auto.confEventBegin();
	this.enumINIT = this.auto.enumINIT;
    this.enumRUN = this.auto.confEventSet('RUN');
	this.enumPAUSE = this.auto.confEventSet('PAUSE');
	this.enumSTOP = this.auto.confEventSet('STOP');
	this.enumSAVE = this.auto.confEventSet('SAVE');
	this.enumDRAW = this.auto.confEventSet('DRAW');
	this.enumCONFIG = this.auto.confEventSet('CONFIG');
	this.enumCLICK = this.auto.confEventSet('CLICK');
	this.enumSET = this.auto.confEventSet('SET');
	this.enumRESET = this.auto.confEventSet('RESET');
	this.auto.confEventEnd ();
    //
	this.auto.confStateBegin ();
    this.snumCONF = this.auto.snumCONF;
    this.snumINIT = this.auto.snumINIT;
    this.snumINITDIA = this.auto.confStateSet
      ('INITDIA');
    this.snumRUNNING = this.auto.confStateSet
      ('RUNNING');
    this.snumPAUSING = this.auto.confStateSet
      ('PAUSING');
    this.snumCONFING = this.auto.confStateSet
      ('CONFING');
	this.auto.confStateEnd();
	// CONF
    this.auto.confSetTransition ( 
      this.snumCONF,this.enumDRAW,this.snumCONF, 
      undefined); 
    this.auto.confSetTransition ( 
      this.snumCONF,this.enumCLICK,this.snumCONF, 
      undefined);
    this.auto.confSetTransition ( 
      this.snumCONF,this.enumINIT,this.snumINIT, 
      (p1,p2) => {
        canvas.mouseClicked(this.mpCLICK);
        //print("Dialog create divINIT");
        let buttonRUN1 = createButton ('RUN');
        buttonRUN1.position ( 0, 0);
        buttonRUN1.style("background","yellow");
        buttonRUN1.mousePressed(this.mpRUN);
        let buttonCONFIG1 = createButton ('CONFIG');
        buttonCONFIG1.position ( 100, 0);
        buttonCONFIG1.style("background","yellow");
        buttonCONFIG1.mousePressed(this.mpCONFIG);
        this.divINIT = createDiv();
        this.divINIT.child(buttonRUN1);
        this.divINIT.child(buttonCONFIG1);
        this.divINIT.style("display","none");
        this.divINIT.style("background","yellow");
        //print("Dialog create divPAUSING");
        let buttonRUN2 = createButton ('RUN');
        buttonRUN2.position ( 0, 0);
        buttonRUN2.style("background","yellow");
        buttonRUN2.mousePressed(this.mpRUN);
        let buttonSAVE = createButton ('SAVE');
        buttonSAVE.position ( 200, 0);
        buttonSAVE.style("background","yellow");
        buttonSAVE.mousePressed(this.mpSAVE);
        let buttonSTOP = createButton ('STOP');
        buttonSTOP.position ( 100, 0);
        buttonSTOP.style("background","yellow");
        buttonSTOP.mousePressed(this.mpSTOP);
        this.divPAUSING = createDiv();
        this.divPAUSING.child(buttonRUN2);
        this.divPAUSING.child(buttonSTOP);
        this.divPAUSING.child(buttonSAVE);
        this.divPAUSING.style("display","none"); 
        //print("Dialog create divCONFING");
        let buttonSET = createButton ('SET');
        buttonSET.position(0,0);
        buttonSET.style("background","yellow");
        buttonSET.mousePressed(this.mpSET);
        let buttonRESET = createButton ('RESET');
        buttonRESET.position(66,0);
        buttonRESET.style("background","yellow");
        buttonRESET.mousePressed(this.mpRESET);
        this.divCONFING = createDiv();
        this.divCONFING.child(buttonSET);
        this.divCONFING.child(buttonRESET);
        this.divCONFING.style("display","none"); 
      }); 
    // INIT
    this.auto.confSetTransition ( 
      this.snumINIT,this.enumDRAW,this.snumINIT,
      undefined);
//        (p1,p2)=>{this.initDrawInit();}); 
    this.auto.confSetTransition ( 
      this.snumINIT,this.enumCLICK,this.snumINITDIA,
        (p1,p2)=>{
          this.divINIT.style("display","block")
        }); 
    // INITDIA
    this.auto.confSetTransition ( 
      this.snumINITDIA,this.enumDRAW,this.snumINITDIA,
      undefined);
    this.auto.confSetTransition ( 
      this.snumINITDIA,this.enumCLICK,this.snumINITDIA,
        undefined); 
    this.auto.confSetTransition ( 
      this.snumINITDIA,this.enumRUN,this.snumRUNNING,
        (p1,p2)=>{
          this.divINIT.style("display","none");
          this.initRunRunning();
        }); 
    this.auto.confSetTransition ( 
    this.snumINITDIA,this.enumCONFIG,this.snumCONFING,
        (p1,p2) => {
          //print("XXX INITDIA => CONFIG => CONFING")
          this.divINIT.style("display","none")
          this.divCONFING.style("display","block"); 
        }); 
	// RUNNING
    this.auto.confSetTransition ( 
      this.snumRUNNING,this.enumDRAW,this.snumRUNNING,
      (p1,p2) => {
        //print("XXX RUNNING => DRAW => RUNNING")
        this.runningDrawRunning();});
    this.auto.confSetTransition ( 
      this.snumRUNNING,this.enumCLICK,this.snumPAUSING,
      (p1,p2) => {
        //print("XXX RUNNING => CLICK => PAUSING")
        this.divPAUSING.style("display","block"); 
        //this.displayDialogPAUSING();
      }); 
	// PAUSING
    this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumDRAW,this.snumPAUSING,
      undefined); 
	this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumRUN,this.snumRUNNING,
      (p1,p2) => {
        //print("XXX PAUSING => RUN => RUNNING")
        this.divPAUSING.style("display","none"); 
      }); 
	this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumSAVE,this.snumRUNNING,
      (p1,p2) => {
        //print("XXX PAUSING => SAVE => RUNNING")
        work.save("mysketch");
        this.divPAUSING.style("display","none"); 
      }); 
	this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumSTOP,this.snumINIT,
      (p1,p2) => {
        //print("XXX PAUSING => STOP => INIT")
        this.divPAUSING.style("display","none"); 
        this.runningStopInit();
      }); 
    // CONFING
    this.auto.confSetTransition ( 
      this.snumCONFING,this.enumSET,this.snumINIT,
      (p1,p2) => {
        this.confingSetInit();
        this.divCONFING.style("display","none"); 
      }); 
    this.auto.confSetTransition ( 
      this.snumCONFING,this.enumRESET,this.snumINIT,
      (p1,p2) => {
        this.divCONFING.style("display","none"); 
      }); 
    this.auto.confSetTransition ( 
      this.snumCONFING,this.enumDRAW,this.snumCONFING, 
      undefined);
    //
    this.auto.init ( );
  }
  //
  // Mouse events
  //
  mpCONFIG () {
    dialog.auto.event(dialog.enumCONFIG, {});
  }
  mpRUN () {
    dialog.auto.event(dialog.enumRUN, {});
  }
  mpPAUSE () {
    dialog.auto.event(dialog.enumPAUSE, {});
  }
  mpSTOP () {
    dialog.auto.event(dialog.enumSTOP, {});
  }
  mpSAVE () {
    dialog.auto.event(dialog.enumSAVE, {});
  }
  mpCLICK () {
    dialog.auto.event(dialog.enumCLICK, {});
  }
  mpSET () {
    dialog.auto.event(dialog.enumSET, {});
  }
  mpRESET () {
    dialog.auto.event(dialog.enumRESET, {});
  }
  //
  // External functions
  //
  createSlider(name_,height_,orig_,min_,max_) {
    let h = new DialogConfigSlider(
      name_,height_,orig_,min_,max_);
    this.conf.push(h);
    this.divCONFING.child(h.getDiv());
  }
  createRadio(name_,height_,orig_,arr_) {
    let h = new DialogConfigRadio(
      name_,height_,orig_,arr_);
    this.conf.push(h);
    this.divCONFING.child(h.getDiv());
  }
  updateConfigData() {
    for(let i=0;i<this.conf.length;i++) {
      this.conf[i].updateConfigData();
    }
  }
  getValue(nr_) {
    let h = this.conf[nr_];
    return(h.getData());
  }
}
//
// Radio button class
//
class DialogConfigRadio {
  constructor(name_,height_,orig_,arr_) {
    let bName = createButton(name_);
    bName.position(0,height_);
    bName.style("background","yellow");
    this.orig = orig_;
    this.data = orig_;
    this.radio = createRadio(name_);
    this.radio.position(200,height_);
    this.radio.size(200);
    for(let i=0;i<arr_.length;i++) {
      this.radio.option(i,arr_[i]);
    }
    this.radio.style("background","yellow");
    this.radio.selected(0);
    this.div = createDiv();
    this.div.child(bName);
    this.div.child(this.radio);
  }
  getDiv() {return(this.div);}
  getOrig() {
    this.data = this.orig;
    print("getOrig="+this.data);
    return(this.data);
  }
  getData() {
    this.data = this.radio.value();
    //print("getData="+this.data);
    return(this.data);
  }
}
//
// Slider class
//
class DialogConfigSlider {
  constructor(name_,height_,orig_,min_,max_) {
    let s = name_+"(min="+min_+",max="+max_+")";
    let bName = createButton(s);
    bName.position(0,height_);
    bName.style("background","yellow");
    this.orig = orig_;
    this.data = orig_;
    this.slider = createSlider(
      min_,max_,this.data);
    this.slider.position(200,height_);
    this.slider.style("background","yellow");
    this.div = createDiv();
    this.div.child(bName);
    this.div.child(this.slider);
  }
  getDiv() {return(this.div);}
  getOrig() {
    this.data = this.orig;
    print("getOrig="+this.data);
    return(this.data);
  }
  getData() {
    this.data = this.slider.value();
    print("getData="+this.data);
    return(this.data);
  }
}
