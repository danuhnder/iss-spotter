const { nextISSTimesForMyLocation, dateConverter } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((dates) => {
    dateConverter(dates);
  });
