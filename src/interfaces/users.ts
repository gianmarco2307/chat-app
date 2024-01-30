export interface Users {
    [key: string]: {
      counter: number;
      lastAccess: string;
      previousAccess: string | null;
    };
  }