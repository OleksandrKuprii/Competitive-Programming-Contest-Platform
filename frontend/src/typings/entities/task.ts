export interface Task {
  id: string;
  name?: string;
  categoryId?: string;
  categoryName?: string;
  difficulty?: number;
  points?: number;
  status?: string[];
  submissionId?: number;
  rating?: TaskRating;
  description?: {
    main?: string;
    inputFormat?: string;
    outputFormat?: string;
  };
  examples?: TaskExample[];
  limits?: TaskLimits;
  customSections?: TaskCustomSection[];
  publishedAt?: Date;
}

export interface TaskCustomSection {
  name: string;
  data: string;
}

export interface TaskRating {
  correct: number;
  partial: number;
  zero: number;
}

export interface TaskExample {
  input: string;
  output: string;
}

export interface TaskLimits {
  cpuTime: number;
  wallTime: number;
  memory: number;
}

export interface TaskDescriptionSection {
  id: number;
  header?: string;
  text?: string;
}
