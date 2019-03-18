import { LineSplit, RecordMerger, RecordParser } from "./transformers";
import * as multipipe from "multipipe";
import { Duplex } from "readable-stream";

export function kxxreader(): Duplex {

  return multipipe(
    new LineSplit(), // split stream into lines
    new RecordMerger(), // merge lines that form a record
    new RecordParser(), // parse lines into JSON record with data
  )

}