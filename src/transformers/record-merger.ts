import { Transform } from "readable-stream";

// missing in @types/readable-stream
type TransformCallback = (error?: Error, data?: any) => void;

export class RecordMerger extends Transform {

  lines: string[] = [];

  constructor() {
    super({
      writableObjectMode: false,
      readableObjectMode: true
    });
  }

  _transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
    
    const line = chunk.toString();
    
    switch (line.substr(2, 1)) {
      case "@":
        if(this.lines.length) this.push(this.lines);
        this.lines = [line];
        break;

      default:
        this.lines.push(line);
    }

    callback();
  }

  _flush(callback: TransformCallback) {
    if(this.lines.length) this.push(this.lines);
    callback();
  }
}