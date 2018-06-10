import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMemberSelectorComponent } from './group-member-selector.component';

describe('GroupMemberSelectorComponent', () => {
  let component: GroupMemberSelectorComponent;
  let fixture: ComponentFixture<GroupMemberSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMemberSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMemberSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
