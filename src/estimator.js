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
  const hospitalBedsByRequestedTime = hospitalBedsForSevereCases - severeCasesByRequestedTime;
  return hospitalBedsByRequestedTime;
};


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
    data.totalHospitalBeds, data.severeCasesByRequestedTime
  );


  severeImpact.severeCasesByRequestedTime = getSevereCasesByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(
    data.totalHospitalBeds, data.severeCasesByRequestedTime
  );

  return {
    data: input,
    impact,
    severeImpact
  };
};


export default covid19ImpactEstimator;
