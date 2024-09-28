function shuffleCountToSeedReduction(shuffleCount) {
  switch (shuffleCount) {
    case 0:
      return 50;
    case 1:
      return 500;
    case 2:
      return 5000;
    case 3:
      return 10000;

    default:
      return 10000;
  }
}

module.exports = shuffleCountToSeedReduction;
