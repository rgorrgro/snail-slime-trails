//
// Robert Gorr-Grohmann
// 2024-12-15
//
"use strict";
class Dialog {
  constructor(initDrawInit_,runningDrawRunning_,
               runningStopInit_) {
    this.className = "Dialog";
    //
    this.initDrawInit = initDrawInit_;
    this.runningDrawRunning = runningDrawRunning_;
    this.runningStopInit = runningStopInit_;
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
	this.auto.confEventEnd ();
    //
	this.auto.confStateBegin ();
    this.snumCONF = this.auto.snumCONF;
    this.snumINIT = this.auto.snumINIT;
    this.snumCONFING = this.auto.confStateSet
      ('CONFING');
    this.snumPAUSING = this.auto.confStateSet
      ('PAUSING');
    this.snumRUNNING = this.auto.confStateSet
      ('RUNNING');
	this.auto.confStateEnd ();
	//
    this.auto.confSetTransition ( 
      this.snumCONF,this.enumDRAW,this.snumCONF, 
      undefined); 
    this.auto.confSetTransition ( 
      this.snumCONF,this.enumINIT,this.snumINIT, 
      (p1,p2) => {
        this.initDialogINIT();
        this.initDialogPAUSING();
        this.initDialogRUNNING();
        this.displayDialogINIT();
      } ); 
	//
    this.auto.confSetTransition ( 
      this.snumINIT,this.enumDRAW,this.snumINIT,
      (p1,p2) => {
        this.initDrawInit();
      }); 
    this.auto.confSetTransition ( 
      this.snumINIT,this.enumRUN,this.snumRUNNING,
      (p1,p2) => {
        this.displayDialogRUNNING();
      }); 
    /*this.auto.confSetTransition ( 
      this.snumINIT,this.enumCONFIG,this.snumCONFING,
      (p1,p2) => {
        print("INIT,CONF,CONFING");
      }); 
    this.auto.confSetTransition ( 
      this.snumCONFING,this.enumCONFIG,this.snumINIT,
      (p1,p2) => {
        print("CONFING,CONF,INIT");
      }); 
    this.auto.confSetTransition ( 
      this.snumCONFING,this.enumRUN,this.snumCONFING,
      (p1,p2) => {
        print("CONFING,RUN,CONFING");
      });*/ 
	//
    this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumRUN,this.snumPAUSING,
      undefined); 
	this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumRUN,this.snumRUNNING,
      (p1,p2) => {
        this.displayDialogRUNNING();
      }); 
	this.auto.confSetTransition ( 
      this.snumPAUSING,this.enumSAVE,this.snumRUNNING,
      (p1,p2) => {
        this.displayDialogRUNNING();
        //fileInOut.writeCanvas(canvas);
      }); 
	//
    this.auto.confSetTransition ( 
      this.snumRUNNING,this.enumDRAW,this.snumRUNNING,
      (p1,p2) => {
        this.runningDrawRunning();
      //  filterAda.draw();
      });
    this.auto.confSetTransition ( 
      this.snumRUNNING,this.enumPAUSE,this.snumPAUSING,
      (p1,p2) => {
        this.displayDialogPAUSING();
      }); 
	this.auto.confSetTransition ( 
      this.snumRUNNING,this.enumSTOP,this.snumINIT,
      (p1,p2) => {
        this.displayDialogINIT();
        this.runningStopInit();
        //filtersAda = new FiltersAda();
      });
    //
    this.auto.init ( );
    print(this.auto.toString());
  }
  //
  // Dialog functions
  //
  initDialogINIT() {
    //print("Dialog|initDialogINIT");
    let buttonRUN1 = createButton ('RUN');
    buttonRUN1.position ( 0, height);
    buttonRUN1.mousePressed 
      (this.mousePressedRUN);
    //let buttonCONFIG1 = createButton ('CONFIG');
    //buttonCONFIG1.position ( 100, height);
    //buttonCONFIG1.mousePressed 
    //  (this.mousePressedCONFIG);
    this.divINIT = createDiv();
    this.divINIT.child(buttonRUN1);
    //this.divINIT.child(buttonCONFIG1);
  }
  initDialogPAUSING() {
    //print("Dialog|initDialogPAUSING");
    let buttonRUN2 = createButton ('RUN');
    buttonRUN2.position ( 0, height);
    buttonRUN2.mousePressed 
      (this.mousePressedRUN);
    let buttonSAVE2 = createButton ('SAVE');
    buttonSAVE2.position ( 100, height);
    buttonSAVE2.mousePressed 
      (this.mousePressedSAVE);
    this.divPAUSING = createDiv();
    this.divPAUSING.child(buttonRUN2);
    this.divPAUSING.child(buttonSAVE2);
  }
  initDialogRUNNING() {
    //print("Dialog|initDialogRUNNING");
    let buttonPAUSE3 = createButton ('PAUSE');
    buttonPAUSE3.position ( 0, height);
    buttonPAUSE3.mousePressed 
      (this.mousePressedPAUSE);
    let buttonSTOP3 = createButton ('STOP');
    buttonSTOP3.position ( 100, height);
    buttonSTOP3.mousePressed 
      (this.mousePressedSTOP);
    this.divRUNNING = createDiv();
    this.divRUNNING.child(buttonSTOP3);
    this.divRUNNING.child(buttonPAUSE3);
  }
  displayDialogINIT() {
    print("Dialog|displayDialogINIT");
    this.divPAUSING.style("display","none"); 
    this.divRUNNING.style("display","none")
    this.divINIT.style("display","block")
  }
  displayDialogPAUSING() {
    //print("Dialog|displayDialogPAUSING");
    this.divINIT.style("display","none")
    this.divRUNNING.style("display","none")
    this.divPAUSING.style("display","block"); 
  }
  displayDialogRUNNING() {
    //print("Dialog|displayDialogRUNNING");
    this.divINIT.style("display","none")
    this.divPAUSING.style("display","none"); 
    this.divRUNNING.style("display","block")
  }
  //
  // Mouse events
  //
  mousePressedCONFIG () {
    dialog.auto.event(dialog.enumCONFIG, {});
  }
  mousePressedRUN () {
    dialog.auto.event(dialog.enumRUN, {});
  }
  mousePressedPAUSE () {
    dialog.auto.event(dialog.enumPAUSE, {});
  }
  mousePressedSTOP () {
    dialog.auto.event(dialog.enumSTOP, {});
  }
  mousePressedSAVE () {
    dialog.auto.event(dialog.enumSAVE, {});
  }
}
////////////////////////
/*
let sketch2 = function (p2) {
  p2.showResize = false;
  p2.resizeWidthTxt = null;
  p2.resizeWidthOld = null;
  p2.resizeWidthSli = null;
  p2.resizeWidthNew = null;
  p2.resizeHeight = null;
  p2.resizeHeightSlider = null;
  
  p2.setup = function () {
    p2.canvas = p2.createCanvas(300, 300);
    p2.background(200);
    p2.resize = p2.createButton('Resize');
    p2.resize.position(0, 0);
    p2.resize.mouseClicked(p2.funcResize);
  }

  p2.draw = function () {
    //p2.fill(255, 50, 0, 25);
    p2.ellipse(100, 100, 50, 50);
    if (p2.showResize) {
      let y = 24;
      //console.log('New:' + p2.resizeWidthSli.value());
      //menu.text(p2.resizeWidthSli.value(), 400, 24);
    }
  }
  
  p2.funcResize = function() {
    if (!p2.showResize) {
      p2.showResize = true;
      let y = 24;
      p2.resizeWidthTxt = p2.createButton('Width');
      p2.resizeWidthTxt.position(10, y);
      p2.resizeWidthOld = p2.createButton('Old:' + main.width);
      p2.resizeWidthOld.position(80, y);
      p2.resizeWidthSli = p2.createSlider(100, main.windowWidth, main.width);
      p2.resizeWidthSli.position(160, y);
      p2.resizeWidthNew = p2.createButton('New:' + p2.resizeWidthSli.value());
      p2.resizeWidthNew.position(300, y);
      p2.resizeHeight = p2.createButton('Height (' + main.height + ')');
      p2.resizeHeight.position(10, 48);
      //p2.resizeHeight.mouseClicked(p2.funcNull);
      p2.resizeHeightSlider = p2.createSlider(100, main.windowHeight, main.height);
      p2.resizeHeightSlider.position(100, 48);
    } else {
      p2.resizeWidth.remove();
      p2.resizeHeight.remove();
      p2.showResize = false;      
    }
    //main.canvas.resize(main.windowWidth, main.windowHeight); 
    //main.background(200);
  }

  p2.funcNull = function() {
  }
}
*/
