import { page } from './page';

// https://medium.com/better-programming/cross-browser-testing-with-testcafe-on-github-actions-49ec58ac855c

const isWindows = () => process.platform.startsWith('win');

const resizeWindow = async (t: TestController) => isWindows() && (await t.resizeWindow(5000, 200));

const streamUrl = 'https://vimond.github.io/replay/public/example-media/adaptive.m3u8';

fixture`Basic playback`.page(process.env.TEST_PAGE || '').beforeEach(async (t) => await resizeWindow(t));

test('Inputting stream URL.', async (t) => {
  const firstMessage = 'Auto detected stream type is Apple HLS. Press Play to load it into the player.';
  const secondMessage = /The player will use the HLS.js v(.*?) library for playing this stream./;
  const shareUrl =
    '?s={%22streamDetails%22:{%22streamResource%22:{%22url%22:%22https:%2F%2Fvimond.github.io%2Freplay%2Fpublic%2Fexample-media%2Fadaptive.m3u8%22,%22technology%22:0}}}';

  await t
    .expect(page.basic.playButton.hasAttribute('disabled'))
    .ok()
    .typeText(page.basic.streamUrlField, streamUrl, { paste: true }) // No one types a URL key by key.
    .expect(page.basic.playButton.hasAttribute('disabled'))
    .notOk()
    .expect(page.info.messageList.nth(0).textContent)
    .contains(firstMessage)
    .expect(page.info.messageList.nth(1).textContent)
    .match(secondMessage)
    .click(page.top.tabs.sharing)
    .expect(page.sharing.shareUrlField.textContent)
    .contains(shareUrl);
});

test('Starting and ending playback.', async (t) => {
  await t
    .typeText(page.basic.streamUrlField, streamUrl, { paste: true })
    .click(page.basic.playButton)
    .expect(page.player.videoElement.getAttribute('src'))
    .ok()
    .click(page.player.controls.mute)
    .wait(3000)
    .expect(page.player.videoElement.currentTime)
    .gt(1)
    .hover(page.player.replay)
    .click(page.player.controls.exit)
    .expect(page.player.videoElement.getAttribute('src'))
    .notOk()
    .click(page.basic.streamUrlField)
    .pressKey('enter')
    .expect(page.player.videoElement.getAttribute('src'))
    .ok()
    .wait(3000)
    .hover(page.player.replay)
    .click(page.player.controls.exit)
    .click(page.top.tabs.history)
    .expect(page.history.entries.nth(1).exists)
    .notOk() // Two identical playback starts give one entry.
    .expect(page.history.entries.nth(0).textContent)
    .contains('HLS stream on vimond.github.io');
});

test('Incorrect stream technology selection with error reporting.', async (t) => {
  await t
    .typeText(page.basic.streamUrlField, streamUrl, { paste: true })
    .click(page.basic.streamTechnologyButton)
    .click(page.basic.progressiveVideoButton)
    .click(page.basic.playButton)
    .expect(page.info.messageList.nth(-1).textContent)
    .contains('MEDIA_ERR_SRC_NOT_SUPPORTED')
    .click(page.top.tabs.history)
    .expect(page.history.entries.nth(0).textContent)
    .contains('Progressive video stream on vimond.github.io')
    .expect(page.history.entries.nth(0).find('.chakra-badge').withText('ERR').exists)
    .ok()
    .expect(page.top.tabs.info.find('.chakra-badge').withText('1').exists)
    .ok();
});
