import React, { useState, useMemo } from 'react';
import { calculateReadarapScore } from './scoreEngine';

const EXAMPLES = {
  intro: {
    title: "Intro",
    original: "If this world were mine",
    english: "If this universe were mine",
    spanish: "Si este mundo fuera mío"
  },
  chorus: {
    title: "Chorus",
    original: "In this world, concrete flowers grow\nHeartache, she only doin' what she know\nWeekends, get it poppin' on the low\nBetter days comin' for sure",
    english: "In this city, tough blossoms show\nSorrow, she only livin' what she sow\nFri-Sat, get it buzzin' on the down-low\nBrighter days nearin' for true",
    spanish: "En esta ciudad, brotes fuertes brotan\nTristeza, ella solo vive lo que siembra\nVie-Sáb, hazlo sonar en lo bajo\nDías más claros se acercan de verdad"
  },
  verse1: {
    title: "Verse 1 (Opening)",
    original: "Hey, Roman numeral seven, bae, drop it like it's hot\nIf this world was mine, I'd take your dreams and make 'em multiply\nIf this world was mine, I'd take your enemies in front of God\nIntroduce 'em to that light, hit them strictly with that fire",
    english: "Yo, number seven, dear, stomp it like it's blazing\nIf this globe was mine, I'd snag your hopes and make 'em amplify\nIf this realm was mine, I'd grab your foes right 'fore the Lord\nPresent 'em to that gleam, strike 'em firmly with that blaze",
    spanish: "Yo, número siete, nena, písala como arde\nSi este globo fuera mío, agarraría tus sueños y los amplificaría\nSi este reino fuera mío, agarraría a tus enemigos frente al Señor\nPreséntalos a esa luz, golpéalos firme con esa llama"
  },
  verse2: {
    title: "Verse 2 (Classroom-framed)",
    original: "It go in (when you), out (ride it), do it real slow (slide)\nBaby, you a star, strike, pose (right)\nWhen I'm (when you), with you (with me), everything goes (slow)\nCome and (put that), put that (on my), on my (titi), soul (soul)",
    english: "It goes in (when you), out (glide it), take it quite slow (tide)\nDarling, you a gem, flash, show (bright)\nWhen I'm (when you), near you (with me), everything flows (grow)\nCome and (place that), place that (on my), on my (body), whole (whole)",
    spanish: "Entra (cuando tú), sale (deslízalo), hazlo bien lento (fluye)\nCariño, eres una gema, brilla, muestra (claro)\nCuando estoy (cuando tú), cerca de ti (conmigo), todo fluye (crece)\nVen y (pon eso), pon eso (en mi), en mi (cuerpo), todo (todo)"
  },
  verse3: {
    title: "Verse 3 (Closing)",
    original: "I can't lie, I trust you, I love you, I won't waste your time\nI turn it off just so I can turn you on\nI'ma make you say it loud\nI'm not even trippin', I won't stress you out\nI might even settle down for you, I'ma show you I'm a pro",
    english: "I can't fake, I believe you, I adore you, I won't squander your prime\nI switch it down just so I can fire you up\nI'ma force you to shout it out\nI'm not even buggin', I won't fret you out\nI might even commit for you, I'ma prove you I'm a pro",
    spanish: "No puedo fingir, te creo, te adoro, no voy a malgastar tu tiempo\nLo apago solo para poder encenderte\nVoy a hacer que lo grites fuerte\nNi siquiera me altero, no te voy a estresar\nHasta me comprometo contigo, te voy a probar que soy pro"
  }
};

function countSyllables(text) {
  if (!text) return 0;
  return text.toLowerCase().split(/\s+/).reduce((sum, word) => {
    const cleaned = word.replace(/[^a-záéíóúüñ]/gi, '');
    if (!cleaned) return sum;
    const groups = cleaned.match(/[aeiouáéíóúü]+/gi);
    return sum + (groups ? groups.length : 1);
  }, 0);
}

