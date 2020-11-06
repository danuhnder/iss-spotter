const { nextISSTimesForMyLocation, dateConverter } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((dates) => {
    dateConverter(dates);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
    });
