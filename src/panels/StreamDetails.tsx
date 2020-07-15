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
  FormHelperText
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
  getLabel
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
  isTechOptionsEnabled?: boolean;
  isHeadersEnabled?: boolean;
};

const isProxyVisible = false;

const StreamDetailRow: React.FC<RowProps> = ({
  id,
  url,
  label,
  useProxy,
  headers,
  technology,
  techOptions,
  isTechOptionsEnabled,
  onChange,
  isHeadersEnabled
}) => {
  return (
    <>
      <FormControl>
        <Input
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ url: evt.target.value })}
          placeholder={label}
          type="url"
          value={url}
        />
      </FormControl>
      <Menu>
        {/*
            // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down" isDisabled={!isTechOptionsEnabled}>
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
      <FormControl justifySelf="center" style={{ visibility: isProxyVisible ? 'visible' : 'hidden' }}>
        <Switch
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ useProxy: evt.target.checked })}
          id={`${id}-proxy-activate`}
          isChecked={useProxy}
        >
          Activate proxy for {label}
        </Switch>
      </FormControl>
      <Button
        onClick={() => onChange({ headers: headers.concat({ name: '', value: '', id: Date.now() }) })}
        isDisabled={!isHeadersEnabled}
      >
        Add
      </Button>
      <Box gridColumn="1/span 4">
        <HeaderRows
          onHeadersChange={(headers: { name: string; value: string; id: number }[]) => onChange({ headers })}
          headers={headers}
        />
      </Box>
    </>
  );
};

const StreamDetails: React.FC<Props> = ({
  streamResource,
  drmLicenseResource,
  drmCertificateResource,
  subtitlesResource,
  startOffset,
  handleResourceFieldChange
}) => (
  <form>
    <Box
      display="grid"
      gridTemplateColumns={`1fr auto ${isProxyVisible ? 'auto' : '0'} auto`}
      gridAutoRows="auto"
      gridGap={2}
      alignItems="center"
    >
      <Header level={Level.H6} justifySelf="left">
        URLs
      </Header>
      <Header level={Level.H6}>Technology</Header>
      <Header level={Level.H6} style={{ visibility: isProxyVisible ? 'visible' : 'hidden' }}>
        Proxy
      </Header>
      <Header level={Level.H6}>Headers</Header>
      <StreamDetailRow
        id="stream"
        label="Stream URL"
        techOptions={streamTechLabels}
        isTechOptionsEnabled
        isHeadersEnabled={false}
        onChange={(streamResource: Partial<Resource<StreamTechnology>>) =>
          handleResourceFieldChange({ streamResource })
        }
        {...streamResource}
      />
      <StreamDetailRow
        label="DRM license URL"
        id="license"
        techOptions={drmTechLabels}
        isTechOptionsEnabled={false}
        isHeadersEnabled
        onChange={(drmLicenseResource: Partial<Resource<DrmTechnology>>) =>
          handleResourceFieldChange({ drmLicenseResource })
        }
        {...drmLicenseResource}
      />
      <StreamDetailRow
        id="certificate"
        label="DRM certificate URL"
        techOptions={drmTechLabels}
        isTechOptionsEnabled={false}
        isHeadersEnabled={false}
        onChange={(drmCertificateResource: Partial<Resource<DrmTechnology>>) =>
          handleResourceFieldChange({ drmCertificateResource })
        }
        {...drmCertificateResource}
      />
      <StreamDetailRow
        id="subtitles"
        label="Subtitles URL"
        techOptions={subtitlesFormatLabels}
        isTechOptionsEnabled
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
  ...state.streamDetails
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleResourceFieldChange: (resource: ResourceUpdate) => dispatch(updateStreamDetailsField(resource))
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamDetails);
