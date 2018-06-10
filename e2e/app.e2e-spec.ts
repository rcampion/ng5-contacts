import { Ng4ContactsPage } from './app.po';

describe('ng4-contacts App', () => {
  let page: Ng4ContactsPage;

  beforeEach(() => {
    page = new Ng4ContactsPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
