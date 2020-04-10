const getInfectionsByRequestedTime = (currentlyInfected, periodType, timeToElapse) => {
  let numberOfDays;
  if (periodType === 'days') {
    numberOfDays = timeToElapse;
  } else if (periodType === 'weeks') {
    numberOfDays = timeToElapse * 7;
  } else if (periodType === 'months') {
    numberOfDays = timeToElapse * 30;
  }

  const powerDivision = (numberOfDays / 3);
  let power;
  if (powerDivision.toString().includes('.')) {
    [power] = powerDivision.toString().split('.');
  } else {
    power = powerDivision;
  }

  const infectionsByRequestedTime = currentlyInfected * (2 ** power);
  return infectionsByRequestedTime;
};

const getSevereCasesByRequestedTime = (infectionsByRequestedTime) => {
  const severeCasesByRequestedTime = infectionsByRequestedTime * (15 / 100);
  return severeCasesByRequestedTime;
};

const getHospitalBedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const hospitalBedsForSevereCases = totalHospitalBeds * (35 / 100);
  const hospitalBedsFraction = severeCasesByRequestedTime - hospitalBedsForSevereCases;
  let hospitalBedsByRequestedTime;
  if (hospitalBedsFraction.toString().includes('.')) {
    [hospitalBedsByRequestedTime] = hospitalBedsFraction.toString().split('.');
  } else {
    hospitalBedsByRequestedTime = hospitalBedsFraction;
  }
  // console.log(totalHospitalBeds, severeCasesByRequestedTime, hospitalBedsByRequestedTime);
  return hospitalBedsByRequestedTime;
};

/* const mockData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
}; */

const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  // Challenge 1

  impact.currentlyInfected = data.reportedCases * 10;
  impact.infectionsByRequestedTime = getInfectionsByRequestedTime(
    impact.currentlyInfected, data.periodType, data.timeToElapse
  );

  severeImpact.currentlyInfected = data.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = getInfectionsByRequestedTime(
    severeImpact.currentlyInfected, data.periodType, data.timeToElapse
  );

  // Challenge 2

  impact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data.totalHospitalBeds, impact.severeCasesByRequestedTime
  );


  severeImpact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data.totalHospitalBeds, severeImpact.severeCasesByRequestedTime
  );

  return {
    data: input,
    impact,
    severeImpact
  };
};


// covid19ImpactEstimator(mockData);
export default covid19ImpactEstimator;
