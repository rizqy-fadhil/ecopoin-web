export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-white rounded-lg shadow-lg p-8 mx-auto max-w-2xl">
      <h2 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4 drop-shadow-sm">
        Ubah Sampahmu Menjadi <span className="text-green-500">GreenCoin</span>
      </h2>
      <p className="text-gray-700 mb-8 text-lg md:text-xl">
        Bergabunglah dengan EcoPoin untuk mengelola sampah, dapatkan poin hijau, dan wujudkan lingkungan yang lebih bersih sekaligus mendapatkan reward.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/login" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-2 border-2 border-green-600 text-green-600 font-semibold rounded-full transition duration-150 hover:bg-green-50 hover:border-green-700 hover:text-green-700 focus:outline-none"
            type="button"
          >
            Login
          </button>
        </a>
        <a href="/register" className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-full transition duration-150 hover:bg-green-700 focus:outline-none"
            type="button"
          >
            Register
          </button>
        </a>
      </div>
    </section>
  );
}