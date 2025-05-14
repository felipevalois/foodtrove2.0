import {
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/theme-tomorrow';
import 'ace-builds/src-min-noconflict/ext-language_tools';

@Component({
  selector: 'app-search-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-flow.component.html',
  styleUrls: ['./search-flow.component.scss']
})
export class SearchFlowComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild('searchEditor') searchEditorEl!: ElementRef<HTMLDivElement>;
  @ViewChild('queryEditor') queryEditorEl!: ElementRef<HTMLDivElement>;
  @ViewChild('responseEditor') responseEditorEl!: ElementRef<HTMLDivElement>;

  showMiro = true;
  currentStep = 0;

  readonly slides = [
    'userSearch',
    'searchResults',
    'adQuery',
    'adDecision',
    'deduplicated',
    'reSorted',
    'finalDisplay'
  ];

  searchResultsJson = {
    results: [
      {
        'Product ID': 11,
        Name: 'Peanuts toasted salted Power Food 100g',
        Brand: 'Big Cashew Co.',
        Price: 3,
        Sale_Price: 2
      },
      {
        'Product ID': 9,
        Name: 'Peanuts natural flavor Power Food 100g',
        Brand: 'Big Cashew Co.',
        Price: 5,
        Sale_Price: 3
      }
    ],
    note: '17 more results'
  };

  adQueryJson = {
    placements: [
      {
        divName: 'search_slot_1',
        adTypes: [1],
        properties: {
          product_ids: [11, 9, 5, 12, 18]
        }
      }
    ],
    user: {
      key: 'user-123'
    }
  };

  adDecisionJson = {
    decisions: {
      search_slot_1: [
        {
          ad_id: 201,
          product_id: 12,
          name: 'Whole peanuts in shell Power Food 100g',
          brand: 'Big Cashew Co.',
          sale_price: 3
        }
      ]
    }
  };

  ngAfterViewInit() {
    const ace = (window as any).ace;

    const setup = (el: ElementRef, json: any) => {
      const editor = ace.edit(el.nativeElement);
      editor.session.setMode('ace/mode/json');
      editor.setTheme('ace/theme/tomorrow');
      editor.setOptions({ fontSize: '14px', readOnly: true, showLineNumbers: false });
      editor.setHighlightActiveLine(false);
      editor.setValue(JSON.stringify(json, null, 2), -1);
      return editor;
    };

    setup(this.searchEditorEl, this.searchResultsJson);
    setup(this.queryEditorEl, this.adQueryJson);
    setup(this.responseEditorEl, this.adDecisionJson);
  }

  goNext() {
    if (this.currentStep < this.slides.length - 1) this.currentStep++;
  }

  goBack() {
    if (this.currentStep > 0) this.currentStep--;
  }

  toggleMode() {
    this.showMiro = !this.showMiro;
  }

  emitClose() {
    this.close.emit();
  }
}
