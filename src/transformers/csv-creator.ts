import { Transform, TransformCallback } from "stream";

export class CSVCreator extends Transform {

  first = true;
  header:string[] = [];

  constructor(private delimiter:string) {
    super({
      writableObjectMode: true,
      readableObjectMode: false
    });
  }

  _transform(record: any, encoding: string, callback: TransformCallback) {

    if(this.first){
      this.header = Object.keys(record);
      this.push(this.header.join(this.delimiter) + "\r\n")
      this.first = false;
    }

    this.push(this.header.map(key => record[key] !== undefined ? record[key] : "").join(this.delimiter) + "\r\n");

    callback();
  }

}