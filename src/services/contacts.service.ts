import {Injectable} from '@angular/core';
import {Http, HttpModule, Response, RequestOptions, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import * as Rx from 'rxjs/Rx';
import {webServiceEndpoint} from '../app/common/constants';
import {Contact} from '../models/contact';
import {PaginationPage, PaginationPropertySort} from '../app/common/pagination';
import {HmacHttpClient} from '../app/utils/hmac-http-client';

@Injectable()
export class ContactService {

constructor(private httpService: Http) {
  };

  findContacts(page: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any> {
    const params: any = {page: page, size: pageSize, headers: this.getHeaders()};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/contact', {search: params})
        .map(res => res.json())
        .do(data => console.log(data))
        .toPromise()
    ).publish().refCount();
  };

  findFilteredContacts(page: number, pageSize: number, sort: PaginationPropertySort, groupId: string): Rx.Observable<any> {
    const params: any = {page: page, size: pageSize, headers: this.getHeaders()};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/contact/group/' + groupId, {search: params})
        .map(res => res.json())
        .toPromise()
    ).publish().refCount();
  };

  searchContacts(name: string, page: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any> {
    const params: any = {size: pageSize, page: page};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/contact/search/' + name, {search: params})
        .map(res => res.json())
        .toPromise()
    ).publish().refCount();
  }

  query(params?: URLSearchParams): Observable<Contact[]> {
    return this.httpService
      .get(webServiceEndpoint, {search: params})
      .map((response) => {
        const result: any = response.json();
        const contacts: Array<Contact> = [];
        result.content.forEach((contact) => {
          console.log(contact.lastName);
          const newContact = new Contact(
            contact.id,
            contact.firstName,
            contact.lastName,
            contact.title,
            contact.company,
            '',
            '',
            '',
            ''
          );
          contacts.push(newContact);
        });
        return contacts;
      });
  };

  get(id: number): Observable<Contact> {
    const contact$ = this.httpService
      .get(`${webServiceEndpoint}/contact/${id}`, {headers: this.getHeaders()})
      .map(mapContact);
    return contact$;
  };

  save(contact: Contact) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (contact.id) {
      return this.httpService.put(webServiceEndpoint + '/contact/', contactToJson(contact), {
        headers: headers
      })
        .map((data) => {
          return data;
        })
      .catch((error: any) => {
        if (error.status === 403) {
          handleError(error);
          return Observable.throw('Unauthorized request!');
        }
        // do any other checking for statuses here
      });
    } else {
      return this.httpService.post(webServiceEndpoint + '/contact/', contactToJson(contact),
        {
          headers: headers
        })
        .map((data) => {
          return data;
        })
      .catch((error: any) => {
        if (error.status === 403) {
          handleError(error);
          return Observable.throw('Unauthorized request!');
        }
        // do any other checking for statuses here
      });
    }
  }

  remove(id: string) {
    return this.httpService
      .delete(webServiceEndpoint + '/contact/' + id)
      .map((response) => {
        const result: any = response.json();
        return result.id;
      })
      .catch((error: any) => {
        if (error.status === 403) {
          handleError(error);
          return Observable.throw('Unauthorized');
        }
        // do any other checking for statuses here
      })
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');

    return headers;
  }
}

function mapContacts(response: Response): Contact[] {
  // uncomment to simulate error:
  // throw new Error('ups! Force choke!');

  // The response of the API has a content
  // property with the actual results
  return response.json().content.map(toContact);
}

function toContact(r: any): Contact {
  const contact = <Contact>({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    title: r.title,
    company: r.company,
    imageURL: r.imageURL,
    skype: r.skype,
    twitter: r.twitter,
    notes: r.notes
  });
  console.log('Parsed contact:', contact);
  return contact;
}

function mapContact(response: Response): Contact {
  return toContact(response.json());
}

// this could also be a private method of the component class
function handleError(error: any) {
  // log error
  // could be something more sophisticated
  const errorMsg = error.message || `Yikes! There was was a problem and we couldn't process the request!`;
  console.error(errorMsg);
  alert(errorMsg);
  // throw an application level error
  return Observable.throw(errorMsg);
}

function
  contactToJson(contact: Contact) {
  const doc = {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    title: contact.title,
    company: contact.company
    //      image_url: this.image,
    //      skype: this.skype,
    //      twitter: this.twitter,
    //      notes: this.notes
  };

  //    return stringify ? JSON.stringify({ resource: [doc] }) : doc;
  return JSON.stringify(doc);
}
