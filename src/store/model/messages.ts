import { MessageLevel, MessageRule } from './messageResolver';
import {
  BaseTech,
  detectStreamTechnology,
  detectStreamType,
  detectSubtitlesFormat,
  drmTechLabels,
  DrmTechnology,
  getLabel,
  Resource,
  StreamTechnology,
  SubtitlesFormat,
  subtitlesFormatLabels,
} from './streamDetails';
import { PLAYER_ERROR } from '../actions/player';
import { APPLY_BROWSER_ENVIRONMENT } from '../actions/streamDetails';

const streamTechnologyToLibMappings = {
  [StreamTechnology.DASH]: { label: 'the Shaka Player library', link: 'https://github.com/google/shaka-player' },
  [StreamTechnology.HLS]: {
    label: 'the HLS.js library',
    link: 'https://github.com/video-dev/hls.js',
    safari: { label: "Safari's native HLS support through HTML video element" },
  },
  [StreamTechnology.MSS]: { label: 'the RxPlayer library', link: 'https://github.com/canalplus/rx-player' },
  [StreamTechnology.PROGRESSIVE]: { label: "the browser's HTML video element directly" },
};

const getStreamTechnology = ({ url, technology }: Resource<StreamTechnology>) =>
  technology === BaseTech.AUTO ? detectStreamTechnology(url) : technology;

