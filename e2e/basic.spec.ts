import { page } from './page';

const { sharing, basic, info, top, history, player, fixture } = page;

fixture('Basic playback');

const streamUrl = 'https://vimond.github.io/replay/public/example-media/adaptive.m3u8';

test('Inputting stream URL.', async (t) => {
  const firstMessage = 'Auto detected stream type is HLS. Press Play to load it into the player.';
  const secondMessage = /The player will use the HLS.js v(.*?) library for playing this stream./;
  const shareUrl =
    '?s={%22streamDetails%22:{%22streamResource%22:{%22url%22:%22https:%2F%2Fvimond.github.io%2Freplay%2Fpublic%2Fexample-media%2Fadaptive.m3u8%22,%22technology%22:0}}}';

  await t
    .expect(basic.playButton.hasAttribute('disabled'))
    .ok()
    .typeText(basic.streamUrlField, streamUrl, { paste: true }) // No one types a URL key by key.
    .expect(basic.playButton.hasAttribute('disabled'))
    .notOk()
    .expect(info.messageList.nth(0).textContent)
    .contains(firstMessage)
    .expect(info.messageList.nth(1).textContent)
    .match(secondMessage)
    .click(top.tabs.sharing)
    .expect(sharing.shareUrlField.textContent)
    .contains(shareUrl);
});

test('Starting and ending playback.', async (t) => {
  await t
    .typeText(basic.streamUrlField, streamUrl, { paste: true })
    .click(basic.playButton)
    .expect(player.videoElement.getAttribute('src'))
    .ok()
    .click(player.controls.mute)
    .wait(3000)
    .expect(player.videoElement.duration)
    .gt(10)
    .hover(player.replay)
    .click(player.controls.exit)
    .expect(player.videoElement.getAttribute('src'))
    .notOk()
    .click(basic.streamUrlField)
    .pressKey('enter')
    .expect(player.videoElement.getAttribute('src'))
    .ok()
    .wait(3000)
    .hover(player.replay)
    .click(player.controls.exit)
    .click(top.tabs.history)
    .expect(history.entries.nth(1).exists)
    .notOk() // Two identical playback starts give one entry.
    .expect(history.entries.nth(0).textContent)
    .contains('HLS stream on vimond.github.io');
});

test('Incorrect stream technology selection with error reporting.', async (t) => {
  await t
    .typeText(basic.streamUrlField, streamUrl, { paste: true })
    .click(basic.streamTechnologyButton)
    .click(basic.progressiveVideoButton)
    .click(basic.playButton)
    .expect(info.messageList.nth(-1).textContent)
    .contains('MEDIA_ERR_SRC_NOT_SUPPORTED')
    .click(top.tabs.history)
    .expect(history.entries.nth(0).textContent)
    .contains('Progressive video stream on vimond.github.io')
    .expect(history.entries.nth(0).find('.chakra-badge').withText('ERR').exists)
    .ok()
    .expect(top.tabs.info.find('.chakra-badge').withText('1').exists)
    .ok();
});
