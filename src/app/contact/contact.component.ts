import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {URLSearchParams} from '@angular/http';
import {Contact} from '../../models/contact';
import {ContactService} from '../../services/contacts.service';
import {BaseHttpService} from '../../services/base-http.service';
import * as constants from '../common/constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: [ContactService, BaseHttpService]
})

export class ContactComponent {
  form: FormGroup;

  id: number;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  imageURL: string;
  skype: string;
  twitter: string;

  selectedGroupId: string = null;

  contact: Contact = new Contact(
    '',
  );

  constructor(private contactService: ContactService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private httpService: BaseHttpService) {

    route.params.subscribe(params => {this.id = params['id']; });

    if (this.id) {
      const self = this;
      const contactGroupParams = new URLSearchParams();
      const passedId = Number(this.id);
      contactService
        .get(passedId)
        .subscribe((contact) => self.contact = contact);
    }

    this.form = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'title': [''],
      'company': [''],
      'imageURL': [''],
      'skype': [''],
      'twitter': ['']
    });
  }

  back() {
    this.router.navigate(['/contacts']);
  };

  save() {
    const self = this;
    const isNew = !this.contact.id;

    this.contactService.save(this.contact)
      .subscribe((response) => {
        if (isNew) {
          alert('New contact created');
        } else {
          alert('Contact updated');
        }
        self.back();
      });
  }
}
