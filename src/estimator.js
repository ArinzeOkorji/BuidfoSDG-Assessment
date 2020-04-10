const getInfectionsByRequestedTime = (currentlyInfected, days) => {
  const power = Math.floor(days / 3);
  const infectionsByRequestedTime = currentlyInfected * (2 ** power);
  return infectionsByRequestedTime;
};


const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  // Challenge 1

  impact.currentlyInfected = data.reportedCases * 10;
  impact.infectionsByRequestedTime = getInfectionsByRequestedTime(impact.currentlyInfected, 28);

  severeImpact.currentlyInfected = data.reportedCases * 50;
  severeImpact.infectionsByRequestedTime = getInfectionsByRequestedTime(
    severeImpact.currentlyInfected, 28
  );

  return {
    data: {},
    impact: {},
    severeImpact: {}
  };
};


export default covid19ImpactEstimator;
