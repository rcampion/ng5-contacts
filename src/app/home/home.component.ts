import { Component, OnInit } from '@angular/core';
import {ErrorService} from '../../services/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
      this.errorService.changeMessage('');
  }

}
