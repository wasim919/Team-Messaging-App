const NodeGeocoder = require('node-geocoder');

let options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: 'https',
  formatter: null,
};

let geoCoder = NodeGeocoder(options);

module.exports = geoCoder;
