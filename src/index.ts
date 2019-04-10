import Pumpify from "pumpify";
import { Duplex, Transform, TransformOptions, TransformCallback } from "stream";

import { KxxTransformer, LineSplit, RecordMerger, RecordParser, KxxRecord } from "kxx-reader-core";
import duplexify from "duplexify";
import { stringify } from "querystring";

class KxxTransformStream<I, O> extends Transform {

  constructor(private transformer: KxxTransformer<I, O>, private options: TransformOptions) {
    super(options);    
    this.transformer.start(
      (chunk: O) => this.push(chunk),
      (warning: string) => this.emit("warning", warning)
    );
  }

  _transform(chunk: I, encoding: string, callback: TransformCallback) {
    this.transformer.transform(chunk).then(() => callback(), err => callback(err));
  }

  _flush(callback: TransformCallback) {
    this.transformer.flush().then(() => callback(), err => callback(err));
  }

}
export function kxxreader(): Duplex {

  // split stream into lines
  const lineSplit: Transform = new KxxTransformStream<string, string>(new LineSplit(), { writableObjectMode: false, readableObjectMode: false });

  // merge lines that form a record
  const recordMerger: Transform = new KxxTransformStream<string, string[]>(new RecordMerger(), { writableObjectMode: false, readableObjectMode: true });

  // parse lines into JSON record with data
  const recordParser: Transform = new KxxTransformStream<string[], KxxRecord>(new RecordParser(), { writableObjectMode: true, readableObjectMode: true });


  const resultStream = lineSplit.pipe(recordMerger).pipe(recordParser);

  return duplexify(lineSplit, resultStream, {
    writableObjectMode: false,
    readableObjectMode: true
  })

}