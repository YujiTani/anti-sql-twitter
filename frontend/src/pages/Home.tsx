import DecarbonisationGrid from '@/features/decarbonisation/components/decarbonisation.grid';

function Home() {
  // APIサーバーの動作確認のため、/health を叩く
  fetch('http://localhost:3000/health')
    .then((response) => {
      if (!response.ok) {
        throw new Error('API server is not healthy');
      }
      return response.json();
    })
    .then((data) => {
      console.log('API server is healthy:', data);
    })
    .catch((error) => {
      console.error('Error checking API server health:', error);
    });

  return (
    <div className="min-h-screen w-full p-6">
      <DecarbonisationGrid />
    </div>
  );
}

export default Home;
