import type { LanguageId } from '../data/challenges';

export interface TerminalNode {
  id: string;
  position: [number, number, number];
  language: LanguageId;
  label: string;
}

export interface BugNode {
  id: string;
  position: [number, number, number];
  language: LanguageId;
}

export const TERMINALS: TerminalNode[] = [
  { id: 't-py',  position: [-6, 0, -2],  language: 'python',     label: 'Python' },
  { id: 't-js',  position: [ 6, 0, -2],  language: 'javascript', label: 'JavaScript' },
  { id: 't-java',position: [-6, 0,  6],  language: 'java',       label: 'Java' },
  { id: 't-sql', position: [ 6, 0,  6],  language: 'sql',        label: 'SQL' },
  { id: 't-cpp', position: [-9, 0,  2],  language: 'cpp',        label: 'C++' },
  { id: 't-html',position: [ 9, 0,  2],  language: 'html',       label: 'HTML' },
  { id: 't-css', position: [-9, 0,  10], language: 'css',        label: 'CSS' },
  { id: 't-log', position: [ 9, 0,  10], language: 'logic',      label: 'Lógica' },
];

export const BUGS: BugNode[] = [
  { id: 'b-py',  position: [ -2, 0,  2],  language: 'python' },
  { id: 'b-js',  position: [  2, 0,  2],  language: 'javascript' },
  { id: 'b-java',position: [ -2, 0,  8],  language: 'java' },
  { id: 'b-sql', position: [  2, 0,  8],  language: 'sql' },
];

export const WORLD_SIZE = 24;
export const PLAYER_SPEED = 6;
