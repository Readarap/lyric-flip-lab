export function calculateReadarapScore(syllable, rhyme, cadence, factual = 1.0) {
  const W_SYLLABLE = 0.35;
  const W_RHYME = 0.25;
  const W_CADENCE = 0.30;
  const W_FACT = 0.10;

  const rawScore = (syllable * W_SYLLABLE) + (rhyme * W_RHYME) + (cadence * W_CADENCE) + (factual * W_FACT);
  const finalPercentage = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

  let tier = "", emoji = "";
  if (finalPercentage <= 50) { tier = "Baby Readarapper"; emoji = "🍼"; }
  else if (finalPercentage <= 75) { tier = "Little Readarapper"; emoji = "🎧"; }
  else if (finalPercentage <= 99) { tier = "Advanced Readarapper"; emoji = "🔥"; }
  else { tier = "Big Readarapper"; emoji = "👑"; }

  return {
    score: finalPercentage,
    tier: `${emoji} ${tier}`,
    rewards: { rapCoins: Math.round(finalPercentage * 1.5) }
  };
}
