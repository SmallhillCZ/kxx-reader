import { Transform, TransformCallback } from "stream";
import { Record } from "../schema";

class AggregatedRecord {
  credit: number = 0;
  debit: number = 0;

  constructor(public type: number, public paragraph: string, public item: string, public event: string) { }
}

export class Aggregator extends Transform {

  records: AggregatedRecord[] = [];
  recordIndex: { [key: string]: AggregatedRecord } = {};

  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: true
    });
  }

  _transform(record: Record, encoding: string, callback: TransformCallback) {

    if (Number(record.item) < 1000 || Number(record.item) >= 7000){
      callback();
      return;
    }

    const key = [record.type, record.paragraph, record.item, record.event].join("-");

    if (!this.recordIndex[key]) {
      this.recordIndex[key] = new AggregatedRecord(record.type, record.paragraph, record.item, record.event);
      this.records.push(this.recordIndex[key]);
    }

    const aggregatedRecord = this.recordIndex[key];

    aggregatedRecord.credit += record.credit;
    aggregatedRecord.debit += record.debit;

    callback();
  }

  _flush(callback: TransformCallback) {
    this.records.forEach(record => this.push(record));
    callback();
  }

}