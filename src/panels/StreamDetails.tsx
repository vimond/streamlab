import React from 'react';
import {
  Box,
  Button,
  FormLabel,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  FormHelperText,
} from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import {
  AutoTechnology,
  DrmTechnology,
  LabeledTechOption,
  Resource,
  StreamTechnology,
  SubtitlesFormat,
  subtitlesFormatLabels,
  drmTechLabels,
  streamTechLabels,
  getLabel,
} from '../store/model/streamDetails';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { ResourceUpdate, updateStreamDetailsField } from '../store/actions/streamDetails';
import { StreamDetailsState } from '../store/reducers/streamDetails';
import { connect } from 'react-redux';
import HeaderRows from '../components/HeaderRows';

type Props = StreamDetailsState & {
  handleResourceFieldChange: (resource: ResourceUpdate) => void;
};

type RowProps<T = any> = {
  id: string;
  label: string;
  url: string;
  headers: { name: string; value: string; id: number }[];
  technology: AutoTechnology<T>;
  useProxy: boolean;
  onChange: (resource: Partial<Resource<T>>) => void;
  techOptions: LabeledTechOption[];
  isHeadersEnabled?: boolean;
};

const isProxyVisible = false;

const filterDrmTechLabels = (drmTypes: AutoTechnology<DrmTechnology>[]) =>
  drmTechLabels.filter(({ key }) => drmTypes.indexOf(key) >= 0);

const StreamDetailRow: React.FC<RowProps> = ({
  id,
  url,
  label,
  useProxy,
  headers,
  technology,
  techOptions,
  onChange,
  isHeadersEnabled,
}) => (
  <>
    <FormControl gridColumn={isHeadersEnabled ? 1 : '1/span 2'}>
      <Input
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ url: evt.target.value })}
        placeholder={label}
        type="url"
        value={url}
      />
    </FormControl>
    {isHeadersEnabled && (
      <Button onClick={() => onChange({ headers: headers.concat({ name: '', value: '', id: Date.now() }) })}>
        Add header
      </Button>
    )}
    {techOptions.length > 1 ? (
      <Menu>
        {/*
            // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down">
          {getLabel(technology, techOptions)}
        </MenuButton>
        <MenuList>
          {techOptions.map(({ key, label }: LabeledTechOption, i: number) => (
            <MenuItem key={i} onClick={() => onChange({ technology: key })}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    ) : (
      <Button isDisabled={true}>{getLabel(technology, techOptions)}</Button>
    )}
    {isProxyVisible && (
      <FormControl justifySelf="center">
        <Switch
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ useProxy: evt.target.checked })}
          id={`${id}-proxy-activate`}
          isChecked={useProxy}
        >
          Activate proxy for {label}
        </Switch>
      </FormControl>
    )}
    <Box gridColumn="1/span 4">
      <HeaderRows
        onHeadersChange={(headers: { name: string; value: string; id: number }[]) => onChange({ headers })}
        headers={headers}
      />
    </Box>
  </>
);

const StreamDetails: React.FC<Props> = ({
  streamResource,
  drmLicenseResource,
  drmCertificateResource,
  subtitlesResource,
  startOffset,
  handleResourceFieldChange,
  supportedDrmTypes = [DrmTechnology.WIDEVINE],
  isDrmCertificateApplicable,
}) => (
  <form>
    <Box
      display="grid"
      gridTemplateColumns={isProxyVisible ? `1fr auto auto auto` : `1fr auto auto`}
      gridAutoRows="auto"
      gridGap={2}
      alignItems="center"
    >
      <Header level={Level.H6} justifySelf="left" gridColumn="1/span 2">
        URLs
      </Header>
      <Header level={Level.H6}>Technology</Header>
      {isProxyVisible && <Header level={Level.H6}>Proxy</Header>}
      <StreamDetailRow
        id="stream"
        label="Stream URL"
        techOptions={streamTechLabels}
        isHeadersEnabled={false}
        onChange={(streamResource: Partial<Resource<StreamTechnology>>) =>
          handleResourceFieldChange({ streamResource })
        }
        {...streamResource}
      />
      <StreamDetailRow
        label="DRM license URL"
        id="license"
        techOptions={filterDrmTechLabels(supportedDrmTypes)}
        isHeadersEnabled
        onChange={(drmLicenseResource: Partial<Resource<DrmTechnology>>) =>
          handleResourceFieldChange({ drmLicenseResource })
        }
        {...drmLicenseResource}
      />
      {isDrmCertificateApplicable && (
        <StreamDetailRow
          id="certificate"
          label="DRM certificate URL"
          techOptions={filterDrmTechLabels([drmLicenseResource.technology])}
          isHeadersEnabled={false}
          onChange={(drmCertificateResource: Partial<Resource<DrmTechnology>>) =>
            handleResourceFieldChange({ drmCertificateResource })
          }
          {...drmCertificateResource}
        />
      )}
      <StreamDetailRow
        id="subtitles"
        label="Subtitles URL"
        techOptions={subtitlesFormatLabels}
        isHeadersEnabled={false}
        onChange={(subtitlesResource: Partial<Resource<SubtitlesFormat>>) =>
          handleResourceFieldChange({ subtitlesResource })
        }
        {...subtitlesResource}
      />
    </Box>
    <FormControl display="flex" alignItems="center" mt={2}>
      <FormLabel htmlFor="startOffsetField">Start offset:</FormLabel>
      <Input
        id="startOffsetField"
        type="number"
        step={0.001}
        value={startOffset}
        width={24}
        textAlign="right"
        min={0}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleResourceFieldChange({ startOffset: e.target.value === '' ? '' : Number(e.target.value) })
        }
      />
      <FormHelperText mx={2} mb={3}>
        seconds
      </FormHelperText>
    </FormControl>
  </form>
);

const mapStateToProps = (state: AppState) => ({
  ...state.streamDetails,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleResourceFieldChange: (resource: ResourceUpdate) => dispatch(updateStreamDetailsField(resource)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamDetails);
