export function tallyFlowerCount({ words }) {
  let flowerCount = {
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
    eight: 0,
    nine: 0,
    ten: 0,
    eleven: 0,
    twelve: 0,
    thirteen: 0,
  };
  for (let i = 0; i < words.length; i++) {
    if (words[i].length == 3) {
      flowerCount.three++;
    } else if (words[i].length == 4) {
      flowerCount.four++;
    } else if (words[i].length == 5) {
      flowerCount.five++;
    } else if (words[i].length == 6) {
      flowerCount.six++;
    } else if (words[i].length == 7) {
      flowerCount.seven++;
    } else if (words[i].length == 8) {
      flowerCount.eight++;
    } else if (words[i].length == 9) {
      flowerCount.nine++;
    } else if (words[i].length == 10) {
      flowerCount.ten++;
    } else if (words[i].length == 11) {
      flowerCount.eleven++;
    } else if (words[i].length == 12) {
      flowerCount.twelve++;
    } else if (words[i].length == 13) {
      flowerCount.thirteen++;
    } else {
      flowerCount.thirteen++;
    }
  }
  return flowerCount;
}
