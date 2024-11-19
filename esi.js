const esi = require('eve-swagger')
const setup = require('./setup.js');

exports.DEFAULT_CONFIG = {
    url: setup.esi.esiUrl,
    source: 'tranquility',
    userAgent: setup.esi.esiUserAgent,
};

function makeAPI(config = {}) {
    let fullConfig = Object.assign({}, esi.DEFAULT_CONFIG, exports.DEFAULT_CONFIG, config);
    return esi.makeAPI(fullConfig);
}

exports.makeAPI = makeAPI;
