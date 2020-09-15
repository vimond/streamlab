import { PersistibleFormData } from './history';

const setupParamName = 's=';

type LocationProps = {
  origin: string;
  pathname: string;
  search: string;
};

// TODO in reducer: Derive: advancedMode (according to details), isRightPaneExpanded true, rightPaneIndex 0, expandedAdvancedAccordionIndices - all.

const getQueryParameter = (queryString: string, key: string) =>
  queryString.length &&
  queryString
    .substr(1)
    .split('&')
    .find((p) => p.startsWith(key));

const getRemainingQueryString = (queryString: string, paramName: string, delimiter = '&') => {
  if (queryString.length > 1) {
    const remaining = queryString
      .substr(1)
      .split('&')
      .filter((p) => p.indexOf(paramName) !== 0)
      .join('&');
    if (remaining.length > 1) {
      return delimiter + remaining;
    }
  }
  return '';
};

const simplerEncodeUri = (str: string) =>
  encodeURIComponent(str)
    .replace(/%7B/g, '{')
    .replace(/%7D/g, '}')
    .replace(/%2C/g, ',')
    .replace(/%3A/g, ':')
    .replace(/%5B/g, '[')
    .replace(/%5D/g, ']');

export const twoLevelCopy = <T>(obj: T): T => {
  const copy = { ...(obj as { [key: string]: any }) } as { [key: string]: any };
  Object.keys(obj).forEach((outerKey) => {
    copy[outerKey] = { ...(copy[outerKey] as { [key: string]: any }) } as { [key: string]: any };
  });
  return copy as T;
};

export const parseSetupFromQueryString = (queryString: string): PersistibleFormData | undefined => {
  try {
    const setupParameter = getQueryParameter(queryString, setupParamName);
    if (setupParameter) {
      const encodedValue = setupParameter.substr(setupParamName.length);
      if (encodedValue.length) {
        return JSON.parse(decodeURIComponent(encodedValue)) as PersistibleFormData;
      }
    }
  } catch (e) {
    console.error(`Bad format/encoding of setup parameter ("${setupParamName}").`);
  }
};

export const buildUrlFromState = (state: PersistibleFormData, { origin, pathname, search }: LocationProps): string =>
  `${origin}${pathname}?${setupParamName}${simplerEncodeUri(JSON.stringify(state))}${getRemainingQueryString(
    search,
    setupParamName
  )}`;

export const removeSetupFromUrl = ({ pathname, search }: LocationProps): string => {
  return pathname + getRemainingQueryString(search, setupParamName, '?');
};

export const updateAddressBar = () =>
  window.history.pushState({}, document.title, removeSetupFromUrl(document.location));

// Must be called:
// O Advanced mode toggle
// O Basic/advanced stream form field change
// O Player options change
// O Clear form
// * Restore into forms
