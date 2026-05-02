import { AshokaChakra } from '@/components/motifs/AshokaChakra';

export default function AboutPage() {
  return (
    <main id="main" className="min-h-screen bg-khadi-50 pb-20">
      <div className="bg-white py-16 shadow-sm border-b border-khadi-100">
        <div className="container-yatra text-center">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold mb-4 tracking-wider">
            ABOUT THE PROJECT
          </span>
          <h1 className="font-display text-4xl font-bold text-ink-900 md:text-5xl flex justify-center items-center gap-4">
            <span className="text-indigo-chakra"><AshokaChakra size={48} /></span>
            Election <span className="text-saffron-700">Yatra</span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-ink-700">
            Janta ka Election Saathi. Built to empower Indian voters through education, accessibility, and technology.
          </p>
        </div>
      </div>

      <div className="container-yatra mt-16 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border-t-8 border-saffron-500">
          <h2 className="font-display text-3xl font-bold text-ink-900 mb-6">Our Mission</h2>
          <p className="text-ink-800 text-lg leading-relaxed mb-8">
            Democracy is the festival of the masses. Yet, many citizens face barriers—be it misinformation, lack of accessibility, or simply not knowing the polling procedures. Election Yatra was built to bridge this gap, ensuring that every eligible citizen can cast their vote with confidence.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-leaf-50 p-6 rounded-2xl border border-leaf-100">
              <span className="text-3xl block mb-4">♿</span>
              <h3 className="font-bold text-xl text-leaf-900 mb-2">Accessibility First</h3>
              <p className="text-leaf-800">
                From Text-to-Speech features to comprehensive guides on Form 12D for Senior Citizens and PwD voters, we ensure no one is left behind.
              </p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <span className="text-3xl block mb-4">🛡️</span>
              <h3 className="font-bold text-xl text-indigo-900 mb-2">Fighting Misinformation</h3>
              <p className="text-indigo-800">
                Powered by Google Gemini AI, our Forward Clinic fact-checks viral rumors against official ECI guidelines in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
