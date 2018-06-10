export class Contact {
  constructor(
    public id: string,
    public firstName: string = '',
    public lastName: string = '',
    public title: string = '',
    public company: string = '',
    public imageURL: string = '',
    public skype: string = '',
    public twitter: string = '',
    public notes: string = ''
  ) { };
}
