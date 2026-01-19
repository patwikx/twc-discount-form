export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center font-mono space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xl font-bold uppercase">Loading...</p>
      </div>
    </div>
  );
}
