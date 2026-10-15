import React, { useState, useMemo } from 'react';
import { calculateReadarapScore } from './scoreEngine';

const EXAMPLES = {
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

  const example = EXAMPLES[section];
  const model = lang === 'spanish' ? example.spanish : example.english;

  const origSyl = useMemo(() => countSyllables(example.original), [example.original]);
  const userSyl = useMemo(() => countSyllables(userSwap), [userSwap]);
  const modelSyl = useMemo(() => countSyllables(model), [model]);

  const handleScore = () => {
    const pkg = calculateReadarapScore(scores.syllable, scores.rhyme, scores.cadence, scores.energy);
    setResult(pkg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <header className="mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          READARAP Lyric Flip Lab
        </h1>
        <p className="text-sm text-slate-400 mt-1">luther · Bilingual Name Flo Protocol</p>
      </header>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-3">
          <select value={section} onChange={e => setSection(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">
            <option value="chorus">Chorus</option>
            <option value="verse1">Verse 1</option>
          </select>
          <button onClick={() => setLang(lang === 'english' ? 'spanish' : 'english')} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm">
            {lang === 'english' ? 'Switch to Spanish' : 'Switch to English'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs font-mono text-slate-500 mb-2">ORIGINAL ({origSyl} syl)</p>
            <pre className="text-sm whitespace-pre-wrap">{example.original}</pre>
          </div>
          <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-2xl">
            <p className="text-xs font-mono text-cyan-400 mb-2">YOUR SWAP ({userSyl} syl)</p>
            <textarea
              value={userSwap}
              onChange={e => setUserSwap(e.target.value)}
              placeholder="Write your 75% swap here..."
              className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <p className="text-xs font-mono text-slate-500 mb-2">MODEL {lang.toUpperCase()} ({modelSyl} syl)</p>
            <pre className="text-sm whitespace-pre-wrap">{model}</pre>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-bold">Score Your Swap</h3>
          {['syllable', 'rhyme', 'cadence', 'energy'].map(key => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-24 text-sm capitalize text-slate-400">{key}</label>
              <input
                type="range" min="0" max="1" step="0.01"
                value={scores[key]}
                onChange={e => setScores({...scores, [key]: parseFloat(e.target.value)})}
                className="flex-1"
              />
              <span className="w-12 text-right font-mono">{Math.round(scores[key]*100)}%</span>
            </div>
          ))}
          <button onClick={handleScore} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-3 rounded-xl">
            LOCK THE SCORE
          </button>
        </div>

        {result && (
          <div className="bg-slate-900 border border-purple-500/40 p-6 rounded-2xl text-center">
            <p className="text-xs font-mono text-purple-400">PERFORMANCE</p>
            <h2 className="text-3xl font-black mt-1">{result.tier}</h2>
            <p className="text-5xl font-black my-4">{result.score}%</p>
            <p className="text-amber-400 font-bold">🪙 {result.rewards.rapCoins} RapCoins</p>
            <button onClick={() => setResult(null)} className="mt-4 text-sm text-slate-400 underline">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}
