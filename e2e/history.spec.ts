import { page } from './page';

const { advanced, info, alert, top, history, player, fixture } = page;

fixture('Form history side panel');

const streamUrl = 'https://vimond.github.io/replay/public/example-media/adaptive.m3u8';

const fillHistory = (t: TestController) =>
  t
    .click(top.header.advancedSwitch)
    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .typeText(advanced.streamDetails.streamUrlField, streamUrl, { paste: true })
    .typeText(advanced.streamDetails.startOffsetField, '16')
    .click(advanced.playButton)

    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .click(advanced.stopButton)

    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .typeText(advanced.streamDetails.streamUrlField, streamUrl + 'xyz', { paste: true })
    .click(advanced.playButton)

    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .click(advanced.stopButton)

    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .typeText(advanced.streamDetails.streamUrlField, streamUrl + '?some=parameters', { paste: true })
    .click(advanced.accordionButtons.playerOptions)
    .click(advanced.playerOptions.playerLibraryButton)
    .click(advanced.playerOptions.shakaPlayerButton)
    .click(advanced.playButton)

    .click(advanced.clearButton)
    .click(alert.clearFormsButton)
    .click(advanced.stopButton)
    .click(top.tabs.history);

test('Restore history entry into form', async (t) => {
  await fillHistory(t)
    .expect(advanced.streamDetails.streamUrlField.value)
    .eql('')
    .expect(advanced.streamDetails.startOffsetField.value)
    .eql('')

    .click(history.entries.nth(2))
    .click(history.selectedEntry.restoreButton)
    .expect(advanced.streamDetails.streamUrlField.value)
    .eql(streamUrl)
    .expect(advanced.streamDetails.startOffsetField.value)
    .eql('') // Currently we don't store the start offset in the history.
    .expect(advanced.playerOptions.playerLibraryButton.visible)
    .ok()

    .click(history.entries.nth(0))
    .click(history.selectedEntry.restoreButton)
    .expect(advanced.streamDetails.streamUrlField.value)
    .eql(streamUrl + '?some=parameters')
    .expect(advanced.playerOptions.playerLibraryButton.visible)
    .notOk()
    .expect(advanced.playerOptions.shakaPlayerButton.visible)
    .ok()
    .click(advanced.playButton)
    .expect(player.videoElement.getAttribute('src'))
    .ok()
    .click(top.tabs.info)
    .expect(info.hasMessageContaining('In Player options, the Shaka Player'))
    .ok();
});

test('Give history entry name', async (t) => {
  await fillHistory(t)
    .click(history.entries.nth(2))
    .expect(history.selectedEntry.nameField.value)
    .eql('')
    .typeText(history.selectedEntry.nameField, 'My usual test stream')
    .expect(history.entries.nth(2).textContent)
    .match(/My usual test stream/); // Leading space in actual DOM.
});

test('Delete history entry', async (t) => {
  await fillHistory(t)
    .expect(history.entries.nth(0).child('*').withText('ERR').exists)
    .notOk()
    .click(history.entries.nth(0))
    .click(history.selectedEntry.deleteButton)
    .expect(history.entries.count)
    .eql(2)
    .expect(history.entries.nth(0).child('*').withText('ERR').exists)
    .ok();
});

test('Delete unnamed history entries', async (t) => {
  await fillHistory(t)
    .click(history.entries.nth(2))
    .expect(history.selectedEntry.nameField.value)
    .eql('')
    .typeText(history.selectedEntry.nameField, 'My precious test stream', { paste: true })
    .click(history.clearUnnamedButton)
    .click(history.deleteUnnamedAlert.clearUnnamedButton)
    .expect(history.entries.count)
    .eql(1)
    .expect(history.entries.nth(0).textContent)
    .match(/My precious test stream/);
});

test('Delete all history entries', async (t) => {
  await fillHistory(t)
    .click(history.entries.nth(2))
    .expect(history.selectedEntry.nameField.value)
    .eql('')
    .typeText(history.selectedEntry.nameField, 'My precious test stream', { paste: true })
    .click(history.clearHistoryButton)
    .click(history.deleteHistoryAlert.clearHistoryButton)
    .expect(history.entries.count)
    .eql(0);
});
