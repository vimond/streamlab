import { MessageLevel, MessageRule } from './messageResolver';
import {
  BaseTech,
  detectStreamType,
  detectSubtitlesType,
  drmTechLabels,
  DrmTechnology,
  getLabel,
  StreamTechnology,
  SubtitlesFormat,
  subtitlesFormatLabels,
} from './streamDetails';
import { PLAYER_ERROR } from '../actions/player';
import { APPLY_BROWSER_ENVIRONMENT } from '../actions/streamDetails';

export const messages: MessageRule[] = [
  {
    id: 'welcome-1',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.url === '' && nextState.history.history.length === 0,
    message: {
      level: MessageLevel.INFO,
      text: 'Welcome to Streamlab, created by Vimond developers.',
    },
  },
  {
    id: 'share',
    displayCondition: ({ action }) => action.type === APPLY_BROWSER_ENVIRONMENT && !!action.value.urlSetup,
    message: {
      level: MessageLevel.SUCCESS,
      text:
        'The shared stream setup found in the URL is now applied to the form to the left. Press play to try it out.',
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
        'or subtitle file URLs if desired. Requests can have headers added for e.g. authorization.',
    },
  },
  {
    id: 'pane-resize',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.url === '' && !nextState.ui.rightPaneWidth,
    message: {
      level: MessageLevel.INFO,
      text: 'This pane can be resized by dragging the gutter to the left.',
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
          level: MessageLevel.INFO,
          text: `Auto detected stream type is ${streamType.label}. ${
            opened ? '' : 'Press Play to load it into the player.'
          }`,
        };
      } else {
        return {
          level: MessageLevel.WARNING,
          text: `Unable to detect stream type based on URL content. Please select the technology from the dropdown.`,
        };
      }
    },
  },
  {
    id: 'subtitles-autodetect',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.subtitlesResource.technology === BaseTech.AUTO &&
      nextState.streamDetails.subtitlesResource.url !== '',
    message: (nextState, action) => {
      const subtitlesType = detectSubtitlesType(nextState.streamDetails.subtitlesResource.url);
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
          detectSubtitlesType(nextState.streamDetails.subtitlesResource.url) === SubtitlesFormat.TTML)) &&
      !(
        (nextState.streamDetails.streamResource.technology === BaseTech.AUTO &&
          detectStreamType(nextState.streamDetails.streamResource.url).name === 'dash') ||
        nextState.streamDetails.streamResource.technology === StreamTechnology.DASH
      ),
    message: {
      level: MessageLevel.WARNING,
      text: 'The subtitles format, TTML, is only supported for DASH streams through Shaka Player.',
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
        action.value.urlSetup.streamDetails.drmLicenseResource.technology &&
        nextState.streamDetails.supportedDrmTypes.indexOf(
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
      text: `This browser supports ${(nextState.streamDetails.supportedDrmTypes || [])
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
        "When no DRM certificate URL is specified, the Widevine service's certificate will be fetched from the same URL as the DRM license.",
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
