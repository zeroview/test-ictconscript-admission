export type LogEntryData = {
  id: string;
  title: string;
  body: string;
  isoTime: string;
  lat: number | null;
  lon: number | null;
};

import SampleData from "../../sample-data/data.json";

export const logEntries: LogEntryData[] = SampleData;
