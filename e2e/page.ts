import { Selector } from 'testcafe';

const tabs = Selector('*').withAttribute('role', 'tab');

interface VideoElementSelector extends Selector {
  currentTime: Promise<number>;
}

export const page = {
  top: {
    header: {},
    tabs: {
      info: tabs.withText('Info'),
      history: tabs.withText('History'),
      sharing: tabs.withText('Sharing'),
    },
  },
  basic: {
    streamUrlField: Selector('input[placeholder="Stream URL"]'), // Not deterministic
    streamTechnologyButton: Selector('button').withText('Autodetect stream technology'), // Not deterministic
    progressiveVideoButton: Selector('button').withText('Progressive video'), // Not deterministic
    playButton: Selector('button').withText('Play'), // Not deterministic
  },
  advanced: {},
  player: {
    replay: Selector('.replay'),
    controls: {
      mute: Selector('.replay-mute-toggle'),
      exit: Selector('.replay-exit-button'),
    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    videoElement: <VideoElementSelector>Selector('video').addCustomDOMProperties({
      currentTime: (video) => (video as HTMLVideoElement).currentTime,
    }),
  },
  info: {
    messageList: Selector('*').withAttribute('role', 'tabpanel').nth(0).find('li'),
  },
  history: {
    entries: Selector('*').withAttribute('role', 'tabpanel').nth(1).find('li'),
  },
  sharing: {
    shareUrlField: Selector('*').withAttribute('role', 'tabpanel').nth(2).find('p').nth(-1),
  },
};
