import * as fs from "fs-extra";
import * as path from "path";
import * as iconv from "iconv-lite";

import { LineSplit, RecordMerger, RecordParser, Aggregator, RecordTap, CSVCreator } from "./transformers";

// script arguments and settings 
const args = require('minimist')(process.argv.slice(2));

if(!args.source) throw new Error("Missing parameter: source");  

const sourceFile = path.isAbsolute(args.source) ? args.source : path.resolve("./", args.source);
const limit = Number(args.limit) || Infinity;


// main function (must be function to be async)
async function main() {
  
  // get file size for progress
  const stats = await fs.stat(sourceFile);
  const fileSize = Math.min(limit, stats.size);

  // get the source file as stream
  console.log("Reading source file %s", sourceFile);
  const sourceStream = fs.createReadStream(sourceFile, { end: limit });

  // report progress
  var fileRead = 0;
  sourceStream.on("data", chunk => {
    fileRead += chunk.length;
    process.stdout.write("Processing: " + Math.floor((fileRead / fileSize) * 100) + "%\r");
  })
  sourceStream.on("end", () => {
    process.stdout.write("Processing: 100%\r\n");
  });

  // run the data throu all pipes
  sourceStream
    //.pipe(progress) // show progress, passthrough
    .pipe(iconv.decodeStream("win1250")) // decode non utf charset
    .pipe(new LineSplit()) // split stream into lines
    .pipe(new RecordMerger()) // merge lines that form a record
    .pipe(new RecordParser()) // parse lines into JSON record with data
    .pipe(new RecordTap(args.type, args.item, args.paragraph)) // list records matching type, item and paragraph CL params
    .pipe(new Aggregator()) // group by type, item, paragraph, event
    .pipe(new CSVCreator(";")) // put aggregated data to CSV (to analyze in Excel)
    .pipe(fs.createWriteStream(path.join(__dirname, "../data/output.csv"))); // save CSV to file (to analyze in Excel)    
}

// RUN, FOREST, RUN!
main();