import type { Coach } from './Coach';

export interface Team {
  id: string;
  name: string;
  coach: Coach; // Nest the coach model
}
