import { page } from './page';
import { reproduceShareUrlField } from './page';

const { top, advanced, alert, fixture, player, info, history, sharing } = page;

fixture('Advanced playback');

const streamUrl = 'https://vimond.github.io/replay/public/example-media/adaptive.m3u8';
const subtitlesUrl = 'https://vimond.github.io/replay/public/example-media/subtitles/no.vtt';
const encryptedStreamUrl = 'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd';
const widevineLicenseUrl = 'https://cwip-shaka-proxy.appspot.com/no_auth';
const firstHeaderName = 'X-My-First-Header';
const secondHeaderName = 'X-My-Second-Header';
const firstHeaderValue = 'Number 1';
const secondHeaderValue = 'Number 2';

// TODO: Consider moving this to fixture with sidebar collapse/expand.
test('Expanding/collapsing.', async (t) => {
  await t
    .click(top.header.advancedSwitch)
    .expect(advanced.streamDetails.streamUrlField.visible)
    .ok()
    .click(advanced.accordionButtons.streamDetails)
    .expect(advanced.streamDetails.streamUrlField.visible)
    .notOk()
    .expect(advanced.playerOptions.playerLibraryButton.visible)
    .notOk()
    .click(advanced.accordionButtons.playerOptions)
    .expect(advanced.playerOptions.playerLibraryButton.visible)
    .ok()
    .click(advanced.accordionButtons.streamDetails)
    .expect(advanced.streamDetails.streamUrlField.visible)
    .ok();
});

test('Inputting advanced stream details.', async (t) => {
  await t
    .click(top.header.advancedSwitch)
    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .expect(advanced.playButton.hasAttribute('disabled'))
    .ok()
    .expect(advanced.stopButton.hasAttribute('disabled'))
    .ok()
    .typeText(advanced.streamDetails.streamUrlField, streamUrl, { paste: true })
    .expect(advanced.playButton.hasAttribute('disabled'))
    .notOk()
    .click(advanced.streamDetails.streamTechnologyButton)
    .click(advanced.streamDetails.hlsButton)
    .click(advanced.streamDetails.subtitlesFormatButton)
    .click(advanced.streamDetails.webVttButton)
    .typeText(advanced.streamDetails.startOffsetField, '16')
    .typeText(advanced.streamDetails.subtitlesUrlField, subtitlesUrl, { paste: true })
    // TODO: Verify that text track and subtitle tracks appear in DOM. Needs crossorigin attribute on video element.
    .click(advanced.playButton)
    .expect(player.videoElement.getAttribute('src'))
    .ok()
    .wait(3000)
    .expect(player.videoElement.currentTime)
    .gt(15)
    .expect(player.playbackMonitor.exists)
    .notOk()
    .click(advanced.stopButton)
    .click(top.tabs.history)
    .click(history.latestEntry)
    .expect(history.selectedEntry.streamUrl.value)
    .eql(streamUrl)
    .expect(history.selectedEntry.subtitlesUrl.value)
    .eql(subtitlesUrl)
    .click(top.tabs.sharing)
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('url', streamUrl))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('url', subtitlesUrl))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('startOffset', 16));
});

