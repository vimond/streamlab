import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  SET_BROWSER_FEATURES,
  setBrowserFeatures,
  STREAM_RESOURCE_FIELD_CHANGE,
  StreamDetailsFieldChangeAction,
  SUBTITLES_RESOURCE_FIELD_CHANGE
} from '../actions/streamDetails';
import { BaseTech, DrmTechnology, Resource, StreamTechnology, SubtitlesFormat } from '../model/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../actions/history';
import { CLEAR_FORMS, ClearFormsAction } from "../actions/ui";

export interface StreamDetailsState {
  streamResource: Resource<StreamTechnology>;
  drmLicenseResource: Resource<DrmTechnology>;
  drmCertificateResource: Resource<DrmTechnology>;
  subtitlesResource: Resource<SubtitlesFormat>;
}

const initResource = () => ({ url: '', headers: [], useProxy: false, technology: BaseTech.AUTO });

const initState = () => ({
  streamResource: initResource(),
  drmLicenseResource: initResource(),
  drmCertificateResource: initResource(),
  subtitlesResource: initResource()
});

const streamDetails = (
  state: StreamDetailsState = initState(),
  action: StreamDetailsFieldChangeAction | ReturnType<typeof setBrowserFeatures> | HistoryEntryAction | ClearFormsAction
): StreamDetailsState => {
  switch (action.type) {
    case SET_BROWSER_FEATURES:
      return {
        ...state,
        drmLicenseResource: {
          ...state.drmLicenseResource,
          technology: action.value.drmTechnology
        },
        drmCertificateResource: {
          ...state.drmCertificateResource,
          technology: action.value.drmTechnology
        }
      };
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
    case RESTORE_HISTORY_ENTRY:
      const initialState = initState();
      return {
        ...initialState,
        ...action.value.formData.streamDetails,
        streamResource: {
          ...initialState.streamResource,
          ...action.value.formData.streamDetails.streamResource
        }
      };
    case CLEAR_FORMS:
      return {
        streamResource: initResource(),
        drmLicenseResource: {
          ...initResource(),
          technology: state.drmLicenseResource.technology,
        },
        drmCertificateResource: {
          ...initResource(),
          technology: state.drmCertificateResource.technology,
        },
        subtitlesResource: initResource(),
      };
    default:
      return state;
  }
};

export default streamDetails;
