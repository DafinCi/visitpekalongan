import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatDistrict,
  formatPriceRange,
  formatRegency,
} from "../formatters.ts";
import type { PriceRange, Regency } from "../../../types/spot.ts";

describe("formatters utility", () => {
  describe("formatPriceRange", () => {
    it("formats murah_meriah as < Rp 15rb", () => {
      assert.equal(formatPriceRange("murah_meriah"), "< Rp 15rb");
    });

    it("formats terjangkau as Rp 15rb - 35rb", () => {
      assert.equal(formatPriceRange("terjangkau"), "Rp 15rb - 35rb");
    });

    it("formats kafe_spesial as > Rp 35rb", () => {
      assert.equal(formatPriceRange("kafe_spesial"), "> Rp 35rb");
    });

    it("falls back to Terjangkau for unexpected values", () => {
      assert.equal(formatPriceRange("unknown" as PriceRange), "Terjangkau");
    });
  });

  describe("formatRegency", () => {
    it("formats kota as Kota Pekalongan", () => {
      assert.equal(formatRegency("kota"), "Kota Pekalongan");
    });

    it("formats kabupaten as Kabupaten Pekalongan", () => {
      assert.equal(formatRegency("kabupaten"), "Kabupaten Pekalongan");
    });
  });

  describe("formatDistrict", () => {
    it("maps known district snake_case keys to formatted title strings", () => {
      assert.equal(formatDistrict("pekalongan_barat"), "Pekalongan Barat");
      assert.equal(formatDistrict("pekalongan_timur"), "Pekalongan Timur");
      assert.equal(formatDistrict("pekalongan_utara"), "Pekalongan Utara");
      assert.equal(formatDistrict("pekalongan_selatan"), "Pekalongan Selatan");
      assert.equal(formatDistrict("petungkriyono"), "Petungkriyono");
      assert.equal(formatDistrict("doro"), "Doro");
      assert.equal(formatDistrict("kajen"), "Kajen");
      assert.equal(formatDistrict("wiradesa"), "Wiradesa");
      assert.equal(formatDistrict("kedungwuni"), "Kedungwuni");
      assert.equal(formatDistrict("karanganyar"), "Karanganyar");
      assert.equal(formatDistrict("kesesi"), "Kesesi");
    });

    it("returns raw district string if not present in the dictionary", () => {
      assert.equal(formatDistrict("wonokerto"), "wonokerto");
      assert.equal(formatDistrict("paninggaran"), "paninggaran");
    });
  });
});

