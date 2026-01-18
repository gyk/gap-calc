export interface Preset {
  id: string;
  name: string;
  description?: string | null;
  inclinePercent: number;
  speedMph: number;
}
import { KM_PER_MILE } from "../constants";

export const DEFAULT_SPEED_KMH = 6;
export const DEFAULT_GRADE = 0.03;
export const DEFAULT_INCLINE_PERCENT = DEFAULT_GRADE * 100;
export const DEFAULT_SPEED_MPH = DEFAULT_SPEED_KMH / KM_PER_MILE;

export const PRESETS: Preset[] = [
  {
    id: "default",
    name: "Default",
    description: "⚠️ Reset all to default settings",
    inclinePercent: DEFAULT_INCLINE_PERCENT,
    speedMph: DEFAULT_SPEED_MPH,
  },
  {
    id: "7-5kph",
    name: "7%, 5 km/h",
    description: null,
    inclinePercent: 7,
    speedMph: 3.10686,
  },
  {
    id: "12-4kph",
    name: "12%, 4 km/h",
    description: null,
    inclinePercent: 12,
    speedMph: 2.48548,
  },
  {
    id: "20-3kph",
    name: "20%, 3 km/h",
    description: null,
    inclinePercent: 20,
    speedMph: 1.86411,
  },
  {
    id: "12-3-30",
    name: "12-3-30",
    description: "A popular treadmill workout",
    inclinePercent: 12,
    speedMph: 3,
  },
  {
    id: "bruce-1'",
    name: "Bruce Protocol (modified), Stage 1",
    description: null,
    inclinePercent: 0,
    speedMph: 1.7,
  },
  {
    id: "bruce-2'",
    name: "Bruce Protocol (modified), Stage 2",
    description: null,
    inclinePercent: 5,
    speedMph: 1.7,
  },
  {
    id: "bruce-1",
    name: "Bruce Protocol, Stage 1",
    description: null,
    inclinePercent: 10,
    speedMph: 1.7,
  },
  {
    id: "bruce-2",
    name: "Bruce Protocol, Stage 2",
    description: null,
    inclinePercent: 12,
    speedMph: 2.5,
  },
  {
    id: "bruce-3",
    name: "Bruce Protocol, Stage 3",
    description: null,
    inclinePercent: 14,
    speedMph: 3.4,
  },
  {
    id: "bruce-4",
    name: "Bruce Protocol, Stage 4",
    description: null,
    inclinePercent: 16,
    speedMph: 4.2,
  },
  {
    id: "bruce-5",
    name: "Bruce Protocol, Stage 5",
    description: null,
    inclinePercent: 18,
    speedMph: 5.0,
  },
  {
    id: "bruce-6",
    name: "Bruce Protocol, Stage 6",
    description: null,
    inclinePercent: 20,
    speedMph: 5.5,
  },
  {
    id: "bruce-7",
    name: "Bruce Protocol, Stage 7",
    description: null,
    inclinePercent: 22,
    speedMph: 6.0,
  },
];
