import React, { useState, useMemo } from 'react';
import { calculateReadarapScore } from './scoreEngine';

const TRACKS = {
  luther: {
    title: "luther (Original Flip)",
    sections: {
      intro: {
        title: "Intro",
        original: "If this world were mine",
        english: "If this universe were mine",
        spanish: "Si este mundo fuera m\u00edo"
      },
      verse1: {
        title: "Verse 1",
        original: "Hey, Roman numeral seven, bae, drop it like it's hot\nIf this world was mine, I'd take your dreams and make 'em multiply\nIf this world was mine, I'd take your enemies in front of God\nIntroduce 'em to that light, hit them strictly with that fire",
        english: "Yo, number seven, dear, stomp it like it's blazing\nIf this globe was mine, I'd snag your hopes and make 'em amplify\nIf this realm was mine, I'd grab your foes right 'fore the Lord\nPresent 'em to that gleam, strike 'em firmly with that blaze",
        spanish: "Yo, n\u00famero siete, nena, p\u00edsala como arde\nSi este globo fuera m\u00edo, agarrar\u00eda tus sue\u00f1os y los amplificar\u00eda"
      },
      chorus: {
        title: "Chorus",
        original: "In this world, concrete flowers grow\nHeartache, she only doin' what she know\nWeekends, get it poppin' on the low\nBetter days comin' for sure",
        english: "In this city, tough blossoms show\nSorrow, she only livin' what she sow\nFri-Sat, get it buzzin' on the down-low\nBrighter days nearin' for true",
        spanish: "En esta ciudad, brotes fuertes brotan\nTristeza, ella solo vive lo que siembra\nVie-S\u00e1b, hazlo sonar en lo bajo\nD\u00edas m\u00e1s claros se acercan de verdad"
      }
    }
  },
  educational: {
    title: "Educational Readarap Flip",
    sections: {
      verse1: {
        title: "Verse 1",
        original: "Hey, Roman numeral seven, bae, drop it like it's hot\nIf this world was mine, I'd take your dreams and make 'em multiply",
        english: "If this world were mine, with rhythm and rhyme,\nWe'd conquer Math, Science, for all of time.\nEnglish and History, no more a chore,\nReadarap's the method, forevermore!",
        spanish: "Si este mundo fuera m\u00edo, con ritmo y rima,\nConquistar\u00edamos Matem\u00e1ticas, Ciencia, para siempre.\nIngl\u00e9s e Historia, ya no una carga,\nReadarap es el m\u00e9todo, para siempre."
      },
      chorus: {
        title: "Chorus",
        original: "Hey, Roman numeral seven, bae, drop it like it's hot\nIf this world was mine, I'd take your dreams and make 'em multiply",
        english: "Hey, knowledge seekers, let's drop it like it's hot,\nIf this world was mine, your learning would multiply,\nIf this world was mine, no subject would be too tough,\nWe'd master them all, with Readarap's fire,",
        spanish: "Hey, buscadores de conocimiento, p\u00edsalo como arde,\nSi este mundo fuera m\u00edo, tu aprendizaje se multiplicar\u00eda,\nSi este mundo fuera m\u00edo, ninguna materia ser\u00eda demasiado dura,\nLas dominar\u00edamos todas, con el fuego de Readarap,"
      },
      verse2: {
        title: "Verse 2",
        original: "It go in (when you), out (ride it), do it real slow (slide)",
        english: "Science experiments, we'll decode,\nFrom atoms to galaxies, a knowledge load.\nHistorical timelines, a story to tell,\nReadarap's rhythm, will make it excel.",
        spanish: "Experimentos de ciencia, decodificaremos,\nDe \u00e1tomos a galaxias, una carga de conocimiento.\nL\u00edneas de tiempo hist\u00f3ricas, una historia que contar,\nEl ritmo de Readarap, lo har\u00e1 sobresalir."
      },
      bridge: {
        title: "Bridge",
        original: "In this world, concrete flowers grow\nHeartache, she only doin' what she know",
        english: "In this world, where knowledge can bloom,\nReadarap's method, dispels all the gloom.\nWeekends for learning, it's never too slow,\nBetter days coming, with smarts we will grow!",
        spanish: "En este mundo, donde el conocimiento puede florecer,\nEl m\u00e9todo de Readarap, disipa toda la penumbra.\nFines de semana para aprender, nunca es demasiado lento,\nD\u00edas mejores vienen, con inteligencia creceremos!"
      },
      outro: {
        title: "Outro",
        original: "I can't lie, I trust you, I love you, I won't waste your time",
        english: "I can't lie, I trust Readarap, I love it, it won't waste your time,\nWe'll turn learning on, with every single rhyme.\nI'ma make you say it loud, \"I'm a genius, it's true!\"\nI'm not even trippin', Readarap will see you through.",
        spanish: "No puedo mentir, conf\u00edo en Readarap, lo amo, no desperdiciar\u00e1 tu tiempo,\nEncenderemos el aprendizaje, con cada rima.\nVoy a hacer que lo digas fuerte, \"\u00a1Soy un genio, es verdad!\"\nNi siquiera me altero, Readarap te acompa\u00f1ar\u00e1."
      }
    }
  }
};

