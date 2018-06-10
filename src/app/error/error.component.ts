import {Component, OnInit} from '@angular/core';

import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'app-error',
  template: `
    {{message}}
  `,
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message: string;
  constructor(private data: ErrorService) {}
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }
}
