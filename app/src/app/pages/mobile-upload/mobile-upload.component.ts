import { Component } from '@angular/core';
import { DocumentSyncService } from '../../services/document-sync.service';
import { FileInfo, FileMeta } from '../../interfaces/activeFile-interface';

type DocumentKind = 'image' | 'file';

interface SelectedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: Date;
  kind: DocumentKind;
  file: File;
}

@Component({
  selector: 'app-mobile-upload',
  templateUrl: './mobile-upload.component.html',
  styleUrls: ['./mobile-upload.component.scss']
})
export class MobileUploadComponent {
  documents: SelectedDocument[] = [];
  sendStatus = '';

  constructor(private readonly docSync: DocumentSyncService) {
    this.docSync.documents$.subscribe((docs) => {
      // Reflect shared docs into local list labels if sizes match
      if (!docs) return;
      if (docs.length === 0 && this.documents.length === 0) return;
      // No direct file objects in shared state; keep current list
    });
  }

  onCaptureChange(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    this.pushFiles(files, 'image');
    this.resetInput(event.target as HTMLInputElement);
  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    this.pushFiles(files, 'file');
    this.resetInput(event.target as HTMLInputElement);
  }

  remove(index: number): void {
    this.documents.splice(index, 1);
    this.documents = [...this.documents];
    this.syncDocs();
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  private pushFiles(fileList: FileList | null, kind: DocumentKind): void {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const next: SelectedDocument[] = Array.from(fileList).map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      name: file.name || `capture-${Date.now()}`,
      size: file.size,
      type: file.type,
      addedAt: new Date(),
      kind,
      file
    }));

    this.documents = [...next, ...this.documents];
    this.syncDocs();
  }

  private resetInput(input: HTMLInputElement): void {
    if (input) {
      input.value = '';
    }
  }

  sendToChat(): void {
    if (!this.documents.length) {
      this.sendStatus = 'Add documents first';
      return;
    }
    this.syncDocs();
    this.sendStatus = 'Sent to chatbot';
    setTimeout(() => (this.sendStatus = ''), 2000);
  }

  private syncDocs(): void {
    const mapped: FileMeta[] = this.documents.map((d) => ({
      id: d.id,
      name: d.name,
      size: d.size,
      type: d.type
    }));
    this.docSync.setDocuments(mapped);
  }
}
