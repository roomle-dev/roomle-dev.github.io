import { bB as sanitizedCameraMode } from './main-thread-to-worker-64f5b9ad.js';

const isReallyNaN = function (x) {
    return Number.isNaN(x) || isNaN(x);
};
const _isNumber = function (n) {
    if (isReallyNaN(n)) {
        return false;
    }
    return Number.isFinite(parseFloat(n));
};
const getAllParameters = function (url) {
    if (!url) {
        url = window.location.href;
    }
    const params = url.split('?');
    if (params.length !== 2) {
        return {};
    }
    const options = params[1].split('&');
    let obj = {};
    options.forEach((param) => {
        const keyValue = param.split('=');
        let key = keyValue[0];
        let value = keyValue[1];
        if (value === 'true') {
            value = true;
        }
        if (value === 'false') {
            value = false;
        }
        if (_isNumber(value)) {
            value = parseFloat(value);
        }
        if (key === 'mode') {
            value = sanitizedCameraMode(value);
        }
        obj[keyValue[0]] = value;
    });
    return obj;
};

export { getAllParameters as g };
//# sourceMappingURL=query-params-helper-cc317631.js.map
