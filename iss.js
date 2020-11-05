const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode } when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IP = JSON.parse(body);
    callback(null, IP["ip"]);
    
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request('http://ip-api.com/json/' + ip, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode } when fetching coordinates from IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    if (data.status === "fail") {
      console.log("Invalid IP address supplied");
      return;
    }
    const locationData = {
      latitude: data.lat,
      longitude: data.lon
    };
    callback(null, locationData);
    
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };
