import { MessageLevel, MessageRule } from './messageResolver';
import { BaseTech, detectStreamType, detectSubtitlesType, DrmTechnology } from './streamDetails';
import { PLAYER_ERROR } from '../actions/player';
import { drmTechOptions, subtitlesFormatOptions, getLabel } from '../../panels/StreamDetails';

export const messages: MessageRule[] = [
  {
    id: 'welcome',
    displayCondition: ({ nextState }) => nextState.streamDetails.streamResource.url === '',
    message: {
      level: MessageLevel.INFO,
      text: 'Welcome to Streamlab'
    }
  },
  {
    id: 'start-basic',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.url === '' && !nextState.ui.advancedMode,
    message: {
      level: MessageLevel.INFO,
      text: 'Fill in an URL to the stream you want to test, and press Play. Flip the Advanced switch for more options.'
    }
  },
  {
    id: 'start-advanced',
    displayCondition: ({ nextState }) => nextState.streamDetails.streamResource.url === '' && nextState.ui.advancedMode,
    message: {
      level: MessageLevel.INFO,
      text:
        'Fill in an URL to the stream you want to test. Supplement with DRM information if required, or subtitle files if desired. Requests can have headers added for e.g. authorization.'
    }
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
          }`
        };
      } else {
        return {
          level: MessageLevel.WARNING,
          text: `Unable to detect stream type based on URL content. Please select the technology from the dropdown.`
        };
      }
    }
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
          text: `Auto detected subtitles type is ${getLabel(subtitlesType, subtitlesFormatOptions)}.`
        };
      } else {
        return {
          level: MessageLevel.WARNING,
          text: `Unable to detect subtitles type based on URL content. Please select the technology from the dropdown.`
        };
      }
    }
  },
  {
    id: 'basic-play',
    displayCondition: ({ nextState }) =>
      nextState.streamDetails.streamResource.technology !== BaseTech.AUTO &&
      nextState.streamDetails.streamResource.url !== '',
    message: {
      level: MessageLevel.INFO,
      text: 'Press Play to load the specified stream URL in the player.'
    }
  },
  {
    id: 'player-error',
    displayCondition: ({ action }) => action.type === PLAYER_ERROR,
    message: (nextState, action) => ({
      level: MessageLevel.ERROR,
      text: `Player error: ${action.type === PLAYER_ERROR &&
        action.error.message}. The full error object is logged to the browser console.`
    })
  },
  {
    id: 'drm-auto-detect',
    displayCondition: ({ nextState }) => nextState.ui.advancedMode,
    message: (nextState, action) => ({
      level: MessageLevel.INFO,
      text: `This browser implements ${getLabel(
        nextState.streamDetails.drmLicenseResource.technology,
        drmTechOptions
      )} for DRM playback.`
    })
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
        'When playing a stream with FairPlay DRM encryption, a certificate URL for the content provider needs to be specified.'
    }
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
        "When no DRM certificate URL is specified, the Widevine service's certificate will be fetched from the same URL as the DRM license."
    }
  }
];
