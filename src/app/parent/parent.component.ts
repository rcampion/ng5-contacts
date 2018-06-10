import {Component, OnInit} from '@angular/core';

import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'app-parent',
  template: `
    {{message}}
  `,
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  message: string;
  constructor(private data: ErrorService) {}
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }
}
