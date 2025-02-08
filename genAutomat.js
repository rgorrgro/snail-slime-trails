//
// Robert Gorr-Grohmann
// 2022-12-15
// A State Machine
//
"use strict";
let Automat = class {
  constructor(name_, ano_) {
    this.anam = name_;
    this.anum = ano_;
    //
    this.snams = [];
    this.enams = [];
    this.funcReach = [];
    this.nextStates = [];
    //
    this.confno = 0;
    this.cursno = 0;
  }
  //
  // Config
  //
  confEventBegin() {
    if (this.confno != 0) {
      print("Aut-" + this.anum + ": confEventBegin twice called.");
    }
    this.confno = 1;
    this.enumINIT = 0;
    this.enams.push("INIT");
  }
  confEventSet(event_) {
    if (this.confno != 1) {
      print("Aut-" + this.anum + ": confEventBegin missing.");
    }
    this.enams.push(event_);
    return this.enams.length - 1;
  }
  confEventEnd() {
    if (this.confno != 1) {
      print("Aut-" + this.anum + ": confEventBegin missing.");
    }
    //print("Aut-" + this.anum + ",confEventSet: enams=" + this.enams);
    this.confno = 2;
  }

  confStateBegin() {
    if (this.confno != 2) {
      print("Aut-" + this.anum + ": confEventEnd missing.");
    }
    this.snumCONF = 0;
    this.snams.push("CONF");
    this.snumINIT = 1;
    this.snams.push("INIT");
    this.confno = 3;
  }
  confStateSet(state_) {
    if (this.confno != 3) {
      print("Aut-" + this.anum + ": confStateBegin missing.");
    }
    this.snams.push(state_);
    return this.snams.length - 1;
  }
  confStateEnd() {
    if (this.confno != 3) {
      print("Aut-" + this.anum + ": confStateBegin missing.");
    }
    //print("Aut-" + this.anum + ",confStateSet: snams=" + this.snams + ".");
    this.confno = 4;
    //
    for (let i = 0; i < this.snams.length; i++) {
      this.funcReach.push(undefined);
    }
    //
    for (let i = 0; i < this.snams.length; i++) {
      this.nextStates[i] = [];
      for (let j = 0; j < this.enams.length; j++) {
        this.nextStates[i][j] = undefined;
      }
    }
  }
  //
  confSetReach(snum_, func_) {
    //print("Aut-" + this.anum +
    //      ",confSetReach: s=" + this.snams[snum_]
    //  );
    if (this.checkState(snum_)) {
      this.funcReach[snum_] = func_;
    }
  }
  //
  confSetTransition(snum_, enum_, nsnums_, func_) {
    if (!Array.isArray(nsnums_)) {
      nsnums_ = [nsnums_];
    }
    //print("Aut-" + this.anum +
    //",confSetTransition,1: s=" + this.snams[snum_] +
    //      ", e=" + this.enams[enum_] +
    //      ", #ns=" + nsnums_.length + 
    //      ", f=" + (func_==undefined?"undef":"def")
    //  );
    let b1 = this.checkState(snum_);
    let b2 = this.checkEvent(enum_);
    if (b1 && b2) {
      this.nextStates[snum_][enum_] = 
        new NextStates(snum_, enum_, nsnums_, func_);
      //let nsnos = this.nextStates[snum_][enum_].nsnos;
      //let s = "";
      //for (let i=0;i<nsnos.length;i++) {
      //  s += this.snams[nsnos[i]] + ",";
      //}
      //print("Aut-" + this.anum +
      //      ",confSetTransition,2: ns=" + s
      //     );
    }
  }
  //
  // to String
  //
  toString() {
    let ret = "Automat|Events:" + this.enams;
    ret += "\nAutomat|States:" + this.snams;
    for(let i=0;i<this.nextStates.length;i++) {
      ret += "\nAutomat|Transitions state=" +
        this.snams[i];
      if (this.funcReach[i]!=undefined) {
        ret += " reachfunc:def";        
      } else {
        ret += " reachfunc:undef";        
      }
      for(let j=0;j<this.nextStates[i].length;j++) {
        if(this.nextStates[i][j]==undefined) {
        } else {
          ret += "\n  event=" + this.enams[j];
          //print(ret);
          let func = this.nextStates[i][j].func;
          ret += " transfunc=" +
            (func==undefined?"undef":"def");
          let ns = this.nextStates[i][j].nsnos;
          ret += " next #" + ns.length;
          for (let k=0;k<ns.length;k++) {
            ret += " " + this.snams[ns[k]];           
          }
        }
      }      
    }  
    //this.nextStates[snum_][enum_] = 
    //    new NextStates(snum_, enum_, nsnums_, func_);
    return(ret);
  }
  //
  // Initialize
  //
  init() {
    //print("Aut-"+this.anum+
    //  ",init: Config completed.");
    this.cursno = this.snumCONF;
    this.event(this.enumINIT, {});
  }
  //
  // Running
  //
  state () {
    return (this.cursno);
  }
  event(enum_, dat_) {
    //print("Aut-" + this.anum + 
    //      ",event: s=" + this.snams[this.cursno] + 
    //      ", e=" + this.enams[enum_]
    //     );
    if (this.checkEvent(enum_)) {
      let next = this.nextStates[this.cursno][enum_];
      if (next != undefined) {
        if ( next.func != undefined ) {
          //print("Aut-" + this.anum + 
          //      ",event: call trans");
          let index = next.func(dat_);
          if (index != undefined) {
            this.cursno = next.nextState(index);
          } else {
            this.cursno = next.nextState(0);
          }
        } else {
          this.cursno = next.nextState(0);
        }
      }
      let func = this.funcReach[this.cursno];
      if (func != undefined) {
        //print("Aut-" + this.anum + 
        //      ",event: call reach, s=" +
        //      this.snams[this.cursno]
        //);
        func(dat_);
      }
    }
  }
  //
  // Checker
  //
  checkState(snum_) {
    if (snum_ < 0 || snum_ >= this.snams.length) {
      print("Aut-" + this.anum +
          ",setReach: sno out of range, snum=" +
          snum_ + ", min=0, max=" +
          this.snams.length - 1
      );
      return false;
    } else {
      return true;
    }
  }
  checkEvent(enum_) {
    if (enum_ < 0 || enum_ >= this.enams.length) {
      print("Aut-" + this.anum +
          ",setReach: eno out of range, enum=" +
          enum_ + ", min=0, max=" +
          this.enams.length - 1
      );
      return false;
    } else {
      return true;
    }
  }
};

class NextStates {
  constructor(snum_, enum_, nsnums_, func_) {
    this.snum = snum_;
    this.eno = enum_;
    this.func = func_;
    this.nsnos = [];
    this.nsnos = nsnums_.slice(0);
    this.nsnoslen = nsnums_.length;
  }

  nextState(ret_) {
    if (ret_ < 0 || ret_ >= this.nsnos.length) {
      return -1;
    } else {
      return this.nsnos[ret_];
    }
  }
}
