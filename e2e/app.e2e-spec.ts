import { WAVCPage } from './app.po';

describe('wavc App', function() {
  let page: WAVCPage;

  beforeEach(() => {
    page = new WAVCPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
