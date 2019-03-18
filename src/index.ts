import { LineSplit, RecordMerger, RecordParser } from "./transformers";
import Pumpify from "pumpify";
import { Duplex } from "stream";

export function kxxreader(): Duplex {

  return new Pumpify(
    new LineSplit(), // split stream into lines
    new RecordMerger(), // merge lines that form a record
    new RecordParser() // parse lines into JSON record with data
  )

}

console.log(kxxreader());