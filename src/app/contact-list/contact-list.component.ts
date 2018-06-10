import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {webServiceEndpoint, defaultItemsCountPerPage} from '../common/constants';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading} from '../common/loader';
import {URLSearchParams} from '@angular/http';
import {Contact} from '../../models/contact';
import {ContactService} from '../../services/contacts.service';
import {BaseHttpService} from '../../services/base-http.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService, BaseHttpService]
})

export class ContactListComponent implements Table<Contact> {
  public contacts: Contact[] = [];

  contactPage: any;
  self: ContactListComponent;
  pageNumber: number;
  currentContact:Contact;

  constructor(private contactService: ContactService, @Inject(Router) private router: Router) {

  }

  ngOnInit() {
    const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
    showLoading();
    observable.subscribe(() => {
    }, hideLoading, hideLoading);
    this.self = this;
  }

  search(): Rx.Observable<PaginationPage<any>> {
    const searchString = (<HTMLInputElement>document.getElementById('search_input')).value;
    if (searchString !== '') {
      const observable: Rx.Observable<PaginationPage<any>> =
        this.contactService.searchContacts(searchString, 0, defaultItemsCountPerPage, null);
      observable.subscribe(contactPage => this.contactPage = contactPage);
      return observable;
    } else {
      const observable: Rx.Observable<PaginationPage<any>> = this.fetchPage(0, defaultItemsCountPerPage, null);
      showLoading();
      observable.subscribe(() => {
      }, hideLoading, hideLoading);
      return observable;
    }
  }

  fetchPage(pageNumber: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<PaginationPage<any>> {
    this.pageNumber = pageNumber;
    const observable: Rx.Observable<PaginationPage<any>> = this.contactService.findContacts(pageNumber, pageSize, sort);
    observable.subscribe(contactPage => this.contactPage = contactPage);
    return observable;
  }

  show(contact) {
    this.router.navigate(['/contact', contact.id]);
  }

  add(contact) {
    this.router.navigate(['/contact']);
  }

  back() {
    this.router.navigate(['/ContactList']);
  };

  delete(contact) {
    const observable: Rx.Observable<string> = this.contactService.remove(contact.id);
    showLoading();
    observable.switchMap(() => {
      return this.fetchPage(this.pageNumber, defaultItemsCountPerPage, null);
    }).subscribe(r => {
      this.fetchPage(this.pageNumber, defaultItemsCountPerPage, null);
    }, hideLoading, hideLoading);
  }
}
