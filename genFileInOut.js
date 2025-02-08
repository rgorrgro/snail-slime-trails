class FileInOut {
  constructor(name_,ext_) {
    this.name = name_;
    this.ext = ext_;
    this.date = "YYYY-MM-DD";
    this.time = "hh-mm-ss";
  }
  writeText(text_) {
    this.currentDate();
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(
      new Blob([text_], {type: "text/plain"}));
    a.download = this.name+" "+this.date+"-"+
      this.time+"."+this.ext;
    a.click();
  }
  writeCanvas(canvas_) {
    this.currentDate();
    let filename = this.name+" "+this.date+"-"+
      this.time+"."+this.ext;
    print("FILE SAVE" + filename);
    save(filename);
  }
  currentDate() {
    let d = new Date();
    let mon = this.zero(d.getMonth() + 1);
    let day = this.zero(d.getDate());
    let yea = d.getFullYear();
    this.date = yea+"-"+mon+"-"+day;
    let hou = this.zero(d.getHours());
    let min = this.zero(d.getMinutes());
    let sec = this.zero(d.getSeconds());
    this.time = hou+"-"+min+"-"+sec;
    return (this.date+"-"+this.time);
  }
  zero(i_) {
    return ((i_<10?"0"+i_:i_));
  }
}