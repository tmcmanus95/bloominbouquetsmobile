export default function FeaturedWords() {
  const featuredWords = ["First", "Featured", "Words", "Go", "Here", "Bucko"];
  return (
    <div>
      <div className="text-center text-2xl mt-5">Featured Words</div>
      <div className="grid md:grid-cols-6 grid-cols-3">
        {featuredWords.map((word, index) => (
          <div
            key={index}
            className="border-green-700 border-2 dark:text-white m-4 hover:bg-green-700 hover:text-white text-center"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
