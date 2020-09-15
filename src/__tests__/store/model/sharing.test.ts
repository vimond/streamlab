import {
  buildUrlFromState,
  parseSetupFromQueryString,
  removeSetupFromUrl,
  twoLevelCopy,
} from '../../../store/model/sharing';
import { SimplePersistableFormData } from '../../../store/model/history';
import { BaseTech, PlayerLogLevel } from '../../../store/model/streamDetails';

const genericLocation = { origin: '', pathname: '', search: '' };

describe('Sharing URLs', () => {
  describe('twoLevelCopy', () => {
    it('produces an object with top level properties not being identical to the original object', () => {
      const l = new Date();
      const a = {
        b: {
          c: '!',
          d: {
            e: 1,
            f: 2,
          },
        },
        g: {
          h: false,
          i: {
            j: '#',
            k: true,
            l,
          },
        },
      };
      const m = twoLevelCopy(a);
      expect(m).not.toBe(a);
      expect(m.b).not.toBe(a.b);
      expect(m.g).not.toBe(a.g);
      expect(m.b.c).toBe(a.b.c);
      expect(m.b.d).toBe(a.b.d);
      expect(m.g.h).toBe(a.g.h);
      expect(m.g.i).toBe(a.g.i);
    });
  });
  describe('buildUrlFromState', () => {
    it('includes current URL, and adds the specified state data to be included.', () => {
      const location = {
        origin: 'https://vimond.github.io',
        pathname: '/streamlab',
        search: '',
      };
      const simpleState: SimplePersistableFormData = {
        streamDetails: {
          streamResource: {
            url: 'https://example.com/stream.m3u8',
            technology: BaseTech.AUTO,
          },
        },
      };

      const resourceData = {
        url: 'abc',
        useProxy: false,
        headers: [{ id: '20202', name: 'Authorization', value: 'abc123' }],
        technology: BaseTech.AUTO,
      };
      const advancedState = {
        streamDetails: {
          streamResource: resourceData,
          drmLicenseResource: resourceData,
          drmCertificateResource: resourceData,
          subtitlesResource: resourceData,
        },
        playerOptions: {
          logLevel: PlayerLogLevel.WARNING,
          customConfiguration: '',
          showPlaybackMonitor: true,
        },
      };

      const simpleResult = buildUrlFromState(simpleState, location);
      expect(simpleResult).toBe(
        'https://vimond.github.io/streamlab?s={%22streamDetails%22:' +
          '{%22streamResource%22:{%22url%22:%22https:%2F%2Fexample.com%2Fstream.m3u8%22' +
          ',%22technology%22:0}}}'
      );

      const advancedResult = buildUrlFromState(advancedState, location);
      expect(advancedResult).toBe(
        'https://vimond.github.io/streamlab?s={%22streamDetails%22:{%22streamResource%22:' +
          '{%22url%22:%22abc%22,%22useProxy%22:false,%22headers%22:[{%22id%22:%2220202%22,%2' +
          '2name%22:%22Authorization%22,%22value%22:%22abc123%22}],%22technology%22:0},%22dr' +
          'mLicenseResource%22:{%22url%22:%22abc%22,%22useProxy%22:false,%22headers%22:[{%22' +
          'id%22:%2220202%22,%22name%22:%22Authorization%22,%22value%22:%22abc123%22}],%22te' +
          'chnology%22:0},%22drmCertificateResource%22:{%22url%22:%22abc%22,%22useProxy%22:f' +
          'alse,%22headers%22:[{%22id%22:%2220202%22,%22name%22:%22Authorization%22,%22value' +
          '%22:%22abc123%22}],%22technology%22:0},%22subtitlesResource%22:{%22url%22:%22abc%' +
          '22,%22useProxy%22:false,%22headers%22:[{%22id%22:%2220202%22,%22name%22:%22Author' +
          'ization%22,%22value%22:%22abc123%22}],%22technology%22:0}},%22playerOptions%22:{%' +
          '22logLevel%22:2,%22customConfiguration%22:%22%22,%22showPlaybackMonitor%22:true}}'
      );
    });
    it('replaces earlier setup parameter from current URL, and keeps other parameters.', () => {
      const location = {
        origin: 'https://vimond.github.io',
        pathname: '/streamlab',
        search: '?f=abc%22def&s={%22hello%22:%22world%22}',
      };
      const state: SimplePersistableFormData = {
        streamDetails: {
          streamResource: {
            url: 'https://example.com/stream.m3u8',
            technology: BaseTech.AUTO,
          },
        },
      };
      const result = buildUrlFromState(state, location);
      expect(result).toBe(
        'https://vimond.github.io/streamlab?s={%22streamDetails%22:' +
          '{%22streamResource%22:{%22url%22:%22https:%2F%2Fexample.com%2Fstream.m3u8%22' +
          ',%22technology%22:0}}}&f=abc%22def'
      );
    });
  });
  test('parseSetupFromQueryString returns the setup object from the query string ready to be merged to the state', () => {
    const queryString =
      '?s={%22streamDetails%22:' +
      '{%22streamResource%22:{%22url%22:%22https:%2F%2Fexample.com%2Fstream.m3u8%22' +
      ',%22technology%22:0}}}&f=abc%22def';
    expect(parseSetupFromQueryString(queryString)).toEqual({
      streamDetails: {
        streamResource: {
          url: 'https://example.com/stream.m3u8',
          technology: BaseTech.AUTO,
        },
      },
    });
  });
  test(
    'removeSetupFromUrl removes the setup parameter from the current location and returns a new relative URL that ' +
      'can be pushed to the history.',
    () => {
      const location1 = {
        ...genericLocation,
        pathname: '/streamlab',
        search: '?abc=123&s={%22general%22:{%22testing%22:true,%22attempt%22:1}}',
      };
      const location2 = {
        ...genericLocation,
        pathname: '/streamlab',
        search: '?s={%22general%22:{%22testing%22:true,%22attempt%22:1}}',
      };
      const location3 = {
        ...genericLocation,
        pathname: '/streamlab',
        search: '?s={%22general%22:{%22testing%22:true,%22attempt%22:1}}&def={{%22hello%22:%22world%22}}',
      };
      const location4 = {
        ...genericLocation,
        pathname: '/streamlab',
        search: '?s={%22general%22:{%22testing%22:true,%22attempt%22:1}}&ghi=456',
      };
      expect(removeSetupFromUrl(location1)).toBe('/streamlab?abc=123');
      expect(removeSetupFromUrl(location2)).toBe('/streamlab');
      expect(removeSetupFromUrl(location3)).toBe('/streamlab?def={{%22hello%22:%22world%22}}');
      expect(removeSetupFromUrl(location4)).toBe('/streamlab?ghi=456');
    }
  );
});
