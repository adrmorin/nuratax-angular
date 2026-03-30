import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileInfo, FileMeta } from '../interfaces/activeFile-interface';

const STORAGE_KEY = 'document_sync_queue';

@Injectable({ providedIn: 'root' })
export class DocumentSyncService {
  private readonly subject: BehaviorSubject<FileMeta[]>;
  private storageListener?: (event: StorageEvent) => void;

  constructor() {
    this.subject = new BehaviorSubject<FileMeta[]>(this.loadFromStorage());
    this.bindStorageEvents();
  }

  get documents$() {
    return this.subject.asObservable();
  }

  setDocuments(docs: FileMeta[]) {
    this.subject.next(docs);
    this.saveToStorage(docs);
  }

  appendDocuments(docs: FileMeta[]) {
    if (!docs || docs.length === 0) return;
    const next = [...docs, ...this.subject.value];
    this.setDocuments(next);
  }

  clear() {
    this.setDocuments([]);
  }

  /** Re-reads from storage, useful for manual refreshes. */
  refreshFromStorage() {
    const docs = this.loadFromStorage();
    this.subject.next(docs);
  }

  private loadFromStorage(): FileMeta[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  private saveToStorage(docs: FileMeta[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs || []));
    } catch {
      /* ignore */
    }
  }

  private bindStorageEvents() {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    this.storageListener = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const docs = this.loadFromStorage();
      this.subject.next(docs);
    };
    window.addEventListener('storage', this.storageListener);
  }
}
