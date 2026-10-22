import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, validateView, DEFAULT_VIEW } from '../web/model.mjs';
test('constant-speed example: doubled speed halves time, doubled distance doubles time', () => {
  assert.equal(calculate(DEFAULT_VIEW).seconds, 60);
  assert.equal(calculate({ ...DEFAULT_VIEW, speed: 1 }).seconds, 120);
  assert.equal(calculate({ ...DEFAULT_VIEW, distance: 240 }).seconds, 120);
});
test('invalid, non-finite, out-of-range and unknown viewing parameters fail', () => {
  for (const patch of [{ speed: 0 }, { distance: NaN }, { distance: 241 }, { speed: '2' }, { unknown: true }, { challengePhase: 'automatic' }]) assert.throws(() => validateView({ ...DEFAULT_VIEW, ...patch }));
});
