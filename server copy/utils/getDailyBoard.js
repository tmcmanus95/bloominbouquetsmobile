function getDailyBoard() {
  const getRandomLetter = () => {
    const letterFrequencies = {
      A: 8.17,
      B: 1.49,
      C: 2.78,
      D: 4.25,
      E: 12.7,
      F: 2.23,
      G: 2.02,
      H: 6.09,
      I: 6.97,
      J: 0.15,
      K: 0.77,
      L: 4.03,
      M: 2.41,
      N: 6.75,
      O: 7.51,
      P: 1.93,
      Q: 0.1,
      R: 5.99,
      S: 6.33,
      T: 9.06,
      U: 2.76,
      V: 0.98,
      W: 2.36,
      X: 0.15,
      Y: 1.97,
      Z: 0.07,
    };

    const totalFrequency = Object.values(letterFrequencies).reduce(
      (sum, frequency) => sum + frequency,
      0
    );

    const randomFrequency = Math.random() * totalFrequency;
    let cumulativeFrequency = 0;

    for (const [letter, frequency] of Object.entries(letterFrequencies)) {
      cumulativeFrequency += frequency;
      if (randomFrequency <= cumulativeFrequency) {
        return letter;
      }
    }

    // Fallback letter
    return "E";
  };

  let board = "";
  for (let i = 0; i < 100; i++) {
    board += getRandomLetter();
  }
  return board;
}

module.exports = getDailyBoard;