export default function LyricFlipDemo() {
  const [section, setSection] = useState('chorus');
  const [lang, setLang] = useState('english');
  const [userSwap, setUserSwap] = useState('');
  const [scores, setScores] = useState({ syllable: 0.85, rhyme: 0.8, cadence: 0.78, energy: 0.85 });
  const [result, setResult] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  const example = EXAMPLES[section];
  const model = lang === 'spanish' ? example.spanish : example.english;

  const origSyl = useMemo(() => countSyllables(example.original), [example.original]);
  const userSyl = useMemo(() => countSyllables(userSwap), [userSwap]);
  const modelSyl = useMemo(() => countSyllables(model), [model]);
  const sylDelta = Math.abs(userSyl - origSyl);
  const sylMatch = sylDelta <= 1;

  const handleScore = () => {
    const pkg = calculateReadarapScore(scores.syllable, scores.rhyme, scores.cadence, scores.energy);
    setResult(pkg);
  };

  const loadModel = () => setUserSwap(model);

  const sections = Object.keys(EXAMPLES);

  return (
    <div className={`min-h-screen ${printMode ? 'bg-white text-black' : 'bg-slate-950 text-white'} p-4 md:p-6 font-sans`}>
      {!printMode && (
        <header className="mb-6 border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              READARAP Lyric Flip Lab
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">luther · Bilingual Name Flo Protocol</p>
          </div>
          <button onClick={() => setPrintMode(true)} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs md:text-sm">
            Print Mode
          </button>
        </header>
      )}

      {printMode && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Readarap Lyric Flip Lab</h1>
          <p className="text-sm">luther · {example.title} · {lang}</p>
          <button onClick={() => setPrintMode(false)} className="mt-2 text-sm underline">Exit Print Mode</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-5">
        {!printMode && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-wrap gap-2">
              {sections.map(s => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs md:text-sm transition ${section === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {EXAMPLES[s].title}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setLang(lang === 'english' ? 'spanish' : 'english')} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs md:text-sm">
                {lang === 'english' ? 'ES' : 'EN'}
              </button>
              <button onClick={loadModel} className="bg-purple-600 hover:bg-purple-500 px-3 py-1.5 rounded-xl text-xs md:text-sm">
                Load Model
              </button>
            </div>
          </div>
        )}

        <div className={`grid ${printMode ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900 border border-slate-800'}`}>
            <p className={`text-xs font-mono mb-2 ${printMode ? 'text-gray-600' : 'text-slate-500'}`}>ORIGINAL ({origSyl} syl)</p>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed">{example.original}</pre>
          </div>
          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900 border border-cyan-500/30'}`}>
            <p className={`text-xs font-mono mb-2 ${printMode ? 'text-gray-600' : 'text-cyan-400'}`}>
              YOUR SWAP ({userSyl} syl){
                userSwap && (
                  <span className={`ml-1 ${sylMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                    Δ{sylDelta} {sylMatch ? '✓' : 'stretch'}
                  </span>
                )
              }
            </p>
            {printMode ? (
              <pre className="text-sm whitespace-pre-wrap leading-relaxed">{userSwap || '(no swap entered)'}</pre>
            ) : (
              <textarea
                value={userSwap}
                onChange={e => setUserSwap(e.target.value)}
                placeholder="Write your 75% swap here..."
                className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            )}
          </div>
          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900 border border-slate-800'}`}>
            <p className={`text-xs font-mono mb-2 ${printMode ? 'text-gray-600' : 'text-slate-500'}`}>MODEL {lang.toUpperCase()} ({modelSyl} syl)</p>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed">{model}</pre>
          </div>
        </div>

        {!printMode && (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg">Score Your Swap</h3>
            {['syllable', 'rhyme', 'cadence', 'energy'].map(key => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-20 text-sm capitalize text-slate-400">{key}</label>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={scores[key]}
                  onChange={e => setScores({...scores, [key]: parseFloat(e.target.value)})}
                  className="flex-1 accent-cyan-500"
                />
                <span className="w-12 text-right font-mono text-sm">{Math.round(scores[key]*100)}%</span>
              </div>
            ))}
            <button onClick={handleScore} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition">
              LOCK THE SCORE
            </button>
          </div>
        )}

        {result && !printMode && (
          <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-2xl text-center">
            <p className="text-xs font-mono text-purple-400">PERFORMANCE</p>
            <h2 className="text-3xl font-black mt-1">{result.tier}</h2>
            <p className="text-5xl font-black my-4">{result.score}%</p>
            <p className="text-amber-400 font-bold text-xl">🪙 {result.rewards.rapCoins} RapCoins</p>
            <button onClick={() => setResult(null)} className="mt-4 text-sm text-slate-400 underline">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}