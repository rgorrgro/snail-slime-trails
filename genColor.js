// Robert Gorr-Grohmann
// 2021-11-01
class ChangingColors {
  constructor(name_,from_,to_,start_,change_) {
    this.name = name_;
    this.from = from_.slice(0);
    this.to = to_.slice(0);
    this.current = start_.slice(0);
    this.change = change_.slice(0);
  }
  getCurrentColor() {
    return (this.current);
  }
  getStepColor() {
    for(let i=0;i<4;i++) {
      this.current[i] = this.computeStep(i);
    }
    return (this.current);
  }
  computeStep(no_) {
    let ret = this.change[no_];
    /*if (no_==0) {print("In:"+this.change[no_]+
                       ","+this.from[no_]+
                       ","+this.to[no_]+
                       ","+this.current[no_]);}*/
    if(ret!=0) {
      ret += this.current[no_];
    }
    if(ret<this.from[no_]) {
      ret = this.from[no_];
      this.change[no_] = -1 * this.change[no_];
    } else {
      if(ret>this.to[no_]) {
        ret = this.to[no_];
        this.change[no_] = -1 * this.change[no_];
      }
    }
    /*if (no_==0) {print("Out:"+this.change[no_]+
                       ","+this.from[no_]+
                       ","+this.to[no_]+
                       ","+this.current[no_]+
                       ","+ret);}*/
    return(ret);
  }
  getRandomStepColor() {
    for(let i=0;i<4;i++) {
      this.current[i] = this.computeRandomStep(i);
    }
    return (this.current);
  }
  computeRandomStep(no_) {
    let ret = this.change[no_];
    /*if (no_==0) {print("In:"+this.change[no_]+
                       ","+this.from[no_]+
                       ","+this.to[no_]+
                       ","+this.current[no_]);}*/
    if(ret!=0) {
      let x = (random(2)<1?-1:1);
      let y = int(random(ret));
      ret = x*y+this.current[no_];
    }
    //ret = this.checkAndCorrect(ret,this.from[no_],
    //                          this.to[no_]);
    ret = (ret<this.from[no_]?
           this.from[no_]:
           (ret>this.to[no_]?
            this.to[no_]:
            ret));
    /*if (no_==0) {print("Out:"+this.change[no_]+
                       ","+this.from[no_]+
                       ","+this.to[no_]+
                       ","+this.current[no_]+
                       ","+ret);}*/
    return(ret);
  }
  checkAndCorrect(val_,min_,max_) {
    return(val_<min_?min_:(val_>max_?max_:val_));
  }
}

function ColorConcept(name_) {
  this.name = name_;
  this.type = 0;
  // type==0: fix = p1
  // type==1: random between p1 and p2
  // type==2: color moves (adding p4) between p1 
  //          and p2 starting with p3
  // type==3: random out of range length p3 moving 
  //          between p1 and p2 changes every p4. time 
  this.p1 = [0, 0, 0];
  this.p2 = [0, 0, 0];
  this.p3 = [0, 0, 0];
  this.p4 = [0, 0, 0];
  this.p5 = [0, 0, 0];
  this.p6 = [0, 0, 0];
  this.p7 = [0, 0, 0];
  this.color = [0, 0, 0];
  
  this.logColorRange = function(p1_, p2_) {
    let s = this.name + ' Range: R' + p1_[0] + ',' + p2_[0] + ' ';
    s = s + 'G' + p1_[1] + ',' + p2_[1] + ' ';
    s = s + 'B' + p1_[2] + ',' + p2_[2];
    console.log(s);
  }

  this.logColorType = function() {
    console.log(this.name + 
                ' Type, P1, P2, ...:' + this.type);
    for (let i=0; i<3; i++) {
      console.log('   ' + this.p1[i] + ',' + 
                  this.p2[i] + ',' + this.p3[i] + ',' +
                  this.p4[i]);
    }
  }

  this.logColor = function(color_) {
    console.log(this.name + ' Range: ' + color_);
  }

  this.setColorType = function(type_, p1_, p2_, p3_, p4_) {
    this.type = type_;
    switch (type_) {
      case 0:
        for (let i=0; i<3; i++) {
          this.p1[i] = p1_[i];
        }
      break;
      case 1:
        for (let i=0; i<3; i++) {
          this.p1[i] = p1_[i];
          this.p2[i] = p2_[i];
        }
      break;
      case 2:
        for (let i=0; i<3; i++) {
          this.p1[i] = p1_[i];
          this.p2[i] = p2_[i];
          this.p3[i] = p3_[i];
          this.p4[i] = p4_[i];
        }
      break;
      case 3:
        for (let i=0; i<3; i++) {
          this.p1[i] = p1_[i];
          this.p2[i] = p2_[i];
          this.p3[i] = p3_[i];
          this.p4[i] = p4_[i];
          this.p5[i] = p1_[i];
          this.p6[i] = p1_[i] + 2*p3_[i];
          this.p7[i] = 0;
        }
      break;
    }
    //this.logColorType();
  }

  this.getColor = function() {
    if (this.type==1) {
      return(this.getColorRandom());
    } else if (this.type==2) {
      return(this.getColorChangesBetweenMinAndMax());
    } else if (this.type==3) {
      return(this.getColorChangesBetweenMovingMinAndMax());
    } else {
      return(this.getColorStart());
    }
  }

  this.getColorStart = function() {
    //this.logColorRange();
    /*let c = 'rgb(' + this.p1[0] + ',' + this.p1[1] + 
        ',' + this.p1[2] + ')';*/
    //this.logColor(c);
    //return(c);
    return([this.p1[0], this.p1[1], this.p1[2]]);
  }

  this.getColorRandom = function() {
    /*let c = 'rgb(' + int(random(this.p1[0], this.p2[0])) +
            ',' + int(random(this.p1[1], this.p2[1])) + ',' +
            int(random(this.p1[2], this.p2[2])) + ')';*/
    //this.logColor(c);
    //return(c);
    return([int(random(this.p1[0], this.p2[0])), 
            int(random(this.p1[1], this.p2[1])),
            int(random(this.p1[2], this.p2[2]))]);
  }

  this.getColorChangesBetweenMinAndMax = function() {
    this.p3[0] += this.p4[0];
    if ((this.p3[0] > this.p2[0])||
        (this.p3[0] < this.p1[0])) {
      this.p4[0] *= -1;
      this.p3[0] += this.p4[0];
    }
    this.p3[1] += this.p4[1];
    if ((this.p3[1] > this.p2[1])||
        (this.p3[1] < this.p1[1])) {
      this.p4[1] *= -1;
      this.p3[1] += this.p4[1];
    }
    this.p3[2] += this.p4[2];
    if ((this.p3[2] > this.p2[2])||
        (this.p3[2] < this.p1[2])) {
      this.p4[2] *= -1;
      this.p3[2] += this.p4[2];
    }
    /*let c = 'rgb(' + this.p3[0] + ',' + this.p3[1] +
           ',' + this.p3[2] + ')';*/
    //this.logColor(c);
    //return(c);
    return([this.p3[0], this.p3[1], this.p3[2]]);
  }
  
  this.getColorChangesBetweenMovingMinAndMax = function() {
    for (let i=0; i<3; i++) {
      if (this.p7[i]++>=this.p4[i]) {
        this.p7[i] = 0;
        this.p5[i]+=this.p3[i];
        if (this.p5[i] > this.p2[i]) {
          this.p5[i]=this.p1[i];
          this.p6[i]=this.p1[i] + 2*this.p3[i];
        } else {
          this.p6[i]=this.p5[i] + 2*this.p3[i];
        }
        if (this.p6[i] > this.p2[i]) {
          this.p6[i]=this.p2[i];
        }       
      }
    }
    /*let c = 'rgb(' + int(random(this.p5[0], this.p6[0])) +
            ',' + int(random(this.p5[1], this.p6[1])) + ',' +
            int(random(this.p5[2], this.p6[2])) + ')';*/
    //this.logColorRange(this.p5, this.p6);
    //this.logColor(c);
    //return(c);
    return([int(random(this.p5[0], this.p6[0])), 
            int(random(this.p5[1], this.p6[1])),
            int(random(this.p5[2], this.p6[2]))]);
  }
}
