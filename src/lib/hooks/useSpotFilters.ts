import {
  parseAsBoolean,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs";
import { Regency } from "@/types/spot";

export function useSpotFilters() {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      history: "replace",
      shallow: true,
      throttleMs: 150,
    })
  );

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all").withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const [regency, setRegency] = useQueryState(
    "regency",
    parseAsStringEnum<Regency>(["kota", "kabupaten"]).withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const [openNow, setOpenNow] = useQueryState(
    "openNow",
    parseAsBoolean.withDefault(false).withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const [savedOnly, setSavedOnly] = useQueryState(
    "saved",
    parseAsBoolean.withDefault(false).withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const [view, setView] = useQueryState(
    "view",
    parseAsStringEnum<"grid" | "list" | "map">(["grid", "list", "map"]).withDefault("grid").withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const [selectedSpotSlug, setSelectedSpotSlug] = useQueryState(
    "spot",
    parseAsString.withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const resetAllFilters = () => {
    setQ("");
    setCategory("all");
    setRegency(null);
    setOpenNow(false);
    setSavedOnly(false);
    setSelectedSpotSlug(null);
  };

  return {
    q,
    setQ,
    category,
    setCategory,
    regency,
    setRegency,
    openNow,
    setOpenNow,
    savedOnly,
    setSavedOnly,
    view,
    setView,
    selectedSpotSlug,
    setSelectedSpotSlug,
    resetAllFilters,
    isFiltered:
      q !== "" ||
      category !== "all" ||
      regency !== null ||
      openNow ||
      savedOnly,
  };
}
