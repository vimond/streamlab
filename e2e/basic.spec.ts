import { Selector } from 'testcafe';

const isWindows = () => process.platform.startsWith('win');

const resizeWindow = async (t: TestController) => isWindows() && await t.resizeWindow(5000, 200);

fixture `Basic playback`
  .page(process.env.TEST_PAGE || '')
  .beforeEach(async (t) => await resizeWindow(t));

test('Inputting stream URL', async t => {
  const streamUrl = 'https://vimond.github.io/replay/public/example-media/adaptive.m3u8';
  const firstMessage = 'Auto detected stream type is Apple HLS. Press Play to load it into the player.';
  const secondMessage = /The player will use the HLS.js v(.*?) library for playing this stream./;
  const shareUrl = '?s={%22streamDetails%22:{%22streamResource%22:{%22url%22:%22https:%2F%2Fvimond.github.io%2Freplay%2Fpublic%2Fexample-media%2Fadaptive.m3u8%22,%22technology%22:0}}}'

  const streamUrlField = Selector('input[placeholder="Stream URL"]');
  const firstMessageItem = Selector('*').withAttribute('role', 'alert').nth(0);
  const secondMessageItem = Selector('*').withAttribute('role', 'alert').nth(1);
  const playButton = Selector('button').withText('Play');
  const sharingTab = Selector('*').withAttribute('role', 'tab').withText('Sharing');
  const shareUrlField = Selector('*').withAttribute('role', 'tabpanel').nth(2).find('p').nth(-1);

  await t
    .expect(playButton.hasAttribute('disabled')).ok()
    .typeText(streamUrlField, streamUrl, { paste: true }) // No one types a URL key by key.
    .expect(playButton.hasAttribute('disabled')).notOk()
    .expect(firstMessageItem.textContent).contains(firstMessage)
    .expect(secondMessageItem.textContent).match(secondMessage)
    .click(sharingTab)
    .expect(shareUrlField.textContent).contains(shareUrl);


  // Info field correct info
  // Play button enabled
  // Sharing URL filled


  // https://medium.com/better-programming/cross-browser-testing-with-testcafe-on-github-actions-49ec58ac855c
});

// test Playing stream URL
// Both click play and press enter