export const messages: MessageRule[] = [
  {
    id: 'welcome-1',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.url === '' && nextState.history.history.length === 0,
    message: {
      level: MessageLevel.INFO,
      text: 'Welcome to Streamlab, created by Vimond developers.',
      link: 'https://github.com/vimond/streamlab',
    },
  },
  {
    id: 'share',
    displayCondition: ({ action }) => action.type === APPLY_BROWSER_ENVIRONMENT && !!action.value.urlSetup,
    message: {
      level: MessageLevel.SUCCESS,
      text:
        'The shared stream setup found in the URL is now applied to the form to the left. Press Play to try it out.',
    },
  },
  {
    id: 'start-basic',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.url === '' && !nextState.ui.advancedMode,
    message: {
      level: MessageLevel.INFO,
      text: 'Fill in an URL to the stream you want to test, and press Play. Flip the Advanced switch for more options.',
    },
  },
  {
    id: 'start-advanced',
    displayCondition: ({ nextState }) => nextState.streamDetails.streamResource.url === '' && nextState.ui.advancedMode,
    message: {
      level: MessageLevel.INFO,
      text:
        'Fill in an URL to the stream you want to test. Supplement with DRM information if required, ' +
        'or subtitles file URLs if desired. License requests can have headers added for e.g. authorization.',
    },
  },
  {
    id: 'pane-resize',
    displayCondition: ({ nextState }) =>
      nextState.history.history.length > 0 && nextState.history.history.length < 3 && !nextState.ui.rightPaneWidth,
    message: {
      level: MessageLevel.INFO,
      text:
        'This pane can be resized by dragging the gutter to the left. Also note the expand/collapse button next to the Advanced toggle.',
    },
  },
  {
    id: 'basic-play',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.technology !== BaseTech.AUTO &&
      nextState.streamDetails.streamResource.url !== '' &&
      !nextState.player.source,
    message: {
      level: MessageLevel.INFO,
      text: 'Press Play to load the specified stream URL in the player.',
    },
  },
  {
    id: 'stream-autodetect',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.technology === BaseTech.AUTO &&
      nextState.streamDetails.streamResource.url !== '',
    message: (nextState, action) => {
      const streamType = detectStreamType(nextState.streamDetails.streamResource.url);
      const opened = action.type === PLAYER_ERROR || nextState.player.source;
      if (streamType) {
        return {
          level: MessageLevel.SUCCESS,
          text: `Auto detected stream type is ${streamType.label}. ${
            opened ? '' : 'Press Play to load it into the player.'
          }`,
        };
      } else {
        return {
          level: MessageLevel.ERROR,
          text: `Unable to detect stream type based on URL content. Please select the technology from the dropdown.`,
        };
      }
    },
  },
  {
    id: 'player-lib-support',
    displayCondition: ({ nextState }) =>
      (!('error' in nextState.player) || !nextState.player.error) &&
      nextState.streamDetails.streamResource.url !== '' &&
      !!getStreamTechnology(nextState.streamDetails.streamResource),
    message: (nextState, action) => {
      const { technology } = nextState.streamDetails.streamResource;
      const isSafari =
        nextState.streamDetails.supportedDrmTechnologies &&
        nextState.streamDetails.supportedDrmTechnologies[0] === DrmTechnology.FAIRPLAY; // Not exactly to the point...
      const tech =
        technology === BaseTech.AUTO ? detectStreamTechnology(nextState.streamDetails.streamResource.url) : technology;
      if (tech) {
        const safariHls = isSafari && tech === StreamTechnology.HLS;
        const lib = safariHls
          ? streamTechnologyToLibMappings[StreamTechnology.HLS].safari
          : streamTechnologyToLibMappings[tech];
        return {
          level: MessageLevel.INFO,
          text: `The player will use ${lib.label} for playing this stream.`,
          ...lib,
        };
      } else {
        return {
          level: MessageLevel.ERROR,
          text: 'Undecided stream technology. Unable to select a playback technology.',
        };
      }
    },
  },
  {
    id: 'limited-smooth-support',
    displayCondition: ({ nextState }) =>
      (!('error' in nextState.player) || !nextState.player.error) &&
      nextState.streamDetails.streamResource.url !== '' &&
      getStreamTechnology(nextState.streamDetails.streamResource) === StreamTechnology.MSS,
    message: {
      level: MessageLevel.WARNING,
      text:
        'Note that the integration with this library is not complete, and lacks support for subtitles and controls for bitrate + multiple audio tracks.',
    },
  },
  {
    id: 'subtitles-autodetect',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.subtitlesResource.technology === BaseTech.AUTO &&
      nextState.streamDetails.subtitlesResource.url !== '',
    message: (nextState, action) => {
      const subtitlesType = detectSubtitlesFormat(nextState.streamDetails.subtitlesResource.url);
      if (subtitlesType) {
        return {
          level: MessageLevel.INFO,
          text: `Auto detected subtitles type is ${getLabel(subtitlesType, subtitlesFormatLabels)}.`,
        };
      } else {
        return {
          level: MessageLevel.WARNING,
          text: `Unable to detect subtitles type based on URL content. Please select the technology from the dropdown.`,
        };
      }
    },
  },
  {
    id: 'subtitles-incompatible',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.subtitlesResource.url !== '' &&
      (nextState.streamDetails.subtitlesResource.technology === SubtitlesFormat.TTML ||
        (nextState.streamDetails.subtitlesResource.technology === BaseTech.AUTO &&
          detectSubtitlesFormat(nextState.streamDetails.subtitlesResource.url) === SubtitlesFormat.TTML)) &&
      getStreamTechnology(nextState.streamDetails.streamResource) !== StreamTechnology.DASH,
    message: {
      level: MessageLevel.WARNING,
      text: 'The subtitles format, TTML, is only supported for DASH streams through Shaka Player.',
    },
  },
  {
    id: 'player-error',
    displayCondition: ({ nextState }) => 'error' in nextState.player,
    message: (nextState, action) => ({
      level: MessageLevel.ERROR,
      text: `Player error: ${
        'error' in nextState.player && nextState.player.error && nextState.player.error.message
      }. The full error object is logged to the browser console.`,
    }),
  },
  {
    id: 'monitor',
    displayCondition: ({ nextState }) => !!nextState.player.source && !nextState.playerOptions.showPlaybackMonitor,
    message: {
      level: MessageLevel.INFO,
      text: 'Press Ctrl+Alt+M to reveal a panel with all properties of the playback state.',
    },
  },
  {
    id: 'share-incompatible-drm',
    displayCondition: ({ nextState, action }) =>
      !!(
        action.type === APPLY_BROWSER_ENVIRONMENT &&
        action.value.urlSetup &&
        'drmLicenseResource' in action.value.urlSetup.streamDetails &&
        action.value.urlSetup.streamDetails.drmLicenseResource.url !== '' &&
        action.value.urlSetup.streamDetails.drmLicenseResource.technology &&
        nextState.streamDetails.supportedDrmTechnologies.indexOf(
          action.value.urlSetup.streamDetails.drmLicenseResource.technology
        ) < 0
      ),
    message: {
      level: MessageLevel.ERROR,
      text:
        'The shared link specified an unsupported DRM technology, and can perhaps not be used for playback in this browser. Consider testing it in a diff' +
        'erent browser.',
    },
  },
  {
    id: 'drm-auto-detect',
    displayCondition: ({ nextState }) => nextState.ui.advancedMode,
    message: (nextState, action) => ({
      level: MessageLevel.INFO,
      text: `This browser supports ${(nextState.streamDetails.supportedDrmTechnologies || [])
        .map((t) => getLabel(t, drmTechLabels))
        .join(' and ')} for DRM playback.`,
    }),
  },
  {
    id: 'drm-fairplay-certificate',
    displayCondition: ({ nextState }) =>
      nextState.ui.advancedMode &&
      !!nextState.streamDetails.drmLicenseResource.url &&
      !nextState.streamDetails.drmCertificateResource.url &&
      nextState.streamDetails.drmLicenseResource.technology === DrmTechnology.FAIRPLAY,
    message: {
      level: MessageLevel.WARNING,
      text:
        'When playing a stream with FairPlay DRM encryption, a certificate URL for the content provider needs to be specified.',
    },
  },
  {
    id: 'drm-widevine-certificate',
    displayCondition: ({ nextState }) =>
      nextState.ui.advancedMode &&
      !!nextState.streamDetails.drmLicenseResource.url &&
      !nextState.streamDetails.drmCertificateResource.url &&
      nextState.streamDetails.drmLicenseResource.technology === DrmTechnology.WIDEVINE,
    message: {
      level: MessageLevel.INFO,
      text:
        "When no DRM certificate URL is specified, the Widevine service's certificate will be fetched from the same URL as the DRM license. This will appear " +
        'in DevTools as two similar requests to the license URL, however the payloads are different.',
    },
  },
  {
    id: 'player-options-invalid-json',
    displayCondition: ({ nextState }) => {
      if (
        nextState.ui.advancedMode &&
        nextState.playerOptions.customConfiguration &&
        nextState.playerOptions.customConfiguration.trim()
      ) {
        try {
          JSON.parse(nextState.playerOptions.customConfiguration);
          return false;
        } catch (e) {
          return true;
        }
      } else {
        return false;
      }
    },
    message: {
      level: MessageLevel.WARNING,
      text: 'The player configuration overrides are not specified as valid JSON, and will be ignored.',
    },
  },
];
