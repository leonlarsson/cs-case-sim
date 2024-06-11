import { Howl, Howler } from "howler";
import { createContext } from "react";

const unboxVolume = 0.5;

const buttonHoverSound = new Howl({
  src: "/audio/buttonhover.mp3",
});

const buttonClickSound = new Howl({
  src: "/audio/buttonclick.mp3",
});

const itemHoverSound = new Howl({
  src: "/audio/itemhover.mp3",
});

const caseSelectSound = new Howl({
  src: "/audio/caseselect.mp3",
});

const buttonClickAlternativeSound = new Howl({
  src: "/audio/buttonclick2.mp3",
});

const milspecOpenSound = new Howl({
  src: "/audio/milspecopen.mp3",
  volume: unboxVolume,
});

const restrictedOpenSound = new Howl({
  src: "/audio/restrictedopen.mp3",
  volume: unboxVolume,
});

const classifiedOpenSound = new Howl({
  src: "/audio/classifiedopen.mp3",
  volume: unboxVolume,
});

const covertOpenSound = new Howl({
  src: "/audio/covertopen.mp3",
  volume: unboxVolume,
});

const goldOpenSound = new Howl({
  src: "/audio/goldopen.mp3",
  volume: unboxVolume,
});

const stopAllSounds = () => Howler.stop();

export const AudioContext = createContext({
  buttonHoverSound,
  buttonClickSound,
  itemHoverSound,
  caseSelectSound,
  buttonClickAlternativeSound,
  milspecOpenSound,
  restrictedOpenSound,
  classifiedOpenSound,
  covertOpenSound,
  goldOpenSound,
  stopAllSounds,
});
