import { Transform, TransformCallback } from "stream";
import { Record } from "../schema";

export class RecordTap extends Transform {

  constructor(private type:number,private item:string,private paragraph:string) {
    super({
      writableObjectMode: true,
      readableObjectMode: true
    });
    console.log(this.type,this.item,this.paragraph)
  }

  _transform(record: any, encoding: string, callback: TransformCallback) {

    if(
      (this.paragraph !== undefined || this.item !== undefined) &&
      (this.type === undefined || record.type === Number(this.type)) &&
      (this.paragraph === undefined || record.paragraph === String(this.paragraph)) &&
      (this.item === undefined || record.item === String(this.item))
    ){
      record.data.forEach(line => console.log(line));
    }
    
    callback(null,record);
  }

}