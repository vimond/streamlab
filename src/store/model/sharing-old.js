import { get } from './platform-injections';

const inclusions = {
    streamResources: {
        general: ['isStartEnabled'],
        playerFormFields: ['streamUrl', 'licenseUrl', 'certificateUrl', 'subtitlesUrl', 'startPosition', 'proxyEnabledList', 'licenseRequestHeaders'],
        streamTechnologies: ['playbackTechnology', 'subtitlesType', 'enableAutoSuggest', 'licenseUrlExpiryTime', 'isCertificateUrlRelevant', 'drmType', 'licenseUrlExpiryTime']
    },
    apiLookup: {
        apiFormFields: ['apiBaseUrl','platform','assetId','protocol','videoFormat','customParameters','deviceId']
    },
    streamProcessor: {
        streamProcessor: ['isEnabled', 'isUrlRewriteEnabled', 'setup']
    },
    playerConfiguration: {
        playerFormFields: ['playerLogLevel', 'libraryLogLevel', 'showPlaybackInfo'],
        configuration: ['configurationString']
    }
};
const setupParamName = 'setup=';
const featuresParamName='features=';

function twoLevelCopy(obj) {
    const copy = {};
    Object.keys(obj).forEach(outerKey => {
        copy[outerKey] = {};
        Object.keys(obj[outerKey]).forEach(innerKey => {
            copy[outerKey][innerKey] = obj[outerKey][innerKey];
        });
    });
    return copy;
}


function simplerEncodeUri(str) {
    return encodeURIComponent(str)
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}')
//        .replace(/%22/g, '"')
        .replace(/%2C/g, ',')
        .replace(/%3A/g, ':')
        .replace(/%5B/g, '[')
        .replace(/%5D/g, ']');
}

function getParameter(queryString, paramName) {
    return queryString.length > 0 && queryString.substr(1).split('&').filter(p => p.indexOf(paramName) === 0)[0];
}

function getOtherParameters(queryString, paramName) {
    if (queryString.length > 0) {
        return '?' + queryString.substr(1).split('&').filter(p => p.indexOf(paramName) !== 0).join('&');
    } else {
        return '';
    }
}

function assembleIncludedState(fullState, includeOptions, activeTopic) {
    const includedFields = {}, sharedThroughLink = [];
    Object.keys(includeOptions).forEach(includeOption => {
        if (includeOptions[includeOption] && inclusions[includeOption]) {
            sharedThroughLink.push(includeOption);
            Object.keys(inclusions[includeOption]).forEach(outerKey => {
                includedFields[outerKey] = includedFields[outerKey] || {};
                inclusions[includeOption][outerKey].forEach(innerKey => {
                    includedFields[outerKey][innerKey] = fullState[outerKey][innerKey];
                });
            });
        }
    });
    if (Object.keys(includedFields).length) {
        includedFields.general = includedFields.general || {};
        includedFields.general.activeTopic = activeTopic;
        includedFields.general.sharedThroughLink = sharedThroughLink;
    }
    return includedFields;
}

export function buildLink(fullState, includeOptions, activeTopic) {
    const loc = document.location;
    const currentPageUrl = loc.protocol + '//' + loc.host + loc.pathname + getOtherParameters(loc.search, setupParamName);    
    const params = assembleIncludedState(fullState, includeOptions, activeTopic);
    const separator = currentPageUrl.indexOf('?') > 0 ? '&' : '?';
    if (Object.keys(params).length) {
        return currentPageUrl + separator + setupParamName + simplerEncodeUri(JSON.stringify(params));
    } else {
        return currentPageUrl;
    }
}

function extractSetupFromPageUrl() {
    let params = {};
    try {
        const setupParam = getParameter(document.location.search, setupParamName);
        if (setupParam) {
            const encodedParams = setupParam.substr(setupParamName.length);
            if (encodedParams.length) {
                try {
                    params = JSON.parse(decodeURIComponent(encodedParams));
                } catch (e) {
                    console.error('Bad format/encoding of setup parameter.');
                }
            }
        }
        const featuresParam = getParameter(document.location.search, featuresParamName);
        if (featuresParam) {
            try {
                const featuresList = featuresParam.substr(featuresParamName.length);
                const features = {};
                featuresList.split(',').forEach(f => features[f] = true);
                params.features = features;
            } catch(e) {
                console.error('Bad format in features parameter.');
            }
        }
    } catch(e) {
        console.error('Query string parsing failed.', e);
    }
    return params;
}

export function extractAndApplySetupFromPageUrl(baseState) {
    const params = extractSetupFromPageUrl();
    const outerKeys = Object.keys(params);
    if (outerKeys.length) {
        const stateCopy = baseState ? twoLevelCopy(baseState) :{};
        outerKeys.forEach(outerKey => {
            const innerKeys = Object.keys(params[outerKey]);
            if (innerKeys.length) {
                stateCopy[outerKey] = stateCopy[outerKey] || {};
                innerKeys.forEach(innerKey => {
                    stateCopy[outerKey][innerKey] = params[outerKey][innerKey];
                });
            }
        });
        return stateCopy;
    } else {
        return baseState;
    }
}

export function clearSetupFromPageUrl() {
    get('document', document => get('window', window => window.history.pushState({}, document.title, document.location.pathname + getOtherParameters(document.location.search, setupParamName))));

}