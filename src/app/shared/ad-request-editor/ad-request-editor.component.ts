import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KevelService } from '../../services/kevel.service';
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/theme-cloud_editor'; // matches your reference look
import 'ace-builds/src-min-noconflict/theme-tomorrow'; // matches your reference look

import 'ace-builds/src-min-noconflict/ext-language_tools';

@Component({
  selector: 'app-ad-request-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ad-request-editor.component.html',
  styleUrl: './ad-request-editor.component.scss',
})
export class AdRequestEditorComponent implements OnChanges, AfterViewInit {
  @Input() adType!: string;
  @Input() onSave!: (result: any) => void;

  rawJson = '';
  formattedResponse = '';

  requestJson: any = null;
  responseJson: any = null;

  @ViewChild('editorRequest') requestEditorEl!: ElementRef<HTMLDivElement>;
  @ViewChild('editorResponse') responseEditorEl!: ElementRef<HTMLDivElement>;

  private requestEditor: any;
  private responseEditor: any;

  constructor(private kevel: KevelService) {}

  ngOnChanges() {
    this.requestJson = this.kevel.getLastRequest(this.adType);
    this.responseJson = this.kevel.getLastResponse(this.adType);

    this.rawJson = JSON.stringify(this.requestJson || {}, null, 2);
    this.formattedResponse = JSON.stringify(this.responseJson || {}, null, 2);

    if (this.requestEditor) this.requestEditor.setValue(this.rawJson, -1);
    if (this.responseEditor) this.responseEditor.setValue(this.formattedResponse, -1);
  }

  ngAfterViewInit() {
    const ace = (window as any).ace;

    this.requestEditor = ace.edit(this.requestEditorEl.nativeElement);
    this.requestEditor.session.setMode('ace/mode/json');
    this.requestEditor.setTheme('ace/theme/tomorrow');
    this.requestEditor.setOptions({ fontSize: '14px', showLineNumbers: false });
    this.requestEditor.setHighlightActiveLine(false);
    this.requestEditor.setValue(this.rawJson || '', -1);
    this.requestEditor.session.on('change', () => {
      this.rawJson = this.requestEditor.getValue();
    });

    this.responseEditor = ace.edit(this.responseEditorEl.nativeElement);
    this.responseEditor.session.setMode('ace/mode/json');
    this.responseEditor.setTheme('ace/theme/tomorrow');
    this.responseEditor.setOptions({ fontSize: '14px', readOnly: true, showLineNumbers: false });
    this.responseEditor.setHighlightActiveLine(false);
    this.responseEditor.setValue(this.formattedResponse || '', -1);
  }

  updateRequest() {
    const parsed = JSON.parse(this.rawJson);
    this.kevel.getAd(this.adType, parsed).subscribe((res) => {
      this.responseJson = res;
      this.kevel.saveLastResponse(this.adType, res);
      this.formattedResponse = JSON.stringify(res, null, 2);
      this.responseEditor.setValue(this.formattedResponse, -1);
    });
  }

  save() {
    if (!this.responseJson) return;
    // const decisionKey = Object.keys(this.responseJson.decisions)[0];
    // const ads = this.responseJson.decisions?.[decisionKey] || [];
    this.onSave(this.responseJson); // <-- pass all
  }

  copyToClipboard(content: string) {
    navigator.clipboard.writeText(content).then(() => {
      const toast = document.createElement('div');
      toast.textContent = 'Copied!';
      toast.className = 'fixed bottom-6 right-6 bg-black text-white px-3 py-2 rounded shadow text-sm z-50';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  }
}
