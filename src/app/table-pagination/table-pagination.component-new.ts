import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {PaginationPage, PaginationPropertySort} from '../common/pagination';
import {Table} from '../common/table';
import {showLoading, hideLoading, doNothing} from "../common/loader";
import * as Rx from "rxjs/Rx";

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.css']
})
export class TablePaginationComponent<T> implements OnInit, OnChanges {

  @Input() table: Table<any>;
  @Input() page: PaginationPage<T>;

  pagesIndexes: Array<number> = [];

  ngOnInit() {

  }

  ngOnChanges(changes) {
    if (changes['page']) {
      let pagesIndexes_: Array<number> = [];
      for (let i = 0; i < this.page.totalPages; i++) {
        pagesIndexes_.push(i + 1);
      }
      this.pagesIndexes = pagesIndexes_;
    }
  }

  fetchPageNumber(pageNumer: number) {
    let observable: Rx.Observable<any> = this.table.fetchPage(pageNumer - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(doNothing, hideLoading, hideLoading);
    }
  }

  fetchPageSize(pageSize: number) {
    let observable: Rx.Observable<any> = this.table.fetchPage(this.page.number, pageSize, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(doNothing, hideLoading, hideLoading);
    }
  }

  fetchNextPage() {

    const pageToFetch: number = this.page.number + 1;

    if (this.page.number + 1 >= this.page.totalPages) {
      return;
    }

    this.fetchPageNumber(pageToFetch +1);
/*
    let observable: Rx.Observable<any> = this.table.fetchPage(this.page.number + 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(doNothing, hideLoading, hideLoading);
    }
*/

  }

  fetchPreviousPage() {
    if (this.page.number == 0) {
      return;
    }

    let observable: Rx.Observable<any> = this.table.fetchPage(this.page.number - 1, this.page.size, this.getSort());
    if (observable != null) {
      showLoading();
      observable.subscribe(doNothing, hideLoading, hideLoading);
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
