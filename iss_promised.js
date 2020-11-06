// iss_promised.js
const request = require('request-promise-native');

const fetchMyIP = () => request('https://api.ipify.org?format=json');

const fetchCoordsByIP = function(body) {
  const IP = JSON.parse(body)
  return request('http://ip-api.com/json/' + IP.ip);
};

const fetchISSFlyOverTimes = function(body) {
  const location = JSON.parse(body)
  return request(`http://api.open-notify.org/iss-pass.json?lat=${location.lat}&lon=${location.lon}&n=5`)
};

const dateConverter = (arr) => {
  for(let obj of arr) {
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
    console.log(`Next flyover is ${time} for ${dur} seconds. HAPPY STARGAZING!`);
  }
}

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};



  module.exports = { nextISSTimesForMyLocation, dateConverter }