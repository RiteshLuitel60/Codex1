import assert from 'node:assert/strict';
import { calculateConfidence, detectConflict, scoreSource } from '../src/lib/source-ranking';

const topTier = scoreSource({
  baseCredibility: 0.95,
  recencyWeight: 0.9,
  officialSignal: 1,
  independentSignal: 0.8,
  transparencySignal: 0.9
});
assert.equal(topTier.tier, 'A');

const conflict = detectConflict(['Jane Doe', 'JANE DOE', 'John Roe']);
assert.equal(conflict.conflicting, true);

const confidence = calculateConfidence([0.95, 0.9], 0.1);
assert.equal(confidence, 0.825);

console.log('source-ranking tests passed');
