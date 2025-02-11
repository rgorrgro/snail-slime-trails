// Robert Gorr-Grohmann
// October 2024
//
class Snails {
  constructor(cntx_,cnty_) {
    //print ( "Snails const S");
    this.cntx = cntx_;
    this.cnty = cnty_;
    // Compute bezier offsets
    let siz1 = 
      (int(width/cntx_)<int(height/cnty_)?
      int(width/cntx_):int(height/cnty_));
    let siz2 = siz1/2;
    let add1 = siz1*40/100;
    let add2 = siz1*5/100;
    // Offset to anchor points
    this.ancX = [0,siz1/2,siz1,0,siz1,0,siz1/2,siz1];
    this.ancY = [0,0,0,siz1/2,siz1/2,siz1,siz1,siz1];
    // Offset to control points
    this.ctrX = [add1,0,-add1,add1,-add1,add1,0,-add1];
    this.ctrY = [add1,add1,add1,0,0,-add1,-add1,-add1];
    //
    this.siz1 = 
      (int(width/cntx_)<int(height/cnty_)?
      int(width/cntx_):int(height/cnty_));
    //print ( "Snails|const cnx|cnty|siz=" + 
    //  this.cntx + "|" + this.cnty + "|" + this.siz1);
    this.siz2 = this.siz1/2;
    this.add1 = this.siz1*40/100;
    this.add2 = this.siz1*5/100;
    //print ( "Snails: new paths" );
    this.paths = new Paths(cntx_,cnty_);
    //print ( "Snails: paths to snails array");
    this.arr = [];
    this.createSnailList(this.paths);
    //print ( "Snails construction end");
  }
  toStringSnail() {
    let s = "Snails ";
  }
  length() {
    return(this.arr.length);
  }
  getSnail(no_) {
    return(this.arr[no_]);
  }
  createSnailList(paths_) {
    for ( let i=0;i<this.paths.length();i++) {
      //print("Snails|createSnailList "+i);
      let path = this.paths.arr[i];
      let snail = new Snail(path,this.siz1,
                           this.ancX,this.ancY,
                           this.ctrX,this.ctrY);
      //print(snail.toString());
      this.arr.push(snail);
    }
  }
}
class Snail {
  constructor(path_,siz,ancX,ancY,ctrX,ctrY) {
    this.arr = [];
    for (let j=0;j<path_.arr.length;j++) {
      let p1 = path_.arr[j].p1;
      let p2 = path_.arr[j].p2;
      let coord = new Coordinates(
        createVector(
          p1.x*siz+ancX[p1.z],
          p1.y*siz+ancY[p1.z]),
        createVector(
          p1.x*siz+ancX[p1.z]+ctrX[p1.z],
          p1.y*siz+ancY[p1.z]+ctrY[p1.z]),
        createVector(
          p2.x*siz+ancX[p2.z]+ctrX[p2.z],
          p2.y*siz+ancY[p2.z]+ctrY[p2.z]),
        createVector(
          p2.x*siz+ancX[p2.z],
          p2.y*siz+ancY[p2.z]),
      );
      this.arr.push(coord);
    }
  }
  toString() {
    let s = "Snail length=" + this.arr.length;
    for (let j=0;j<this.arr.length;j++) {
      s += " "+j+":"+this.arr[j]+", ";
    }
    return(s);
  }
  partToString() {
    let s = "YSnailPart 0: ";
    s += this.arr[0];
    return(s);
  }
  XgetSnailPart(no_) {
    return(this.arr[no_]);
  }
}
//
// Subclass of Snails
//
class Coordinates {
  constructor(aa_,ac_,bc_,ba_) {
    this.aa = aa_;
    this.ac = ac_;
    this.bc = bc_;
    this.ba = ba_;
  }
  toString() {
    let s = "";
    s += " (" + this.aa.x + "," + this.aa.y + ")";
    s += ",(" + this.ac.x + "," + this.ac.y + ")";
    s += ",(" + this.bc.x + "," + this.bc.y + ")";
    s += ",(" + this.ba.x + "," + this.ba.y + ")";
    return(s);
  }
}
//
// All Paths according geometry
//
class Paths {
  constructor(cntx_,cnty_) {
    //print("Paths: begin");
    //print("Paths: new geometry");
    this.geo = new Geometry(cntx_,cnty_);
    //print("Paths: geometry\n"+this.geo.toString());
    this.arr = [];
    let pathsmax = cntx_*cnty_*4;
    let foundPath = false;
    for ( let i=0; i<pathsmax; i++) {
      //print("Paths: create path no=" + i);
      let path = new Path(this.geo,cntx_,cnty_);
      if (path.empty) {
        if (!foundPath) {
          //print("PF|Paths|Could not create path.");
        }
        i = pathsmax;
      } else {
        foundPath = true;
        this.arr.push(path);
      }
    }
    //print("Paths: end");    
  }
  length() { return(this.arr.length); }
  getPath(no_) { return(this.arr[no_]); }
  toString(b_){
    let s = "";
    for (let i=0;i<this.arr.length-1;i++) {
      s += "path no=" + i + ": " + 
        this.arr[i].toString(b_);
    }
    return(s);
  }
}
//
// One Paths according geometry
//
class Path {
  constructor(geo_,cntx_,cnty_) {
    //print ( "Path: begin");
    this.empty = true;
    this.arr = [];
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    p1 = geo_.getNextFreePoint();
    if (p1==undefined) { return; }
    //print ("Path|p1: " + p1.toString());
    let endfor = cntx_*cnty_*4;
    for (let i=0;i<endfor;i++){
      //print("if p1 not free");
      if (!p1.free) {
        //print("then p1 not free");
        //print("if no closed path");
        if (this.arr.length==0) {
          //print("PF|Path|p1 unfree and arr no path");
          return;
        } else {
          let p = this.arr[0].p1;
          if (!p1.equals(p)) { 
            //print("PF|Path|p1 unfree and not first path point");
            //print("p: " + p.toString(true));
            //print("p1: " + p1.toString(true));
            //print("p2: " + p2.toString(true));
            //print("geo:\n" + geo_.toString(true));
            //print("path:\n" + this.toString(true));
          } else {
            //print("else is closed path");
            //print("path ready");
            this.empty = false;
          }
          return;
        }
      } else {
        //print("else p1 free");
        p1.free = false;
        //print("search free point in rect of p1");
        p2 = geo_.getNextFreeRectPoint(p1);
        //print("if no p2 found");
        if (p2==undefined) {
          //print("then no p2 found");
          //print("PF|Path|no free rect point");
          return;
        }
        //print("else p2 found");
        //print ("Path|p2: " + p2.toString());
        p2.free = false;
        //print("push new pair to path");
        let pair = new PointPair (p1, p2);
        this.arr.push(pair); 
        //print("if p2 no edge");
        if (!p2.edge) {
          //print("then p2 no edge");
          //print("p1 <- neighbour of p2");
          p1 = geo_.getNeighbour(p2);
          //print ("Path|p1: " + p1.toString());
        } else {
          //print("if p2 edge");
          p = this.arr[0].p1;
          //print("if firstp of path is edge");
          if (p.edge) {
            //print("then firstp of path is edge");
            //print("path ready");
            this.empty = false;
            return;
          } else {
            //print("else firstp of path is no edge");
            //print("reoder path");
            //print("reorder 1: " + this.toString());
            this.reordering();
            //print("reorder 2: " + this.toString());
            //print("reorder 3: p2 <- lastp of path");
            p2 = this.arr[this.arr.length-1].p2;
            //print ("Path|p2: " + p2.toString());
            //print("reorder 4: p1 <- neighbour of p2");
            p1 = geo_.getNeighbour(p2);          
            //print ("Path|p1: " + p1.toString());
          }
        }
      }
    }
  }
  reordering() {
    let arr2 = [];
    for (let i=this.arr.length-1;i>=0;i--) {
      let pair = this.arr[i];
      let h = pair.p1;
      pair.p1 = pair.p2;
      pair.p2 = h;
      arr2.push(pair);
    }
    this.arr = arr2;
  }
  toString(b_) {
    let s = "len=" + this.arr.length;
    for (let i=0;i<this.arr.length;i++) {
      s += "\n" + this.arr[i].toString(b_);
    }
    return (s);
  }
}
//
// Geometry
//
class Geometry {
  constructor(cntx_,cnty_) {
    this.cntx = cntx_;
    this.cnty = cnty_;
    this.arr = []
    for (let ix=0;ix<this.cntx;ix++) {
      let y = [];
      for (let iy=0;iy<this.cnty;iy++) {
        let z = [];
        for (let iz=0;iz<8;iz++) {
          let p = new Point(ix,iy,iz,cntx_,cnty_);
          z.push(p);
        }
        y.push(z);
      }
      this.arr.push(y);
    }
  }
  setFree(p_,bool_) {
    this.arr[p_.x][p_.y][p_.z].free = bool_;
  }
  getFree(p_) {
    return(this.arr[p_.x][p_.y][p_.z].free);
  }
  getEdge(pt_) {
    return(this.arr[p_.x][p_.y][p_.z].edge);
  }
  getNextFreePoint() {
    for (let ix=0;ix<this.cntx;ix++) {
      for (let iy=0;iy<this.cnty;iy++) {
        for (let iz=0;iz<8;iz++) {
          let p = this.arr[ix][iy][iz];
          if (p.free) { return (p); }
        }
      }
    }
    return (undefined);
  }
  getNextFreeRectPoint(p_) {
    let ix = p_.x;
    let iy = p_.y;
    let j = int(random(8));
    for ( let i=0;i<8;i++) {
      let k = (i+j>=8?i+j-8:i+j);
      let p = this.arr[ix][iy][k];
      if (p.free) { return (p); }
    }
    return (undefined);
  }
  getNeighbour(p_) {
    //print(p_.toString())
    let p = this.arr[p_.neighbourx]
           [p_.neighboury][p_.neighbourz];
    //print(p.toString());
    return(p);
  }
  toString(b_) {
    let s = "Geometry:\n";
    for (let ix=0;ix<this.cntx;ix++) {
      for (let iy=0;iy<this.cnty;iy++) {
        for (let iz=0;iz<8;iz++) {
          let p = this.arr[ix][iy][iz];
          s += p.toString(b_) + "\n";
        }
      }
    }
    s += "end";
    return(s);
  }
}
//
// Points
//
class PointPair {
  constructor(p1_,p2_) {
    this.p1 = p1_;
    this.p2 = p2_;
  }
  toString(b_) {
    let s = "";
    s += "  " + this.p1.toString(b_) + ",";
    s += this.p2.toString(b_);
    return(s);
  }
}
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
  equals(p_) {
    /*let ret = true;
    if (!this.x==p_.x) {ret = false; }
    if (!this.y==p_.y) {ret = false; }
    if (!this.z==p_.z) {ret = false; }*/
    return ((this.x==p_.x)&&
            (this.y==p_.y)&&
            (this.z==p_.z))
  }
  toString(b_) {
    let s = "P(" + this.x;
    s += "," + this.y;
    s += "," + this.z;
    if (b_) {
      s += "),f" + this.free;
      s += ",e" + this.edge;
      if (!this.edge) {
        s += ",Nx" + this.neighbourx;
        s += ",Ny" + this.neighboury;      
        s += ",Nz" + this.neighbourz;      
      }
    } else { s += ")"; }
    return (s);
  }
}
