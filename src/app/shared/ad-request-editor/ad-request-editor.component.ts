import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KevelService } from '../../services/kevel.service';

@Component({
  selector: 'app-ad-request-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './ad-request-editor.component.html',
  styleUrl: './ad-request-editor.component.scss'
})
export class AdRequestEditorComponent implements OnChanges {
  @Input() requestJson!: any;
  @Input() responseJson: any = null;
  @Input() onSave!: (result: any) => void;

  rawJson = '';

  constructor(private kevel: KevelService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['requestJson'] && this.requestJson) {
      this.rawJson = JSON.stringify(this.requestJson, null, 2);
    }
  }

  updateRequest() {
    const parsed = JSON.parse(this.rawJson);
    this.kevel.getBannerAd(parsed).subscribe(res => {
      this.responseJson = res;
    });
  }

  save() {
    if (!this.responseJson) return;
    this.onSave(this.responseJson.decisions?.banner);
  }

  get formattedResponse(): string {
    return this.responseJson ? JSON.stringify(this.responseJson, null, 2) : '';
  }
}
