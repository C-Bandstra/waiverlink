import React, { createContext, useContext } from "react";
import type { Seed } from "../seed/seeds";

const SeedContext = createContext<Seed | null>(null);

export const SeedProvider = ({
  seed,
  children,
}: {
  seed: Seed;
  children: React.ReactNode;
}) => {
  return <SeedContext.Provider value={seed}>{children}</SeedContext.Provider>;
};

export const useSeed = () => {
  const seed = useContext(SeedContext);
  if (!seed) throw new Error("useSeed must be used within a SeedProvider");
  return seed;
};
