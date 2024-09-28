export async function getSingleWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const wordData = await response.json();
    return wordData;
  } catch (error) {
    console.error("Error fetching word data:", error);
  }
}
