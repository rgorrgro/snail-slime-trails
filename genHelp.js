// Robert Gorr-Grohmann
// 2025-01-01
// Colection of helpful functions
//   Calculating Draw Sizes
//   Test handling
//   Error handling
class Help {
  constructor() {
    this.btst = false;
    this.btstAut = false;
    //
    this.dspFormatArray = 
      [["A4-Portrait",22,15],
      ["A4-Landscape",15,22],
      ["Widescreen-P",19,12],
      ["Widescreen-L",12,19],
      ["Smartphone-P",16,9],
      ["Smartphone-L",9,16]];
  }
//
//  Calculating Draw Sizes
//
  dspGetFormatNameArray() {
    let ret = [];
    for (let i=0;i<this.dspFormatArray.length;i++) {
      ret.push(this.dspFormatArray[i][0]);
    }
    return (ret);
  }
  dspSetSizes1(w_,h_,f_) {
    let w = w_-4;    
    this.dspPossibleWidth = w;    
    let h = h_-4;
    this.dspPossibleHeight = h;
    //
    let ano = 0;
    for (let i=0;
         i<this.dspFormatArray.length;
         i++) {
      if (f_==this.dspFormatArray[i][0]) { ano = i;
      }
    }
    this.dspFormatNr = ano;
    //
    let x = w 
      / this.dspFormatArray[ano][2];
    if (x*this.dspFormatArray[ano][1]>h) {
      this.dspHeight = h;
      x = h / this.dspFormatArray[ano][1];
      this.dspWidth 
        = int(x*this.dspFormatArray[ano][2]);
    } else {
      this.dspWidth = w;
      this.dspHeight 
        = int(x*this.dspFormatArray[ano][1]);
    }
    //
    this.tst("Possible W|H",
      this.dspPossibleWidth,this.dspPossibleHeight);
    this.tst("Display W|H",
      this.dspWidth,this.dspHeight);
    this.tst("Format",
      this.dspFormatArray[this.dspFormatNr]);
  }
  dspGetWidth() { return(this.dspWidth); }
  dspGetHeight() { return(this.dspHeight); }
  dspSetSizes2(l_,r_) {
    let h = (this.dspWidth<this.dspHeight
              ?this.dspWidth:this.dspHeight);
    this.dspSizeRect = (r_<40?40:
                     (r_>h/4?int(h/4):r_));
    h = (l_<1?1:
         (l_>this.dspSizeRect/6
          ?this.dspSizeRect/6:l_));
    this.dspSizeLine = int(h);
    this.dspRectX 
      = int(this.dspWidth/this.dspSizeRect);
    this.dspRectY 
      = int(this.dspHeight/this.dspSizeRect);
    //
    this.tst("Snail Linesize",this.dspSizeLine);
    this.tst("Rect Size",this.dspSizeRect);
    this.tst("Rect Cnt X|Y",
      this.dspRectX,this.dspRectY);
  }
  dspGetSizeLine() { return(this.dspSizeLine); }
  dspGetRectangleSize() { return(this.dspSizeRect); }
  dspGetRectangleX() { return(this.dspRectX); }
  dspGetRectangleY() { return(this.dspRectY); }
//
//  Test handling
//
  tst() {
    if (this.btst) {
      let s = "Tst "+arguments[0]+"=>";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstOn() {this.btst = true;}
  tstOff() {this.btst = false;}
  tstAut() {
    if (this.btstAut) {
      let s = "AutTest "+arguments[0]+": ";
      for (let i=1;i<arguments.length;i++) {
        s += arguments[i]+"|";
      }
      print (s);
    }
  }
  tstAutOn() {this.btstAut = true;}
  tstAutOff() {this.btstAut = false;}
//
//  Error handling
//
  err() {
    let s = "Error "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
  errAut() {
    let s = "AutError "+arguments[0]+": ";
    for (let i=1;i<arguments.length;i++) {
      s += arguments[i]+"|";
    }
    print (s);
  }
}
