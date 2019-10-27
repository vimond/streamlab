import { DrmTechnology, Resource, StreamTechnology, SubtitlesFormat } from '../model/streamDetails';

export const STREAM_RESOURCE_FIELD_CHANGE = 'STREAM_RESOURCE_FIELD_CHANGE';
export const DRM_LICENSE_RESOURCE_FIELD_CHANGE = 'DRM_LICENSE_RESOURCE_FIELD_CHANGE';
export const DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE = 'DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE';
export const SUBTITLES_RESOURCE_FIELD_CHANGE = 'SUBTITLES_RESOURCE_FIELD_CHANGE';

type ResourceUpdate =
  | {
      streamResource: Partial<Resource<StreamTechnology>>;
    }
  | {
      drmLicenseResource: Partial<Resource<DrmTechnology>>;
    }
  | {
      drmCertificateResource: Partial<Resource<DrmTechnology>>;
    }
  | {
      subtitlesResource: Partial<Resource<SubtitlesFormat>>;
    };

export type StreamDetailsFieldChangeAction =
  | {
      type: typeof STREAM_RESOURCE_FIELD_CHANGE;
      value: Partial<Resource<StreamTechnology>>;
    }
  | {
      type: typeof DRM_LICENSE_RESOURCE_FIELD_CHANGE;
      value: Partial<Resource<DrmTechnology>>;
    }
  | {
      type: typeof DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE;
      value: Partial<Resource<DrmTechnology>>;
    }
  | {
      type: typeof SUBTITLES_RESOURCE_FIELD_CHANGE;
      value: Partial<Resource<SubtitlesFormat>>;
    };

export const updateStreamDetailsField = (resourceUpdate: ResourceUpdate): StreamDetailsFieldChangeAction =>
  'streamResource' in resourceUpdate
    ? {
        type: STREAM_RESOURCE_FIELD_CHANGE,
        value: resourceUpdate.streamResource
      }
    : 'drmLicenseResource' in resourceUpdate
    ? {
        type: DRM_LICENSE_RESOURCE_FIELD_CHANGE,
        value: resourceUpdate.drmLicenseResource
      }
    : 'drmCertificateResource' in resourceUpdate
    ? {
        type: DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
        value: resourceUpdate.drmCertificateResource
      }
    : {
        type: SUBTITLES_RESOURCE_FIELD_CHANGE,
        value: resourceUpdate.subtitlesResource
      };
