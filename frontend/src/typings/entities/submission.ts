export interface SubmissionTest {
  id: number;
  status: string;
  points: number;
  cpuTime: number;
  realTime: number;
}

export interface Submission {
  id: number;
  code?: string;
  language?: string;
  points?: number;
  status?: string[];
  submitted?: Date;
  taskId?: string;
  taskName?: string;
  tests?: SubmissionTest[];
  testCount?: number;
}
