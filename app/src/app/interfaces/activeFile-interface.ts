export type Role = 'user' | 'assistant';

export interface FileInfo {
  id: string;
  name: string;
  size?: number;
  type?: string;
  file?: File;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  type?: 'text' | 'repository' | 'files_received';
  files?: FileInfo[];
}

export interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
}

