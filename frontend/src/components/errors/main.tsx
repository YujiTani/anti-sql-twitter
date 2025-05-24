function MainErrorFallback() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-red-500">
      <h2 className="text-lg font-semibold">
        うーん (´･ω･`) うまく表示できませんでした
      </h2>
      <button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </button>
    </div>
  );
}

export default MainErrorFallback;
