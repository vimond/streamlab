import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  STREAM_RESOURCE_FIELD_CHANGE,
  StreamDetailsFieldChangeAction,
  SUBTITLES_RESOURCE_FIELD_CHANGE
} from '../actions/streamDetails';
import { BaseTech, DrmTechnology, Resource, StreamTechnology, SubtitlesFormat } from '../model/streamDetails';

export interface StreamDetailsState {
  streamResource: Resource<StreamTechnology>;
  drmLicenseResource: Resource<DrmTechnology>;
  drmCertificateResource: Resource<DrmTechnology>;
  subtitlesResource: Resource<SubtitlesFormat>;
}

const initResource = () => ({ url: '', headers: {}, useProxy: false, technology: BaseTech.AUTO });

const initState = () => ({
  streamResource: initResource(),
  drmLicenseResource: initResource(),
  drmCertificateResource: initResource(),
  subtitlesResource: initResource()
});

const streamDetails = (
  state: StreamDetailsState = initState(),
  action: StreamDetailsFieldChangeAction
): StreamDetailsState => {
  switch (action.type) {
    case STREAM_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        streamResource: {
          ...state.streamResource,
          ...action.value
        }
      };
    case DRM_LICENSE_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        drmLicenseResource: {
          ...state.drmLicenseResource,
          ...action.value
        }
      };
    case DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        drmCertificateResource: {
          ...state.drmCertificateResource,
          ...action.value
        }
      };
    case SUBTITLES_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        subtitlesResource: {
          ...state.subtitlesResource,
          ...action.value
        }
      };
    default:
      return state;
  }
};

export default streamDetails;
