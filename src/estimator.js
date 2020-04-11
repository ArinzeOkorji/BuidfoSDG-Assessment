const getNumberOfDays = (periodType, timeToElapse) => {
  let numberOfDays;
  if (periodType === 'days') {
    numberOfDays = timeToElapse;
  } else if (periodType === 'weeks') {
    numberOfDays = timeToElapse * 7;
  } else if (periodType === 'months') {
    numberOfDays = timeToElapse * 30;
  }

  return numberOfDays;
};

const getInfectionsByRequestedTime = (currentlyInfected, periodType, timeToElapse) => {
  const numberOfDays = getNumberOfDays(periodType, timeToElapse);

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
  const hospitalBedsFraction = hospitalBedsForSevereCases - severeCasesByRequestedTime;
  let hospitalBedsByRequestedTime;
  if (hospitalBedsFraction.toString().includes('.')) {
    [hospitalBedsByRequestedTime] = hospitalBedsFraction.toString().split('.');
    if (hospitalBedsFraction.toString().includes('-')) {
      hospitalBedsByRequestedTime = -Math.abs(hospitalBedsByRequestedTime);
    } else {
      hospitalBedsByRequestedTime = Math.abs(hospitalBedsByRequestedTime);
    }
  } else {
    hospitalBedsByRequestedTime = hospitalBedsFraction;
  }
  // console.log(totalHospitalBeds, severeCasesByRequestedTime, hospitalBedsByRequestedTime);
  return hospitalBedsByRequestedTime;
};

const getCasesForICUByRequestedTime = (infectionsByRequestedTime) => {
  const casesForICUFraction = infectionsByRequestedTime * (5 / 100);
  let casesForICUByRequestedTime;
  if (casesForICUFraction.toString().includes('.')) {
    [casesForICUByRequestedTime] = casesForICUFraction.toString().split('.');
  } else {
    casesForICUByRequestedTime = casesForICUFraction;
  }
  // console.log('ICUs - ', casesForICUByRequestedTime);
  return casesForICUByRequestedTime;
  // return casesForICUFraction;
};

const getCasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => {
  const casesForVentilatorsFraction = infectionsByRequestedTime * (2 / 100);
  let casesForVentilatorsByRequestedTime;
  if (casesForVentilatorsFraction.toString().includes('.')) {
    [casesForVentilatorsByRequestedTime] = casesForVentilatorsFraction.toString().split('.');
    if (casesForVentilatorsFraction.toString().includes('-')) {
      casesForVentilatorsByRequestedTime = -Math.abs(casesForVentilatorsByRequestedTime);
    } else {
      casesForVentilatorsByRequestedTime = Math.abs(casesForVentilatorsByRequestedTime);
    }
  } else {
    casesForVentilatorsByRequestedTime = casesForVentilatorsFraction;
  }
  // console.log('Ventilators - ', casesForVentilatorsByRequestedTime);
  return casesForVentilatorsByRequestedTime;
  // return casesForVentilatorsFraction;
};

const getDollarsInFlight = (infectionsByRequestedTime, averageDailyIncomeInUSD,
  averageDailyIncomePopulation, periodType, timeToElapse) => {
  const numberOfDays = getNumberOfDays(periodType, timeToElapse);

  // eslint-disable-next-line max-len
  const dollarsInFlightFraction = (infectionsByRequestedTime * averageDailyIncomePopulation * averageDailyIncomeInUSD) / numberOfDays;

  /* if (dollarsInFlight.toString().includes('.')) {
    const multiplier = 10 ** 1;
    dollarsInFlight = Math.round(dollarsInFlight * multiplier) / multiplier;
     [dollarsInFlight] = dollarsInFlight.toString().split('.');

    parseInt(dollarsInFlight, 2);
    if (dollarsInFlight.toString().includes('-')) {
      dollarsInFlight = -Math.abs(dollarsInFlight);
    } else {
      dollarsInFlight = Math.abs(dollarsInFlight);
    }
  } */

  let dollarsInFlight;
  if (dollarsInFlightFraction.toString().includes('.')) {
    [dollarsInFlight] = dollarsInFlightFraction.toString().split('.');

    if (dollarsInFlightFraction.toString().includes('-')) {
      dollarsInFlight = -Math.abs(dollarsInFlight);
    } else {
      dollarsInFlight = Math.abs(dollarsInFlight);
    }
  } else {
    dollarsInFlight = dollarsInFlightFraction;
  }
  // console.log('Dollars - ', dollarsInFlight);

  return dollarsInFlight;
};

/* const mockData = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
  },
  periodType: 'days',
  timeToElapse: 38,
  reportedCases: 2747,
  population: 92931687,
  totalHospitalBeds: 678874
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

  // Challenge 3
  impact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    impact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = getDollarsInFlight(impact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation,
    data.periodType, data.timeToElapse);


  severeImpact.casesForICUByRequestedTime = getCasesForICUByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = getCasesForVentilatorsByRequestedTime(
    severeImpact.infectionsByRequestedTime
  );
  severeImpact.dollarsInFlight = getDollarsInFlight(severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation,
    data.periodType, data.timeToElapse);

  return {
    data: input,
    impact,
    severeImpact
  };
};


// covid19ImpactEstimator(mockData);
export default covid19ImpactEstimator;
