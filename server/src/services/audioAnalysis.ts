import { EssentiaWASM } from 'essentia.js/dist/essentia.js-core.es';
import { Essentia } from 'essentia.js';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';

interface AudioAnalysis {
  key: string;
  scale: string;
  bpm: number;
  chords: {
    time: number;
    chord: string;
  }[];
  sections: {
    start: number;
    duration: number;
    confidence: number;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

let essentia: any = null;

const initEssentia = async () => {
  if (!essentia) {
    const EssentiaModule = await EssentiaWASM();
    essentia = new Essentia(EssentiaModule);
    logger.info('Essentia initialized successfully');
  }
  return essentia;
};

const determineKeyAndScale = (audioData: Float32Array) => {
  const keyExtractor = essentia.KeyExtractor(audioData);
  return {
    key: keyExtractor.key,
    scale: keyExtractor.scale
  };
};

const detectBPM = (audioData: Float32Array) => {
  const rhythm = essentia.RhythmExtractor2013(audioData);
  return Math.round(rhythm.bpm);
};

const detectChords = (audioData: Float32Array) => {
  const chordDetector = essentia.ChordsDetection(audioData);
  return chordDetector.chords.map((chord: string, index: number) => ({
    time: index * (1024 / 44100), // Convert frames to seconds
    chord
  }));
};

const detectSections = (audioData: Float32Array) => {
  const noveltyCurve = essentia.NoveltyCurve(audioData);
  const peaks = essentia.PeakDetection(noveltyCurve.novelty);
  
  return peaks.positions.map((pos: number, index: number) => ({
    start: pos * (1024 / 44100),
    duration: index < peaks.positions.length - 1 
      ? (peaks.positions[index + 1] - pos) * (1024 / 44100)
      : 5, // Default duration for last section
    confidence: peaks.amplitudes[index]
  }));
};

const determineDifficulty = (chords: { chord: string }[], bpm: number): 'beginner' | 'intermediate' | 'advanced' => {
  // Count unique chords
  const uniqueChords = new Set(chords.map(c => c.chord));
  
  // Basic difficulty heuristics
  if (uniqueChords.size <= 4 && bpm < 100) {
    return 'beginner';
  } else if (uniqueChords.size <= 8 && bpm < 130) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
};

export const analyzeSong = async (filePath: string): Promise<AudioAnalysis> => {
  try {
    await initEssentia();
    
    // Read audio file
    const audioBuffer = fs.readFileSync(filePath);
    const audioData = new Float32Array(audioBuffer.buffer);
    
    // Perform analysis
    const { key, scale } = determineKeyAndScale(audioData);
    const bpm = detectBPM(audioData);
    const chords = detectChords(audioData);
    const sections = detectSections(audioData);
    const difficulty = determineDifficulty(chords, bpm);
    
    return {
      key,
      scale,
      bpm,
      chords,
      sections,
      difficulty
    };
  } catch (error: any) {
    logger.error('Error analyzing audio:', error);
    throw new Error(`Failed to analyze audio: ${error.message}`);
  }
};
