export enum ConfidenceLevel {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export const confidenceThresholds = {
  high: 0.9,
  medium: 0.6,
  low: 0.0,
} as const;

export interface ExtractionRecord {
  id: string;
  sourceFileName: string;
  sourceType: 'xlsx' | 'docx' | 'csv' | string;
  fields: {
    projectName?: string;
    description?: string;
    budget?: {
      amount?: number;
      currency?: string;
      raw?: string;
    };
    region?: string;
    status?: string;
    timeframe?: {
      start?: string;
      end?: string;
      duration?: string;
    };
    keyTasks?: string[];
  };
  confidences?: Record<string, number>; // per-field confidence 0..1
  parsedPreview?: any; // raw parser output for fallback
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface ExtractionEnvelope {
  jobId?: string;
  records: ExtractionRecord[];
  source?: string;
  createdAt?: string;
  meta?: Record<string, any>;
}

export type ExtractionResult = ExtractionEnvelope;

// exported names required by PLAN: ExtractionRecord, ExtractionEnvelope, confidenceThresholds
