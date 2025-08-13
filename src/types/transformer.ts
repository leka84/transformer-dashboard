export interface VoltageReading {
  timestamp: string;
  voltage: string;
}

export interface Transformer {
  assetId: number;
  name: string;
  region: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  lastTenVoltgageReadings: VoltageReading[];
}

export interface TransformerData {
  transformers: Transformer[];
}

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
}
