"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type Currency = "USD" | "INR";

interface AppContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (usdPrice: number, inrPrice: number) => string;
  garage: string[];
  addToGarage: (id: string) => void;
  removeFromGarage: (id: string) => void;
  isInGarage: (id: string) => boolean;
  compareList: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [garage, setGarage] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  const { data: session, status } = useSession();

  // Load from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("carverse_currency") as Currency;
    if (savedCurrency === "USD" || savedCurrency === "INR") {
      setCurrencyState(savedCurrency);
    }

    const savedCompare = localStorage.getItem("carverse_compare");
    if (savedCompare) {
      try {
        setCompareList(JSON.parse(savedCompare));
      } catch (e) {
        console.error("Failed to parse compare list from localStorage", e);
      }
    }
  }, []);

  // Sync garage based on Auth Status
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/garage")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setGarage(data);
        })
        .catch((err) => console.error("Failed to fetch garage from DB", err));
    } else if (status === "unauthenticated") {
      const savedGarage = localStorage.getItem("carverse_garage");
      if (savedGarage) {
        try {
          setGarage(JSON.parse(savedGarage));
        } catch (e) {}
      }
    }
  }, [status]);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("carverse_currency", curr);
  };

  const formatPrice = (usd: number, inr: number) => {
    if (currency === "INR") {
      if (inr >= 10000000) {
        return `₹${(inr / 10000000).toFixed(2)} Crore`;
      }
      return `₹${(inr / 100000).toFixed(2)} Lakh`;
    } else {
      if (usd >= 1000000) {
        return `$${(usd / 1000000).toFixed(2)}M`;
      }
      return `$${(usd / 1000).toFixed(0)}k`;
    }
  };

  const addToGarage = (id: string) => {
    setGarage((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (status === "authenticated") {
        fetch("/api/garage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId: id }),
        }).catch((err) => console.error(err));
      } else {
        localStorage.setItem("carverse_garage", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeFromGarage = (id: string) => {
    setGarage((prev) => {
      const updated = prev.filter((item) => item !== id);
      if (status === "authenticated") {
        fetch(`/api/garage?vehicleId=${id}`, {
          method: "DELETE",
        }).catch((err) => console.error(err));
      } else {
        localStorage.setItem("carverse_garage", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const isInGarage = (id: string) => garage.includes(id);

  const addToCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 3) {
        // Limit to 3 vehicles maximum for side-by-side battle
        alert("You can compare up to 3 vehicles in the Battle Arena.");
        return prev;
      }
      const updated = [...prev, id];
      localStorage.setItem("carverse_compare", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => {
      const updated = prev.filter((item) => item !== id);
      localStorage.setItem("carverse_compare", JSON.stringify(updated));
      return updated;
    });
  };

  const isInCompare = (id: string) => compareList.includes(id);

  const clearCompare = () => {
    setCompareList([]);
    localStorage.setItem("carverse_compare", JSON.stringify([]));
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        garage,
        addToGarage,
        removeFromGarage,
        isInGarage,
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
