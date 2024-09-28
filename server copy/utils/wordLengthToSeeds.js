function wordLengthToSeeds(wordLength) {
  switch (wordLength) {
    case 3:
      return 1;
    case 4:
      return 2;
    case 5:
      return 5;
    case 5:
      return 10;
    case 6:
      return 15;
    case 7:
      return 25;
    case 8:
      return 50;
    case 9:
      return 100;
    case 10:
      return 250;
    case 11:
      return 500;
    case 12:
      return 1000;
    case 13:
      return 2500;
    case 14:
      return 5000;
    case 15:
      return 10000;
    case 16:
      return 25000;

    default:
      return 1;
  }
}
module.exports = wordLengthToSeeds;
