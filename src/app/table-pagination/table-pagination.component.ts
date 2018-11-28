import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading, doNothing} from '../common/loader';
import * as Rx from 'rxjs/Rx';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css']
})

export class TablePaginationComponent<T> {

  @Input() table: Table<any>;
  @Input() page: PaginationPage<T>;

  get pagesIndexes(): Array<number> {
    const pagesIndexes: Array<number> = [];
    for (let i = 0; i < this.page.totalPages; i++) {
      pagesIndexes.push(i + 1);
    }
    return pagesIndexes;
  }

  fetchPageNumber(pageNumber: number) {
    const observable: Rx.Observable<any> = this.table.fetchPage(pageNumber - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  fetchPageSize(pageSize: number) {
    const observable: Rx.Observable<any> = this.table.fetchPage(this.page.number, pageSize, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  fetchNextPage() {
    const pageToFetch: number = this.page.number + 1;

    if (pageToFetch >= this.page.totalPages) {
      return;
    }

    /* getting broken pipe .... ????? */
    this.fetchPageNumber(pageToFetch + 1);

    /*
    const observable: Rx.Observable<any> = this.table.fetchPage(pageToFetch, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  */
  }

  fetchPreviousPage() {
    if (this.page.number === 0) {
      return;
    }

    const observable: Rx.Observable<any> = this.table.fetchPage(this.page.number - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(() => {
      }, (e) => {
        hideLoading()
      }, hideLoading);
    }
  }

  private getSort(): PaginationPropertySort {
    if (this.page.sort != null && this.page.sort.length > 0) {
      return this.page.sort[0];
    } else {
      return null;
    }
  }
}
