export class GroupMember {
  constructor(
    public id: string,
    public groupId: string,
    public contactId: string,
    public firstName: string,
    public lastName: string,
    public title: string,
    public company: string
  ) { };
}
