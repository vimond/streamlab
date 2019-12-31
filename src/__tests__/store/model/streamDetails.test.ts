import { createPlayerOptions, detectDrmType, DrmTechnology, PlayerLogLevel } from '../../../store/model/streamDetails';

describe('Stream details model', () => {
  test('DRM technology detection from user agent', () => {
    expect(
      detectDrmType(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/' +
          '605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15'
      )
    ).toBe(DrmTechnology.FAIRPLAY);
    expect(
      detectDrmType(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/' +
          '537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
      )
    ).toBe(DrmTechnology.WIDEVINE);
    expect(
      detectDrmType(
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, lik' +
          'e Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136'
      )
    ).toBe(DrmTechnology.PLAYREADY);
    expect(detectDrmType('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0')).toBe(
      DrmTechnology.WIDEVINE
    );
  });
  test('Building player override structure from empty JSON string and distinct settings', () => {
    const result = createPlayerOptions({
      logLevel: PlayerLogLevel.INFO,
      showPlaybackMonitor: false,
      customConfiguration: ''
    });
    expect(result).toEqual({
      videoStreamer: {
        logLevel: 'INFO'
      },
      playbackMonitor: {
        visibleAtStart: false
      }
    });
  });
  test('Building player override structure from JSON string and distinct settings', () => {
    const json = '{"aspectRatio": {"horizontal": 21, "vertical": 9 }}';
    const result = createPlayerOptions({
      logLevel: PlayerLogLevel.ERROR,
      showPlaybackMonitor: true,
      customConfiguration: json
    });
    expect(result).toEqual({
      videoStreamer: {
        logLevel: 'ERROR'
      },
      playbackMonitor: {
        visibleAtStart: true
      },
      aspectRatio: {
        horizontal: 21,
        vertical: 9
      }
    });
  });
  test('Invalid JSON string is ignored when building player override structure', () => {
    const json = '{aspectRatio: {horizontal: 21, vertical: 9 }}';
    const result = createPlayerOptions({
      logLevel: PlayerLogLevel.ERROR,
      showPlaybackMonitor: true,
      customConfiguration: json
    });
    expect(result).toEqual({
      videoStreamer: {
        logLevel: 'ERROR'
      },
      playbackMonitor: {
        visibleAtStart: true
      }
    });
  });
  test('Building player override structure from JSON string overlapped by distinct settings', () => {
    const json =
      '{"videoStreamer":{"logLevel":"INFO"},"playbackMonitor":{"visibleAtStart":true},"classNamePrefix":"my-player-"}';
    const result = createPlayerOptions({
      logLevel: PlayerLogLevel.DEBUG,
      showPlaybackMonitor: false,
      customConfiguration: json
    });
    expect(result).toEqual({
      videoStreamer: {
        logLevel: 'DEBUG'
      },
      playbackMonitor: {
        visibleAtStart: false
      },
      classNamePrefix: 'my-player-'
    });
  });
});
