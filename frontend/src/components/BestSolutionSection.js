'use client';

import Image from 'next/image';

export default function BestSolutionSection() {
  return (
    <section className="relative w-full text-white overflow-hidden">
      {/* 🔹 Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-soln.jpg"
          alt="Background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Optional dark overlay if needed */}
        {/* <div className="absolute inset-0 bg-black/50"></div> */}
      </div>

      {/* 🔹 Main Content */}
      <div className="relative z-10 text-center px-4 py-16 md:py-28 max-w-4xl mx-auto">
        <p className="text-yellow-400 font-semibold mb-3 text-sm sm:text-base">
          Talk To Astrologer And Will Get Your Solutions
        </p>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
          We Will Transform Your Life <br />
          <span className="text-white">And Give You The Best Solution.</span>
        </h2>

        {/* 🔹 Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <button className="bg-gradient-to-b from-yellow-300 to-orange-600 px-6 py-3 rounded-sm text-black font-bold hover:scale-105 transition w-full sm:w-auto">
            CHAT NOW
          </button>
          <button className="bg-gradient-to-b from-yellow-300 to-orange-600 px-6 py-3 rounded-sm text-black font-bold hover:scale-105 transition w-full sm:w-auto">
            CONTACT NOW
          </button>
        </div>
      </div>

      {/* 🔹 Note Section */}
      <div className="relative z-10 bg-gradient-to-br from-yellow-300 via-orange-100 to-yellow-200 py-10 px-4 mt-[-2px]">
        <div className="max-w-4xl mx-auto bg-white/30 border border-yellow-500 p-6 sm:p-8 rounded-md">
          <h3 className="text-purple-900 text-xl sm:text-2xl font-extrabold mb-2 flex items-center gap-2">
            <span className="text-pink-700 text-2xl sm:text-3xl">☀️</span> Note:
          </h3>
          <p className="text-black text-sm sm:text-base font-semibold leading-relaxed">
            Beware of fake names and websites. We do not have any other branch, website, or contact numbers.
            We will not be responsible for any fraudulent activity done by any third party.
          </p>
        </div>
      </div>
    </section>
  );
}