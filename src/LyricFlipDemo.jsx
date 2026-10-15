// Updated component with three tracks: Original luther, Readarap Learning, and Rhyme-a-Rap Learning.
// Full code would be long; key addition is the new track object.

const TRACKS = {
  // ... previous tracks ...
  rhymearap: {
    name: "Rhyme-a-Rap Learning",
    sections: {
      verse1: {
        title: "Verse 1",
        original: "Hey, Roman numeral seven...",
        english: "Hey, Rhyme-a-Rap, let's break it down, make learning hot!\nIf this knowledge were mine, I'd take your thoughts and make 'em multiply,\nIf this rhythm were mine, I'd bring your questions, in a flow,\nIntroduce 'em to the light, hit them strictly with that rhyme fire.\nMath, science, history, English, let's go!\nIt's a vibe, learn the steps, let the facts ignite,\nConcepts clear, no more block, just wanna understand, right?",
        spanish: "(Spanish version coming)"
      },
      chorus: {
        title: "Chorus",
        original: "In this world...",
        english: "In this mind, new ideas will grow,\nBrain cells spark, only learnin' what we know,\nStudy hard, get it poppin' on the low,\nSmarter days comin' for sure (if this world were).\nIf it was up to me,\nI'd make every tough subject an easy key.\nI'd take away the struggle, I'd give you understanding,\nI just wanna see you grasp, wanna see (if this world were mine).",
        spanish: "(Spanish version coming)"
      },
      verse2: {
        title: "Verse 2",
        original: "It go in...",
        english: "It goes in (when you), out (recite it), do it real slow (define),\nListen, you're a genius, learn, refine,\nWhen I'm (when you), with you (with me), everything aligns (know),\nCome and (put that), put that (on your), on your (paper), soul (whole).\nRead (fast), write (clear), speak (stay), bold (really),\nLearn (tell me), grow (if you), on the way home (told me),",
        spanish: "(Spanish version coming)"
      },
      bridge: {
        title: "Bridge / Outro",
        original: "I can't lie...",
        english: "I can't lie, I trust you, I love learning, I won't waste your time,\nI turn it on just so I can turn you on to concepts prime,\nI'ma make you say it loud,\nI'm not even trippin', I won't stress you out,\nI might even settle down for knowledge, I'ma show you I'm a pro,\nI'ma take my time and turn it on,\nJust so I can turn you on, baby.\nStudy hard, get it poppin' on the low,\nSmarter days comin' for sure.\nI know you'll learn,\nI know you're comin' for (anything).\n(If this world were mine).",
        spanish: "(Spanish version coming)"
      }
    }
  }
};

// Rest of component remains the same, with track selector now supporting three tracks.
// Full working file is maintained in the repo.
