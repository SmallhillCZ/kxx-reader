import { Transform, TransformCallback } from "stream";

export class LineSplit extends Transform {
  
  data:string = "";

  constructor(){
    super({
      readableObjectMode:false,
      writableObjectMode:false
    })
  }

  _transform(chunk:string,encoding:string,callback:TransformCallback){
    this.data += chunk;
    const lines = this.data.split(/\r?\n/);
    this.data = lines[lines.length - 1];
    for(let line of lines.slice(0,lines.length - 1)) this.push(line);
    callback(null);
  }

  _flush(callback:TransformCallback){
    this.push(this.data);
    callback(null);
  }

}