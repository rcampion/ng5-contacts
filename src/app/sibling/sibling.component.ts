import {Component, OnInit} from '@angular/core';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'app-sibling',
  template: `
    {{message}}
    <button (click)="newMessage()">New Message</button>
  `,
  styleUrls: ['./sibling.component.css']
})
export class SiblingComponent implements OnInit {
  message: string;
  constructor(private data: ErrorService) {}
  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }
  newMessage() {
    this.data.changeMessage('Hello from Sibling')
  }
}
