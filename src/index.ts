import { LineSplit, RecordMerger, RecordParser } from "./transformers";
import * as multipipe from "multipipe";

export function kxxreader() {

  multipipe(
    new LineSplit(), // split stream into lines
    new RecordMerger(), // merge lines that form a record
    new RecordParser(), // parse lines into JSON record with data
  )

}