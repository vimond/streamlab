import { Selector } from 'testcafe';

const isWindows = () => process.platform.startsWith('win');
const resizeWindow = async (t: TestController) => isWindows() && (await t.resizeWindow(5000, 200));

const tabs = Selector('*').withAttribute('role', 'tab');
const basicForm = Selector('*').withAttribute('aria-label', 'Basic form');
const advancedForms = Selector('*').withAttribute('aria-label', 'Advanced forms');
const streamDetailsForm = Selector('*').withAttribute('aria-label', 'Stream details form');
const playerOptionsForm = Selector('*').withAttribute('aria-label', 'Player options form');
const messageList = Selector('*').withAttribute('aria-label', 'Information panel').find('li');
const historyList = Selector('*').withAttribute('aria-label', 'Form history panel').find('li');
const selectedHistoryEntry = Selector('*').withAttribute('aria-label', 'Form history entry');

// Click latest history entry and get details.
// Extract details from share URL.

export const simplerEncodeUri = (str: string) =>
  encodeURIComponent(str)
    .replace(/%7B/g, '{')
    .replace(/%7D/g, '}')
    .replace(/%2C/g, ',')
    .replace(/%3A/g, ':')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']');

export const reproduceShareUrlField = (key: string, value: string | number | boolean) =>
  simplerEncodeUri(typeof value === 'string' ? `"${key}":"${value}"` : `"${key}":${value}`);

interface VideoElementSelector extends Selector {
  currentTime: Promise<number>;
  duration: Promise<number>;
}

export const page = {
  top: {
    header: {
      // Accessibility selector would have been based on going via <label for="...">
      advancedSwitch: Selector('#advanced-switch'),
    },
    tabs: {
      info: tabs.withText('Info'),
      history: tabs.withText('History'),
      sharing: tabs.withText('Sharing'),
    },
  },
  basic: {
    streamUrlField: basicForm.find('input[placeholder="Stream URL"]'),
    streamTechnologyButton: basicForm.find('button').withText('Autodetect stream technology'), // TODO: Select menu label instead
    progressiveVideoButton: basicForm.find('button').withText('Progressive video'),
    playButton: basicForm.find('button').withText('Play'),
  },
  advanced: {
    accordionButtons: {
      streamDetails: advancedForms.find('button').withText('Stream details'),
      playerOptions: advancedForms.find('button').withText('Player options'),
    },
    streamDetails: {
      streamUrlField: streamDetailsForm.find('input[placeholder="Stream URL"]'),
      streamTechnologyButton: streamDetailsForm.find('button').withText('Auto').nth(0), // TODO: Menu label
      hlsButton: streamDetailsForm.find('button').withText('HLS'),
      drmLicenseUrlField: streamDetailsForm.find('input[placeholder="DRM license URL"]'),
      addLicenseHeader: streamDetailsForm.find('button').withText('Add header'),
      drmLicenseTechnologyButton: streamDetailsForm.find('button').withText('Widevine').nth(0), // TODO: Menu label
      headerName: streamDetailsForm.find('input[placeholder="Header name"]'),
      headerValue: streamDetailsForm.find('input[placeholder="Header value"]'),
      removeHeaderButton: streamDetailsForm.find('button').withAttribute('aria-label', 'Remove header'),
      drmCertificateUrlField: streamDetailsForm.find('input[placeholder="DRM certificate URL"]'),
      drmCertificateTechnologyButton: streamDetailsForm.find('button').withText('Widevine').nth(1), // TODO: Menu label
      subtitlesUrlField: streamDetailsForm.find('input[placeholder="Subtitles URL"]'),
      subtitlesFormatButton: streamDetailsForm.find('button').withText('Auto').nth(1), // TODO: Menu label
      webVttButton: streamDetailsForm.find('button').withText('WebVTT'),
      startOffsetField: streamDetailsForm.find('input[type=number]'), // More specific?
    },
    playerOptions: {
      playerLibraryButton: playerOptionsForm.find('button').withText('Automatic selection'),
      shakaPlayerButton: playerOptionsForm.find('button').withText('Shaka Player'),
      warningLevelButton: playerOptionsForm.find('button').withText('WARNING'),
      debugLevelButton: playerOptionsForm.find('button').withText('DEBUG'),
      playbackMonitorSwitch: Selector('#playback-monitor-switch'),
    },
    playButton: advancedForms.find('button').withExactText('Play'),
    stopButton: advancedForms.find('button').withText('Stop'),
    clearButton: advancedForms.find('button').withText('Clear all forms'),
  },
  alert: {
    clearFormsButton: Selector('section').withAttribute('role', 'alertdialog').find('button').withText('Clear forms'),
  },
  player: {
    replay: Selector('.replay'),
    controls: {
      mute: Selector('.replay-mute-toggle'),
      exit: Selector('.replay-exit-button'),
    },
    playbackMonitor: Selector('.replay-playback-monitor'),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    videoElement: <VideoElementSelector>Selector('video').addCustomDOMProperties({
      currentTime: (video) => (video as HTMLVideoElement).currentTime,
      duration: (video) => (video as HTMLVideoElement).duration,
    }),
  },
  info: {
    messageList,
    hasMessageContaining: (text: string) => messageList.withText(text).exists,
  },
  history: {
    entries: historyList,
    latestEntry: historyList.nth(0),
    selectedEntry: {
      streamUrl: selectedHistoryEntry.find('label').withText('Stream URL').nextSibling('input'),
      drmLicenseUrl: selectedHistoryEntry.find('label').withText('DRM license URL').nextSibling('input'),
      subtitlesUrl: selectedHistoryEntry.find('label').withText('Subtitles URL').nextSibling('input'),
      drmLicenseHeaders: selectedHistoryEntry
        .find('label')
        .withText('DRM license headers')
        .nextSibling('div')
        .find('input'),
      drmLicenseTechnology: selectedHistoryEntry.find('label').withText('DRM license technology').nextSibling('input'),
      drmCertificateUrl: selectedHistoryEntry.find('label').withText('DRM certificate URL').nextSibling('input'),
      drmCertificateTechnology: selectedHistoryEntry
        .find('label')
        .withText('DRM certificate technology')
        .nextSibling('input'),
      playerLibrary: selectedHistoryEntry.find('label').withText('Player library').nextSibling('input'),
      showPlaybackMonitor: selectedHistoryEntry
        .find('label')
        .withText('Show playback monitor')
        .nextSibling('label')
        .find('input'),
      playerLogLevel: selectedHistoryEntry.find('label').withText('Player log level').nextSibling('input'),
    },
  },
  sharing: {
    shareUrlField: Selector('*')
      .withAttribute('aria-label', 'Sharing panel')
      .find('*')
      .withAttribute('aria-label', 'Copyable share URL'),
  },
  fixture: (name: string) =>
    fixture(name)
      .page(process.env.TEST_PAGE || '0.0.0.0:5000/')
      .beforeEach(async (t) => await resizeWindow(t)),
};