test('DRM playback that fails.', async (t) => {
  await t
    .click(top.header.advancedSwitch)
    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .expect(info.hasMessageContaining('Widevine'))
    .ok()
    .typeText(advanced.streamDetails.streamUrlField, encryptedStreamUrl, { paste: true })
    .typeText(advanced.streamDetails.drmLicenseUrlField, widevineLicenseUrl, { paste: true })
    .click(advanced.streamDetails.addLicenseHeader)
    // TODO: Adding/removing headers, consider separating out.
    .typeText(advanced.streamDetails.headerName, firstHeaderName, { paste: true })
    .typeText(advanced.streamDetails.headerValue, firstHeaderValue, { paste: true })
    .click(advanced.streamDetails.addLicenseHeader)
    .typeText(advanced.streamDetails.headerName.nth(1), secondHeaderName, { paste: true })
    .typeText(advanced.streamDetails.headerValue.nth(1), secondHeaderValue, { paste: true })
    .click(advanced.streamDetails.removeHeaderButton.nth(0))
    .expect(advanced.streamDetails.headerName.nth(0).withAttribute('value', secondHeaderName).exists)
    .ok()
    .expect(advanced.streamDetails.headerValue.nth(0).withAttribute('value', secondHeaderValue).exists)
    .ok()
    .expect(advanced.streamDetails.headerName.withAttribute('value', firstHeaderName).exists)
    .notOk()
    .expect(advanced.streamDetails.headerValue.withAttribute('value', firstHeaderValue).exists)
    .notOk()
    .click(advanced.playButton)
    .wait(5000)
    .expect(info.hasMessageContaining('Auto detected stream type is MPEG DASH.'))
    .ok()
    // TODO: Deep inspection of Replay verifying the DRM details being passed on.
    .expect(info.hasMessageContaining('Player error: Shaka Error DRM.LICENSE_REQUEST_FAILED'))
    .ok()
    // .expect(player.videoElement.duration)
    // .gt(10)
    .click(advanced.stopButton)
    .click(top.tabs.history)
    .click(history.latestEntry)
    .expect(history.selectedEntry.streamUrl.value)
    .eql(encryptedStreamUrl)
    .expect(history.selectedEntry.drmLicenseUrl.value)
    .eql(widevineLicenseUrl)
    .expect(history.selectedEntry.drmLicenseHeaders.nth(0).value)
    .eql(secondHeaderName)
    .expect(history.selectedEntry.drmLicenseHeaders.nth(1).value)
    .eql(secondHeaderValue)
    .click(top.tabs.sharing)
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('url', encryptedStreamUrl))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('url', widevineLicenseUrl))
    .expect(sharing.shareUrlField.textContent)
    .notContains(reproduceShareUrlField('name', firstHeaderName))
    .expect(sharing.shareUrlField.textContent)
    .notContains(reproduceShareUrlField('value', firstHeaderValue))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('name', secondHeaderName))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('value', secondHeaderValue));
});

test('Setting player options', async (t) => {
  await t
    .click(top.header.advancedSwitch)
    .click(advanced.accordionButtons.playerOptions)
    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .typeText(advanced.streamDetails.streamUrlField, streamUrl, { paste: true })
    .expect(advanced.accordionButtons.playerOptions.textContent)
    .notContains('*')
    .click(advanced.playerOptions.playerLibraryButton)
    .click(advanced.playerOptions.shakaPlayerButton)
    .expect(advanced.accordionButtons.playerOptions.textContent)
    .contains('*')
    .click(advanced.playerOptions.warningLevelButton)
    .click(advanced.playerOptions.debugLevelButton) // TODO: Verify by deep inspection of player.
    .click(advanced.playerOptions.playbackMonitorSwitch)
    // TODO: Add custom configuration
    .expect(advanced.accordionButtons.playerOptions.textContent)
    .contains('*')
    .click(advanced.playButton)
    .expect(player.videoElement.getAttribute('src'))
    .ok()
    .expect(info.hasMessageContaining('In Player options, the Shaka Player'))
    .ok()
    .wait(2000)
    .expect(player.playbackMonitor.exists)
    .ok()
    .click(advanced.stopButton)
    .click(top.tabs.history)
    .click(history.latestEntry)
    .expect(history.selectedEntry.streamUrl.value)
    .eql(streamUrl)
    .expect(history.selectedEntry.playerLibrary.value)
    .eql('Shaka Player')
    .expect(history.selectedEntry.showPlaybackMonitor.checked)
    .eql(true)
    .expect(history.selectedEntry.playerLogLevel.value)
    .eql('DEBUG')
    .click(top.tabs.sharing)
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('url', streamUrl))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('playerLibrary', 'SHAKA_PLAYER'))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('showPlaybackMonitor', true))
    .expect(sharing.shareUrlField.textContent)
    .contains(reproduceShareUrlField('logLevel', 4));
});
