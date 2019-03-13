import { Writable } from "stream";
import { Record } from "../schema";

export class DBWriter extends Writable {

  constructor(private db) {
    super({ objectMode: true })
  }

  _write(record: Record, encoding: string, callback: any) {
    switch (record.type) {
      case 2: this.writeBudgetRecord(record)
    }
    callback();
  }

  writeBudgetRecord(record: Record) {
    console.log("Writing budget record: ", record);
  }

}