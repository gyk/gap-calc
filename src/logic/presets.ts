export interface Preset {
  id: string;
  name: string;
  description: string;
  inclinePercent: number;
  speedMph: number;
}

export const PRESETS: Preset[] = [
  {
    id: "12-3-30",
    name: "12-3-30",
    description: "12% incline, 3 mph",
    inclinePercent: 12,
    speedMph: 3,
  },
  {
    id: "bruce-1'",
    name: "Bruce Protocol (modified), Stage 1",
    description: "0% incline, 1.7 mph",
    inclinePercent: 0,
    speedMph: 1.7,
  },
  {
    id: "bruce-2'",
    name: "Bruce Protocol (modified), Stage 2",
    description: "5% incline, 1.7 mph",
    inclinePercent: 5,
    speedMph: 1.7,
  },
  {
    id: "bruce-1",
    name: "Bruce Protocol, Stage 1",
    description: "10% incline, 1.7 mph",
    inclinePercent: 10,
    speedMph: 1.7,
  },
  {
    id: "bruce-2",
    name: "Bruce Protocol, Stage 2",
    description: "12% incline, 2.5 mph",
    inclinePercent: 12,
    speedMph: 2.5,
  },
  {
    id: "bruce-3",
    name: "Bruce Protocol, Stage 3",
    description: "14% incline, 3.4 mph",
    inclinePercent: 14,
    speedMph: 3.4,
  },
  {
    id: "bruce-4",
    name: "Bruce Protocol, Stage 4",
    description: "16% incline, 4.2 mph",
    inclinePercent: 16,
    speedMph: 4.2,
  },
  {
    id: "bruce-5",
    name: "Bruce Protocol, Stage 5",
    description: "18% incline, 5.0 mph",
    inclinePercent: 18,
    speedMph: 5.0,
  },
  {
    id: "bruce-6",
    name: "Bruce Protocol, Stage 6",
    description: "20% incline, 5.5 mph",
    inclinePercent: 20,
    speedMph: 5.5,
  },
  {
    id: "bruce-7",
    name: "Bruce Protocol, Stage 7",
    description: "22% incline, 6.0 mph",
    inclinePercent: 22,
    speedMph: 6.0,
  },
];