function countSyllables(text) {
  if (!text) return 0;
  return text.toLowerCase().split(/\s+/).reduce((sum, word) => {
    const cleaned = word.replace(/[^a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1]/gi, '');
    if (!cleaned) return sum;
    const groups = cleaned.match(/[aeiou\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc]+/gi);
    return sum + (groups ? groups.length : 1);
  }, 0);
}

export default function LyricFlipDemo() {
  const [track, setTrack] = useState('educational');
  const [section, setSection] = useState('verse1');
  const [lang, setLang] = useState('english');
  const [userSwap, setUserSwap] = useState('');
  const [scores, setScores] = useState({ syllable: 0.85, rhyme: 0.8, cadence: 0.78, energy: 0.85 });
  const [result, setResult] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  const currentTrack = TRACKS[track];
  const example = currentTrack.sections[section] || Object.values(currentTrack.sections)[0];
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

  return (
    <div className={`min-h-screen ${printMode ? 'bg-white text-black' : 'bg-slate-950 text-white'} p-4 sm:p-6 font-sans`}>
      {!printMode && (
        <header className="mb-6 border-b border-slate-800 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                READARAP Lyric Flip Lab
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Bilingual Name Flo Protocol</p>
            </div>
            <button onClick={() => setPrintMode(true)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">
              Print
            </button>
          </div>

          {/* Track Tabs */}
          <div className="flex gap-2 mt-4">
            {Object.entries(TRACKS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setTrack(key); setSection(Object.keys(val.sections)[0]); }}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                  track === key ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val.title}
              </button>
            ))}
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {Object.entries(currentTrack.sections).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  section === key
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val.title}
              </button>
            ))}
          </div>
        </header>
      )}

      {printMode && (
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold">Readarap Lyric Flip Lab</h1>
          <p className="text-sm">{currentTrack.title} · {example.title} · {lang}</p>
          <button onClick={() => setPrintMode(false)} className="mt-2 text-xs underline">Exit Print</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-5">
        {!printMode && (
          <div className="flex gap-2">
            <button onClick={() => setLang(lang === 'english' ? 'spanish' : 'english')} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">
              {lang === 'english' ? 'ES' : 'EN'}
            </button>
            <button onClick={loadModel} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg">
              Load Model
            </button>
          </div>
        )}

        <div className={`grid gap-4 ${printMode ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900/80 border border-slate-800'}`}>
            <p className={`text-xs font-mono mb-2 ${printMode ? 'text-gray-600' : 'text-slate-500'}`}>ORIGINAL · {origSyl} syl</p>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed">{example.original}</pre>
          </div>

          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900/80 border border-cyan-500/40'}`}>
            <div className="flex justify-between items-center mb-2">
              <p className={`text-xs font-mono ${printMode ? 'text-gray-600' : 'text-cyan-400'}`}>YOUR SWAP · {userSyl} syl</p>
              {userSwap && (
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${sylMatch ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  Δ{sylDelta} {sylMatch ? '✓' : 'stretch'}
                </span>
              )}
            </div>
            {printMode ? (
              <pre className="text-sm whitespace-pre-wrap leading-relaxed">{userSwap || '(empty)'}</pre>
            ) : (
              <textarea
                value={userSwap}
                onChange={e => setUserSwap(e.target.value)}
                placeholder="Drop your 75% swap..."
                className="w-full h-36 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            )}
          </div>

          <div className={`p-4 rounded-2xl ${printMode ? 'border border-gray-300' : 'bg-slate-900/80 border border-slate-800'}`}>
            <p className={`text-xs font-mono mb-2 ${printMode ? 'text-gray-600' : 'text-slate-500'}`}>MODEL {lang.toUpperCase()} · {modelSyl} syl</p>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed">{model}</pre>
          </div>
        </div>

        {!printMode && (
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm">Score Your Swap</h3>
            {['syllable', 'rhyme', 'cadence', 'energy'].map(key => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-20 text-xs capitalize text-slate-400">{key}</label>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={scores[key]}
                  onChange={e => setScores({...scores, [key]: parseFloat(e.target.value)})}
                  className="flex-1 h-1.5 accent-cyan-400"
                />
                <span className="w-10 text-right text-xs font-mono">{Math.round(scores[key]*100)}</span>
              </div>
            ))}
            <button onClick={handleScore} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-3 rounded-xl text-sm active:scale-[0.98]">
              LOCK THE SCORE
            </button>
          </div>
        )}

        {result && !printMode && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/40 p-6 rounded-2xl text-center">
            <p className="text-xs font-mono text-purple-400">PERFORMANCE</p>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">{result.tier}</h2>
            <p className="text-4xl sm:text-5xl font-black my-3">{result.score}%</p>
            <p className="text-amber-400 font-bold text-sm">🪙 {result.rewards.rapCoins} RapCoins</p>
            <button onClick={() => setResult(null)} className="mt-4 text-xs text-slate-400 underline">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
}
