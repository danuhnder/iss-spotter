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

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}&n=6`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode } when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    if (data.message === "fail") {
      console.log("ISS EXPLOSION lol just kidding but check your inputs");
      return;
    }
    const locationData = data.response;
    callback(null, locationData);
    
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("failure @fetchIP" , error);
      return;
    }  
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log("failure @fetchcoords" , error);
        return;
      }
      fetchISSFlyOverTimes(data, (error, times) => {
        if (error) {
          console.log("failure @fetchflyover!" , error);
          return;
        }
        for (let event of times) {
         dateConverter(event);
        }
      });
    });
  });
}
const dateConverter = (obj) => {
  const dur = obj.duration;
  const UTXdate = new Date(obj.risetime*1000); 
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = UTXdate.getFullYear();
  const month = months[UTXdate.getMonth()];
  const day = UTXdate.getDay();
  const date = UTXdate.getDate();
  const hour = UTXdate.getHours();
  const min = UTXdate.getMinutes();
  const sec = UTXdate.getSeconds();
  const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  console.log(`Next flyover is ${time} for ${dur} seconds`);
  
  
  
  
  
  
  // const readableDate = UTXdate.toLocaleString("en-US", {weekday: "long", timeZoneName: "short"});
  // console.log(readableDate + dur);
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
