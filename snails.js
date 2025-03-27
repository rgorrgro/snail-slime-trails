//
// Robert Gorr-Grohmann
// October 2024
//
class Snails {
  constructor(size,cntx,cnty,centralvector) {
    //print("Snails constructor start");
    //print("Snails: new geometry");
    this.geo = new Geometry(size,cntx,cnty,centralvector);
	//print(this.geo.toString());
    //
    //print("Snails: control point coordinates");
    //let add1 = size*40/100;    //30 - 40
    //let add2 = size*5/100;
    let add1 = size*30/100;
    let add2 = size*5/100;
    let ctrX = [add1,0,-add1,add1,-add1,add1,0,-add1];
    let ctrY = [add1,add1,add1,0,0,-add1,-add1,-add1];
    //let ctrX = [add1/2,0,    -add1,  add1,
    //            -add1*2,add1/2,0,-add1];
    //let ctrY = [add1,  add1/2,add1*2,0,
    //            0,-add1*2,-add1*2,-add1*2];
    this.geo.setControl(ctrX,ctrY);
    //print(this.geo.toString());
    //
    //print ( "Snails: create list of snail pathes" );
    this.list = 
      this.createSnailPathesList(this.geo,cntx,cnty)
	//print(this.toString());
    //print ( "Snails construction end");
  }
  createSnailPathesList(geo_,cntx_,cnty_) {
    let ret = [];
    let snailpathsmax = cntx_*cnty_*4;
    let foundsnailpath = false;
    for ( let i=0; i<snailpathsmax; i++) {
      let snail = new Snail(geo_,cntx_,cnty_);
      if (snail.empty) {
        if (!foundsnailpath) {
          hlp.err("SnailError: programm error nr 1.");
        }
        i = snailpathsmax;
      } else {
        foundsnailpath = true;
        ret.push(snail);
      }
    }
    return(ret);
  }
  addPointCoordinates() {
    for ( let i=0; i<this.list.length; i++) {
      this.list[i].addPointCoordinates();
    }
  }
  toString() {
    let s = "Snails ";
    for ( let i=0; i<this.list.length; i++) {
      s += "\n";
      s += this.list[i].toString(i);
    }
    return(s);
  }
  getSnailsAsBezier(snaillen_) {
    let ret = [];
    for (let i=0;i<this.list.length;i++) {
      if (this.list[i].pairs.length>snaillen_) {
        let bc = this.list[i].getSnailAsBezier();
        ret.push(bc);
      }
    }
    return(ret);
  }
}
class Snail {
  constructor(geo_,cntx_,cnty_) {
    this.empty = true;
    this.pairs = [];
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    p1 = geo_.getNextFreePoint();
    if (p1==undefined) { return; }
    let endfor = cntx_*cnty_*4;
    for (let i=0;i<endfor;i++){
      if (!p1.free) {
        if (this.pairs.length==0) {
          hlp.err("SnailError: programm error nr 2.");
          return;
        } else {
          let p = this.pairs[0].p1;
          if (!p1.equals(p)) { 
            hlp.err("SnailError: programm error nr 3.");
          } else {
            this.empty = false;
          }
          return;
        }
      } else {
        p1.free = false;
        p2 = geo_.getNextFreeRectPoint(p1);
        if (p2==undefined) {
          return;
        }
        p2.free = false;
        let pair = new PointPair (p1, p2);
        this.pairs.push(pair); 
        if (!p2.edge) {
          p1 = geo_.getNeighbour(p2);
        } else {
          p = this.pairs[0].p1;
          if (p.edge) {
            this.empty = false;
            return;
          } else {
            this.reordering();
            p2 = this.pairs[this.pairs.length-1].p2;
            p1 = geo_.getNeighbour(p2);          
          }
        }
      }
    }
  }
  reordering() {
    let arr2 = [];
    for (let i=this.pairs.length-1;i>=0;i--) {
      let pair = this.pairs[i];
      let h = pair.p1;
      pair.p1 = pair.p2;
      pair.p2 = h;
      arr2.push(pair);
    }
    this.pairs = arr2;
  }
  toString(i_) {
    let s = "Snail"+i_;
    s += ": pairslen=" + this.pairs.length;
    for (let i=0;i<this.pairs.length;i++) {
      s += ",P"+i+":" + this.pairs[i].toString();
    }
    return (s);
  }
  getSnailAsBezier() {
    let ret = [];
    for (let i=0;i<this.pairs.length;i++) {
      let bc = this.pairs[i].getBezierCoord();
      ret.push(bc);
    }
    return(ret);
  }
}
//
// Geometry
//   rectangles of equal size, each with 8 points
//   neighbour rectangles have 3 (sometimes 1) point
//   in common
//
class Geometry {
  constructor(size_,cntx_,cnty_,centralvector_) {
    this.size = size_;
    this.cntx = cntx_;
    this.cnty = cnty_;
    this.centralvector = centralvector_;
    // Create 3-dim array of points
    this.pts = []
    for (let x=0;x<cntx_;x++) {
      let h0 = [];
      for (let y=0;y<cnty_;y++) {
        let h1 = [];
        for (let z=0;z<8;z++) {
          let p = new Point(x,y,z,cntx_,cnty_,centralvector_);
          h1.push(p);
        }
        h0.push(h1);
      }
      this.pts.push(h0);
    }
    // Add coordinates
    let ancX = 
        [0,size_/2,size_,0,size_,0,size_/2,size_];
    let ancY = 
        [0,0,0,size_/2,size_/2,size_,size_,size_];
    for (let x=0;x<cntx_;x++) {
      for (let y=0;y<cnty_;y++) {
        for (let z=0;z<8;z++) {
          let p = this.pts[x][y][z];
          let v = createVector(
            x*size_+ancX[z],y*size_+ancY[z]);
          v.add(centralvector);
          p.setAnchor(v);
        }
      }
    }
  }
  setControl(ctrX_,ctrY_) {	  
    for (let x=0;x<this.cntx;x++) {
      for (let y=0;y<this.cnty;y++) {
        for (let z=0;z<8;z++) {
          let p = this.pts[x][y][z];
          let v = createVector(
            ctrX_[z],ctrY_[z]);
          //v.add(centralvector);
          p.setControl(v);
        }
      }
    }
  }
  setFree(p_,bool_) {
    this.geopts[p_.x][p_.y][p_.z].free = bool_;
  }
  getFree(p_) {
    return(this.geopts[p_.x][p_.y][p_.z].free);
  }
  getNextFreePoint() {
    for (let x=0;x<this.cntx;x++) {
      for (let y=0;y<this.cnty;y++) {
        for (let z=0;z<8;z++) {
          let p = this.pts[x][y][z];
          if (p.free) { return (p); }
        }
      }
    }
    return (undefined);
  }
  getNextFreeRectPoint(p_) {
    let x = p_.x;
    let y = p_.y;
    let j = int(random(8));
    for ( let i=0;i<8;i++) {
      let k = (i+j>=8?i+j-8:i+j);
      let p = this.pts[x][y][k];
      if (p.free) { return (p); }
    }
    return (undefined);
  }
  getNeighbour(p_) {
    let p = this.pts[p_.neighbourx]
           [p_.neighboury][p_.neighbourz];
    return(p);
  }
  toString() {
    let s = "Geometry:\n";
    for (let x=0;x<this.cntx;x++) {
      for (let y=0;y<this.cnty;y++) {
        for (let z=0;z<8;z++) {
          let p = this.pts[x][y][z];
          s += p.toString() + "\n";
        }
      }
    }
    s += "end";
    return(s);
  }
}
//
// Point pairs
//   are two points of a rectangle wich define
//   a part of a snails path
//
class PointPair {
  constructor(p1_,p2_) {
    this.p1 = p1_;
    this.p2 = p2_;
  }
  toString() {
    let s = "";
    s += "\n(A,("+this.p1.rectCoordToString()+"),";
    s += "("+this.p1.pixelAnchorCoordToString()+"),";
    s += "("+this.p1.pixelControlCoordToString()+")),";
    s += "(B,("+this.p2.rectCoordToString()+"),";
    s += "("+this.p2.pixelAnchorCoordToString()+"),";
    s += "("+this.p2.pixelControlCoordToString()+")),";
    return(s);
  }
  getBezierCoord() {
    let v0 = [this.p1.anchor.x,this.p1.anchor.y];
    let v1 = [this.p1.control.x,this.p1.control.y];
    let v2 = [this.p2.control.x,this.p2.control.y];
    let v3 = [this.p2.anchor.x,this.p2.anchor.y];
    let ret = [v0,v1,v2,v3];
    return(ret);
  }
}
//
// Point
//   every geometry point with its coordiates,
//     and the info if it is an edge 
//     and if it is free for planning
//     and the coordinates of its neighbour point
//
class Point {
  constructor(x_,y_,z_,cntx_,cnty_) {
    this.x = x_;
    this.y = y_;
    this.z = z_;
    this.free = true;
    //
    this.edge = false;
    if ((x_==0)&&(z_==0||(z_==3)||(z_==5))) {
      this.edge = true;
    }
    if ((y_==0)&&(z_==0||(z_==1)||(z_==2))) {
      this.edge = true;
    }
    if ((x_==cntx_-1)&&(z_==2||(z_==4)||(z_==7))) {
      this.edge = true;
    }
    if ((y_==cnty_-1)&&(z_==5||(z_==6)||(z_==7))) {
      this.edge = true;
    }
    //
    if (!this.edge) {
      let addx = [-1,0,1,-1,1,-1,0,1];
      let addy = [-1,-1,-1,0,0,1,1,1];
      let addz = [7,6,5,4,3,2,1,0];
      this.neighbourx = x_  + addx[z_];
      this.neighboury = y_ + addy[z_];
      this.neighbourz = addz[z_];
    }
  }
  setAnchor(v_) {this.anchor = v_;}
  setControl(v_) {
    this.control = this.anchor.copy();
    this.control.add(v_);
  }
  equals(p_) {
    return ((this.x==p_.x)&&
            (this.y==p_.y)&&
            (this.z==p_.z))
  }
  coordToString() {
    return(""+this.x+","+this.y+","+this.z);
  }
  rectCoordToString() {
    return(""+this.x+","+this.y+","+this.z);
  }
  pixelAnchorCoordToString() {
    return(""+this.anchor.x+","+this.anchor.y);
  }
  pixelControlCoordToString() {
    return(""+this.control.x+","+this.control.y);
  }
  coordToString() {
    return(""+this.x+","+this.y+","+this.z);
  }
  toString() {
    let s = "P("+this.x;
    s += ","+this.y;
    s += ","+this.z+")";
    s += ",Anc("+this.anchor.x+","+this.anchor.y;
    s += ")";      
    s += ",Free="+this.free;
    s += ",Edge="+this.edge;
    if (!this.edge) {
      s += ",NP("+this.neighbourx;
      s += ","+this.neighboury;      
      s += ","+this.neighbourz+")";      
    }
	if (!(this.control==undefined)) {
      s += ",Ctr("+this.control.x+","+this.control.y;  
      s += ")";      
	}
    return (s);
  }
}
