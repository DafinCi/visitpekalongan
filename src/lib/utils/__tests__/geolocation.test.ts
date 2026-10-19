import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDistanceKm,
  formatDistance,
  isWithinPekalonganRegion,
} from "../geolocation.ts";

describe("geolocation utility", () => {
  describe("calculateDistanceKm", () => {
    it("returns 0 km for identical coordinates", () => {
      const lat = -6.8886;
      const lng = 109.6753;
      const distance = calculateDistanceKm(lat, lng, lat, lng);
      assert.equal(distance, 0);
    });

    it("calculates symmetric distance between two points", () => {
      const alunalun = { lat: -6.8886, lng: 109.6753 };
      const curugBajing = { lat: -7.145, lng: 109.712 };

      const distAB = calculateDistanceKm(
        alunalun.lat,
        alunalun.lng,
        curugBajing.lat,
        curugBajing.lng
      );
      const distBA = calculateDistanceKm(
        curugBajing.lat,
        curugBajing.lng,
        alunalun.lat,
        alunalun.lng
      );

      assert.ok(distAB > 25 && distAB < 35);
      assert.equal(Math.round(distAB * 1000), Math.round(distBA * 1000));
    });

    it("matches expected Great-Circle distance for known landmarks", () => {
      // Pekalongan Barat to Pekalongan Timur (~4 km apart)
      const barat = { lat: -6.892, lng: 109.658 };
      const timur = { lat: -6.891, lng: 109.695 };
      const dist = calculateDistanceKm(barat.lat, barat.lng, timur.lat, timur.lng);

      assert.ok(dist >= 3.5 && dist <= 4.5);
    });
  });

  describe("formatDistance", () => {
    it("formats distances under 1 km in meters rounded to nearest 10m", () => {
      assert.equal(formatDistance(0.654), "650 m");
      assert.equal(formatDistance(0.082), "80 m");
      assert.equal(formatDistance(0.208), "210 m");
    });

    it("enforces minimum floor of 50 m for very close distances", () => {
      assert.equal(formatDistance(0.01), "50 m");
      assert.equal(formatDistance(0.04), "50 m");
    });

    it("formats distances between 1 km and 10 km with one decimal place", () => {
      assert.equal(formatDistance(1.0), "1.0 km");
      assert.equal(formatDistance(2.45), "2.5 km");
      assert.equal(formatDistance(7.82), "7.8 km");
    });

    it("formats distances of 10 km and above rounded to nearest whole kilometer", () => {
      assert.equal(formatDistance(10.2), "10 km");
      assert.equal(formatDistance(10.7), "11 km");
      assert.equal(formatDistance(26.4), "26 km");
      assert.equal(formatDistance(26.6), "27 km");
    });
  });

  describe("isWithinPekalonganRegion", () => {
    it("returns true for locations within Pekalongan City and Regency radius", () => {
      // Alun-alun Kota Pekalongan
      assert.equal(isWithinPekalonganRegion(-6.8886, 109.6753), true);
      // Petungkriyono highland
      assert.equal(isWithinPekalonganRegion(-7.1264, 109.6922), true);
      // Kajen (Regency capital)
      assert.equal(isWithinPekalonganRegion(-7.0315, 109.5828), true);
    });

    it("returns false for distant locations outside the 60 km bounding buffer", () => {
      // Semarang (~82 km away)
      assert.equal(isWithinPekalonganRegion(-6.9667, 110.4167), false);
      // Jakarta (~320 km away)
      assert.equal(isWithinPekalonganRegion(-6.2088, 106.8456), false);
      // Surabaya (~350 km away)
      assert.equal(isWithinPekalonganRegion(-7.2575, 112.7521), false);
    });
  });
});

