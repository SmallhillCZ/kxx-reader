import Pumpify from "pumpify";
import { Duplex, Transform, TransformOptions, TransformCallback } from "stream";

import { KxxTransformer, LineSplit, RecordMerger, RecordParser, KxxRecord } from "kxx-reader-core";
import { stringify } from "querystring";

class KxxTransformStream<I, O> extends Transform {

  constructor(private transformer: KxxTransformer<I,O>, options: TransformOptions) {
    super({});
    this.transformer.start(
      (chunk: O) => this.push(chunk),
      (warning: string) => this.emit("warning", warning)
    );
  }

  _transform(chunk: I, encoding: string, callback: TransformCallback) {
    this.transformer.transform(chunk).then(() => callback(), err => callback(err));
  }

  _flush(callback: TransformCallback) {
    this.transformer.end().then(() => callback(), err => callback(err));
  }

}

export function kxxreader(): Duplex {

  return new Pumpify(
    // split stream into lines
    new KxxTransformStream<string,string>(new LineSplit(), { writableObjectMode: false, readableObjectMode: false }),
    // merge lines that form a record
    new KxxTransformStream<string,string[]>(new RecordMerger(), { writableObjectMode: false, readableObjectMode: true }),
    // parse lines into JSON record with data
    new KxxTransformStream<string[],KxxRecord>(new RecordParser(), { writableObjectMode: true, readableObjectMode: true })
  )

}