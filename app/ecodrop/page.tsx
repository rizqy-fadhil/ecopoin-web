import {
  Camera,
  CheckCircle,
  Clock,
  FolderOpen,
  MapPin,
  Phone,
  Upload,
} from "lucide-react";

export default function EcoDropPage() {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          EcoDrop Manual Deposit
        </h1>
        <p className="text-gray-700 text-base md:text-lg">
          Record your manual drop-offs at the recycling center.
        </p>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row justify-between gap-6">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            Bank Sampah Induk Surabaya
          </h2>
          <div className="flex items-start gap-2 mb-1">
            <MapPin className="w-5 h-5 mt-1 text-green-700" />
            <span className="text-gray-800">
              Jl. Ngagel Tim. No.24, Pucang Sewu, Kec. Gubeng
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-green-700" />
            <span className="text-sm text-gray-700">
              Mon-Fri, 08:00 - 16:00
              <span className="inline-flex items-center ml-3">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">Open Now</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-700" />
            <span className="text-sm text-gray-700">(031) 503-4567</span>
          </div>
        </div>
        {/* Map & Directions */}
        <div className="flex flex-col items-center md:items-end min-w-[220px]">
          <div className="w-[220px] h-[100px] bg-gray-200 rounded-xl mb-3 overflow-hidden flex items-center justify-center">
            {/* Static map image placeholder */}
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80"
              alt="Static Map Surabaya"
              className="object-cover w-full h-full"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Jl. Ngagel Tim. No.24, Pucang Sewu, Kec. Gubeng" // Actual link, update as needed
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition text-sm"
          >
            Get Directions
          </a>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Drop-off Details */}
        <form className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col gap-6">
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-black">
              Record Drop-off Details
            </h3>
          </div>
          {/* Waste Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Waste Category
            </label>
            <select
              id="category"
              name="category"
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select category.
              </option>
              <option value="plastic">Plastic</option>
              <option value="paper">Paper</option>
              <option value="metal">Metal</option>
              <option value="glass">Glass</option>
              <option value="organic">Organic</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <div className="relative flex">
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.0"
                className="block w-full border border-gray-200 rounded-l-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                required
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 text-gray-600 text-sm">
                kg
              </span>
            </div>
          </div>
          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Add any specific details about the waste..."
              className="block w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
            />
          </div>
        </form>

        {/* Right Column: Upload Photo & Submit Actions */}
        <div className="flex flex-col h-full">
          <form className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-black">
                Record Drop-off Details
              </h3>
            </div>
            {/* Dropzone */}
            <label
              htmlFor="dropoff-photo"
              className="flex flex-col items-center justify-center flex-1 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl py-8 px-4 transition hover:bg-green-50 text-center mb-6"
            >
              <Upload className="w-12 h-12 text-green-400 mb-2" />
              <span className="font-medium text-green-700 mb-1">
                Click to upload photo
              </span>
              <span className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max. 3MB)
              </span>
              <input
                id="dropoff-photo"
                name="dropoff-photo"
                type="file"
                accept="image/*"
                className="hidden"
                required
                // multiple if needed
              />
            </label>
            <div className="mt-auto flex justify-end gap-3">
              <button
                type="button"
                className="px-5 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 font-semibold shadow-sm transition hover:border-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <Upload className="w-5 h-5" />
                Submit Drop-off
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}