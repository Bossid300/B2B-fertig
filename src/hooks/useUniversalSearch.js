// hooks/useUniversalSearch.js

import { getDistanceTo } from "../utils/searchFilters";
import { useState, useEffect, useMemo } from "react";
import {
  matchArtistFilters,
  matchLocationFilters,
  matchEquipmentFilters,
  matchCrewFilters
} from "../utils/searchFilters";

export const useUniversalSearch = () => {
  const [currentSector, setCurrentSector] = useState("artists");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    selectedGenre: "all",
    selectedType: "all",
    selectedBudget: "all",
    selectedPax: "all",
    selectedPower: "all",
    selectedCurfew: "all",
    selectedMaterialCategory: "all",
    selectedCaseType: "all",
    selectedMinQuantity: "all",
    selectedArea: "all",
    selectedRadius: "all",
    selectedCaseType: "all",
    selectedMinQuantity: "all",
    selectedCrewType: "all",
    selectedRate: "all",
    selectedSupport: "all", // "all" | "yes" | "no"
    selectedEventType: "all",
    selectedInstrument: "all",

    sortBy,
    setSortBy,

    onlyVerified: false

  });

  const [allProfiles, setAllProfiles] = useState([]);

  // 🔹 Daten laden
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("gigsda_users")) || [];
    const profiles = JSON.parse(localStorage.getItem("gigsda_profiles")) || [];

    const merged = users
      .map((user) => {
        const p =
          profiles.find(
            (p) =>
              p &&
              (p.id === user.id ||
                p.name?.toLowerCase() === user.name?.toLowerCase())
          ) || {};

        return {
          ...user,
          ...p,
          name: user.name || p.name,
          role: user.role || p.role || "Künstler",
          city: user.city || p.city || "",
          id: user.id
        };
      })
      .filter(Boolean);

    setAllProfiles(merged);
  }, []);

  // 🔹 Filterlogik (🔥 useMemo statt useEffect)
  const filteredResults = useMemo(() => {
    return allProfiles.filter((user) => {
      const role = (user.role || "").toLowerCase();

        // 🎤 ARTISTS
        if (currentSector === "artists" && role !== "künstler") return false;

        // 🏢 LOCATIONS
        if (currentSector === "locations" && role !== "location") return false;

        // 🎛️ EQUIPMENT
        if (
        currentSector === "equipment" &&
        !["material", "verleiher"].includes(role)
        )
        return false;

        // 🛠️ CREW & STAFF 🔥
        if (
        currentSector === "crew" &&
        ["künstler", "location", "material", "verleiher"].includes(role)
        )

        return false;

      switch (currentSector) {
        case "artists":
            return matchArtistFilters(user, {
            ...filters,
            searchQuery
            });

            case "locations":
            return matchLocationFilters(user, {
                ...filters,
                searchQuery,
                selectedPax: filters.selectedPax,
                powerSupply: filters.selectedPower,
                curfewTime: filters.selectedCurfew
            });

            case "equipment":
            return matchEquipmentFilters(
                user,
                filters.selectedMaterialCategory,
                filters.selectedCaseType,
                filters.selectedMinQuantity,
                searchQuery
            );

            case "crew":
            return matchCrewFilters(user, {
                ...filters,
                searchQuery
            });

          default:
          return true;
      }
    });

  // 🔥 SORTING
  if (sortBy === "priceLow") {
    results.sort((a, b) => (a.gage_min || 0) - (b.gage_min || 0));
  }

  if (sortBy === "priceHigh") {
    results.sort((a, b) => (b.gage_min || 0) - (a.gage_min || 0));
  }

  if (sortBy === "distance") {
    results.sort((a, b) => {
      const distA = getDistanceTo(a.city);
      const distB = getDistanceTo(b.city);
      return distA - distB;
    });
  }
  
  if (sortBy === "ranking") {
    results.sort((a, b) => {
      const scoreA = getArtistScore(a, { ...filters, searchQuery });
      const scoreB = getArtistScore(b, { ...filters, searchQuery });

      return scoreB - scoreA; // höher = besser
    });
  }

  return results;
}, [allProfiles, currentSector, filters, searchQuery, sortBy]);

  // 🔹 Reset
  const resetFilters = () => {
    setFilters({
    selectedGenre: "all",
    selectedType: "all",
    selectedBudget: "all",
    selectedPax: "all",
    selectedPower: "all",
    selectedCurfew: "all",
    selectedMaterialCategory: "all",
    selectedCaseType: "all",
    selectedMinQuantity: "all",
    selectedArea: "all",
    selectedRadius: "all",
    selectedCaseType: "all",
    selectedMinQuantity: "all",
    selectedCrewType: "all",
    selectedRate: "all",
    selectedSupport: "all", // "all" | "yes" | "no"
    selectedEventType: "all",

    onlyVerified: false

    });
  };

return {
  currentSector,
  setCurrentSector,
  filters,
  setFilters,
  filteredResults,
  resetFilters,
  searchQuery,
  setSearchQuery,

  sortBy,
  setSortBy // 🔥 DAS HAT GEFEHLT
};



};
