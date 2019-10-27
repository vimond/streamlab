import { MessageLevel, MessageRule } from './model/messages';
import { BaseTech, detectStreamType } from './model/streamDetails';
import { PLAYER_ERROR } from './actions/player';

export const messageRules: MessageRule[] = [
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
    id: 'basic-autodetect',
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
  }
];
