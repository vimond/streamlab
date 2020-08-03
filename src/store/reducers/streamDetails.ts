import {
  DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE,
  DRM_LICENSE_RESOURCE_FIELD_CHANGE,
  APPLY_BROWSER_ENVIRONMENT,
  applyBrowserEnvironment,
  START_OFFSET_FIELD_CHANGE,
  STREAM_RESOURCE_FIELD_CHANGE,
  StreamDetailsFieldChangeAction,
  SUBTITLES_RESOURCE_FIELD_CHANGE,
} from '../actions/streamDetails';
import { BaseTech, DrmTechnology, Resource, StreamTechnology, SubtitlesFormat } from '../model/streamDetails';
import { HistoryEntryAction, RESTORE_HISTORY_ENTRY } from '../actions/history';
import { CLEAR_FORMS, ClearFormsAction } from '../actions/ui';

export interface StreamDetailsState {
  streamResource: Resource<StreamTechnology>;
  drmLicenseResource: Resource<DrmTechnology>;
  drmCertificateResource: Resource<DrmTechnology>;
  subtitlesResource: Resource<SubtitlesFormat>;
  startOffset: number | '';
  isDrmCertificateApplicable: boolean;
  supportedDrmTypes: DrmTechnology[];
}

const initResource = () => ({ url: '', headers: [], useProxy: false, technology: BaseTech.AUTO });

const initState = (): StreamDetailsState => ({
  streamResource: initResource(),
  drmLicenseResource: initResource(),
  drmCertificateResource: initResource(),
  subtitlesResource: initResource(),
  supportedDrmTypes: [],
  isDrmCertificateApplicable: true,
  startOffset: '',
});

const drmSupportsCertificate = (drmType: DrmTechnology | BaseTech | undefined) => drmType !== DrmTechnology.PLAYREADY;

const streamDetails = (
  state: StreamDetailsState = initState(),
  action:
    | StreamDetailsFieldChangeAction
    | ReturnType<typeof applyBrowserEnvironment>
    | HistoryEntryAction
    | ClearFormsAction
): StreamDetailsState => {
  switch (action.type) {
    case APPLY_BROWSER_ENVIRONMENT:
      const { supportedDrmTypes, urlSetup } = action.value;
      const technology = supportedDrmTypes[0];
      const isDrmCertificateApplicable = drmSupportsCertificate(technology);
      if (urlSetup) {
        const initialState = initState();
        return {
          ...initialState,
          isDrmCertificateApplicable,
          ...urlSetup.streamDetails,
          streamResource: {
            ...initialState.streamResource,
            ...urlSetup.streamDetails.streamResource,
          },
          supportedDrmTypes,
        };
      } else {
        return {
          ...state,
          supportedDrmTypes,
          isDrmCertificateApplicable,
          drmLicenseResource: {
            ...state.drmLicenseResource,
            technology,
          },
          drmCertificateResource: {
            ...state.drmCertificateResource,
            technology,
          },
        };
      }
    case STREAM_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        streamResource: {
          ...state.streamResource,
          ...action.value,
        },
      };
    case DRM_LICENSE_RESOURCE_FIELD_CHANGE:
      // TODO: Refactor into something nicer.
      const newStateFromLicenseField = {
        ...state,
        isDrmCertificateApplicable: drmSupportsCertificate(action.value.technology),
        drmLicenseResource: {
          ...state.drmLicenseResource,
          ...action.value,
        },
      };
      if ('technology' in action.value && action.value.technology) {
        return {
          ...newStateFromLicenseField,
          drmCertificateResource: {
            ...state.drmCertificateResource,
            technology: action.value.technology,
          },
        };
      } else {
        return newStateFromLicenseField;
      }
    case DRM_CERTIFICATE_RESOURCE_FIELD_CHANGE:
      const newStateFromCertificateField = {
        ...state,
        isDrmCertificateApplicable: drmSupportsCertificate(action.value.technology),
        drmCertificateResource: {
          ...state.drmCertificateResource,
          ...action.value,
        },
      };
      if ('technology' in action.value && action.value.technology != null) {
        return {
          ...newStateFromCertificateField,
          drmLicenseResource: {
            ...state.drmLicenseResource,
            technology: action.value.technology,
          },
        };
      } else {
        return newStateFromCertificateField;
      }
    case SUBTITLES_RESOURCE_FIELD_CHANGE:
      return {
        ...state,
        subtitlesResource: {
          ...state.subtitlesResource,
          ...action.value,
        },
      };
    case START_OFFSET_FIELD_CHANGE:
      return {
        ...state,
        startOffset: action.value,
      };
    case RESTORE_HISTORY_ENTRY: {
      const initialState = initState();
      const { supportedDrmTypes } = state;
      return {
        ...initialState,
        ...action.value.formData.streamDetails,
        streamResource: {
          ...initialState.streamResource,
          ...action.value.formData.streamDetails.streamResource,
        },
        supportedDrmTypes,
      };
    }
    case CLEAR_FORMS:
      return {
        isDrmCertificateApplicable: state.isDrmCertificateApplicable,
        supportedDrmTypes: state.supportedDrmTypes,
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
        startOffset: '',
      };
    default:
      return state;
  }
};

export default streamDetails;
