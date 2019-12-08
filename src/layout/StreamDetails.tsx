import React from 'react';
import {
  Box,
  Button,
  Collapse,
  Flex,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch
} from '@chakra-ui/core';
import Header, { Level } from '../components/Header';
import {
  AutoTechnology,
  BaseTech,
  DrmTechnology,
  Resource,
  StreamTechnology,
  SubtitlesFormat
} from '../store/model/streamDetails';
import { AppState } from '../store/reducers';
import { Dispatch } from 'redux';
import { Action } from '../store/actions';
import { ResourceUpdate, updateStreamDetailsField } from '../store/actions/streamDetails';
import { StreamDetailsState } from '../store/reducers/streamDetails';
import { connect } from 'react-redux';

type Props = StreamDetailsState & {
  handleResourceFieldChange: (resource: ResourceUpdate) => void;
};

type TechOption = {
  key: BaseTech | StreamTechnology | DrmTechnology | SubtitlesFormat;
  label: string;
};

type RowProps<T = any> = {
  label: string;
  url: string;
  headers: { key: string; value: string }[];
  technology: AutoTechnology<T>;
  useProxy: boolean;
  onChange: (resource: Partial<Resource<T>>) => void;
  techOptions: TechOption[];
  isTechOptionsEnabled?: boolean;
  disabledTechTooltip?: string;
  isHeadersEnabled?: boolean;
};

const isProxyVisible = false;

const streamTechOptions = [
  {
    key: BaseTech.AUTO,
    label: 'Auto'
  },
  {
    key: StreamTechnology.DASH,
    label: 'MPEG-DASH'
  },
  {
    key: StreamTechnology.HLS,
    label: 'HLS'
  },
  {
    key: StreamTechnology.PROGRESSIVE,
    label: 'Progressive video'
  }
];

export const drmTechOptions = [
  {
    key: DrmTechnology.WIDEVINE,
    label: 'Widevine'
  },
  {
    key: DrmTechnology.PLAYREADY,
    label: 'PlayReady'
  },
  {
    key: DrmTechnology.FAIRPLAY,
    label: 'FairPlay'
  }
];

const subtitlesFormatOptions = [
  {
    key: SubtitlesFormat.WEBVTT,
    label: 'WebVTT'
  },
  {
    key: SubtitlesFormat.TTML,
    label: 'TTML (DXFP)'
  },
  {
    key: SubtitlesFormat.SRT,
    label: 'SRT (SubRip)'
  }
];

const disabledDrmSelectorTooltip =
  'DRM technology is tied to the browser, and auto-selected. For testing a different DRM technology, choose a browser that supports it.';

export const getLabel = <T extends unknown>(tech: AutoTechnology<T>, options: TechOption[]) =>
  (options.find(({ key }) => key === tech) || options[0]).label;

const StreamDetailRow: React.FC<RowProps> = ({
  url,
  label,
  onChange,
  useProxy,
  technology,
  techOptions,
  isTechOptionsEnabled,
  isHeadersEnabled,
  disabledTechTooltip
}) => {
  const [showHeaders, setShow] = React.useState(false);
  const handleToggle = () => setShow(!showHeaders);
  return (
    <>
      <FormControl isRequired>
        <Input
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ url: evt.target.value })}
          placeholder={label}
          type="url"
          value={url}
        />
      </FormControl>
      {/*
          // @ts-ignore */}
      <Menu>
        {/*
            // @ts-ignore */}
        <MenuButton as={Button} rightIcon="chevron-down" isDisabled={!isTechOptionsEnabled}>
          {getLabel(technology, techOptions)}
        </MenuButton>
        <MenuList>
          {techOptions.map(({ key, label }: TechOption, i: number) => (
            <MenuItem key={i} onClick={() => onChange({ technology: key })}>
              {label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <FormControl justifySelf="center" style={{ visibility: isProxyVisible ? 'visible' : 'hidden' }}>
        <Switch
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => onChange({ useProxy: evt.target.checked })}
          id="stream-proxy-activate"
          isChecked={useProxy}
        >
          Activate proxy for {label}
        </Switch>
      </FormControl>
      <Button onClick={handleToggle} isDisabled={!isHeadersEnabled}>
        Add
      </Button>
      <Box gridColumn="1/span 4">
        <Collapse isOpen={showHeaders}>
          <Flex direction="row" mt={2} mb={4}>
            <Input flex="1 2 auto" placeholder="Header name" mr={2} />
            <Input flex="2 1 auto" placeholder="Header value" mr={2} />
            {/*
              // @ts-ignore */}
            <IconButton flex="0" aria-label="Remove" icon="delete" />
          </Flex>
        </Collapse>
      </Box>
    </>
  );
};

const StreamDetails: React.FC<Props> = ({
  streamResource,
  drmLicenseResource,
  drmCertificateResource,
  subtitlesResource,
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
        label="Stream URL"
        techOptions={streamTechOptions}
        isTechOptionsEnabled
        isHeadersEnabled={false}
        onChange={(streamResource: Partial<Resource<StreamTechnology>>) =>
          handleResourceFieldChange({ streamResource })
        }
        {...streamResource}
      />
      <StreamDetailRow
        label="DRM license URL"
        techOptions={drmTechOptions}
        isTechOptionsEnabled={false}
        isHeadersEnabled
        disabledTechTooltip={disabledDrmSelectorTooltip}
        onChange={(drmLicenseResource: Partial<Resource<DrmTechnology>>) =>
          handleResourceFieldChange({ drmLicenseResource })
        }
        {...drmLicenseResource}
      />
      <StreamDetailRow
        label="DRM certificate URL"
        techOptions={drmTechOptions}
        isTechOptionsEnabled={false}
        isHeadersEnabled={false}
        disabledTechTooltip={disabledDrmSelectorTooltip}
        onChange={(drmCertificateResource: Partial<Resource<DrmTechnology>>) =>
          handleResourceFieldChange({ drmCertificateResource })
        }
        {...drmCertificateResource}
      />
      <StreamDetailRow
        label="Subtitles URL"
        techOptions={subtitlesFormatOptions}
        isTechOptionsEnabled
        isHeadersEnabled={false}
        onChange={(subtitlesResource: Partial<Resource<SubtitlesFormat>>) =>
          handleResourceFieldChange({ subtitlesResource })
        }
        {...subtitlesResource}
      />
    </Box>
  </form>
);

const mapStateToProps = (state: AppState) => ({
  ...state.streamDetails
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleResourceFieldChange: (resource: ResourceUpdate) => dispatch(updateStreamDetailsField(resource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StreamDetails);
