import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import * as Rx from 'rxjs/Rx';
import {webServiceEndpoint} from '../app/common/constants';
import {Group} from '../models/group';
import {PaginationPage, PaginationPropertySort} from '../app/common/pagination';
import {HmacHttpClient} from '../app/utils/hmac-http-client';

@Injectable()
export class GroupService {

  constructor(private httpService: Http) {
  };

  findGroups(page: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any> {
    const params: any = {page: page, size: pageSize};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/group', {search: params})
        .map(res => res.json())
        .toPromise()
    ).publish().refCount();
  };

  findGroupMembers(groupId: string, page: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any> {
    const params: any = {page: page, size: pageSize};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/group/member/' + groupId, {search: params})
        .map(res => res.json())
        .toPromise()
    ).publish().refCount();
  };

  searchGroups(name: string, page: number, pageSize: number, sort: PaginationPropertySort): Rx.Observable<any> {
    const params: any = {size: pageSize, page: page};
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }
    return <Rx.Observable<PaginationPage<any>>>Rx.Observable.fromPromise(
      this.httpService
        .get(webServiceEndpoint + '/group/search/' + name, {search: params})
        .map(res => res.json())
        .toPromise()
    ).publish().refCount();
  }

  query(params?: URLSearchParams): Observable<Group[]> {
    return this.httpService
      .get(webServiceEndpoint, {search: params})
      .map((response) => {
        const result: any = response.json();
        const groups: Array<Group> = [];
        result.content.forEach((group) => {
          console.log(group.lastName);
          const newGroup = new Group(
            group.id,
            group.groupName,
            group.groupDescription
          );
          groups.push(newGroup);
        });
        return groups;
      });
  };

  get(id: number): Observable<Group> {
    const group$ = this.httpService
      .get(`${webServiceEndpoint}/group/${id}`, {headers: this.getHeaders()})
      .map(mapGroup);
    return group$;
  };

  save(group: Group) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (group.groupId) {
      return this.httpService.put(webServiceEndpoint + '/group/', groupToJson(group), {
        headers: headers
      })
        .map((data) => {
          return data;
        });
    } else {
      return this.httpService.post(webServiceEndpoint + '/group/', groupToJson(group),
        {
          headers: headers
        })
        .map((data) => {
          return data;
        });
    }
  }

  addGroupMember(groupId: string, contactId: string) {
    console.log('Adding Group Member: ' + 'Group Id:' + groupId + ' Contact Id:' + contactId);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const test = webServiceEndpoint + '/group/member/' + groupId + '/' + contactId;
    return this.httpService.post(webServiceEndpoint + '/group/member/' + groupId + '/' + contactId,
      {
        headers: headers
      })
      .map((data) => {
        return data;
      });
  }

  removeGroup(id: string) {
    return this.httpService
      .delete(webServiceEndpoint + '/group/' + id)
      .map((response) => {
        const result: any = response.json();
        return result.id;
      });
  }

  removeGroupMember(id: string) {
    return this.httpService
      .delete(webServiceEndpoint + '/group/member/' + id)
      .map((response) => {
        const result: any = response.json();
        return result.id;
      });
  }
  private getHeaders() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
}

function mapGroups(response: Response): Group[] {
  // uncomment to simulate error:
  // throw new Error('ups! Force choke!');

  // The response of the API has a content
  // property with the actual results
  return response.json().content.map(toGroup);
}

function toGroup(r: any): Group {
  const group = <Group>({
    groupId: r.groupId,
    groupName: r.groupName,
    groupDescription: r.groupDescription
  });
  console.log('Parsed group:', group);
  return group;
}

function mapGroup(response: Response): Group {
  return toGroup(response.json());
}

function
  groupToJson(group: Group) {
  const doc = {
    groupId: group.groupId,
    groupName: group.groupName,
    groupDescription: group.groupDescription
  };

  return JSON.stringify(doc);
}

