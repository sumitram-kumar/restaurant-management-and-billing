import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Bill, QuantityType } from "../types";

// A locally-priced line for the Invoice screen's running preview table only.
// unitPrice/amount here are for display while building the cart — the
// authoritative numbers are whatever the server returns from POST /api/bills,
// which is what actually gets persisted and printed.
export interface DraftLine {
  menuItemId: number;
  foodName: string;
  quantityType: QuantityType;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BillContextValue {
  draftLines: DraftLine[];
  addOrUpdateLine: (line: DraftLine) => void;
  removeLine: (index: number) => void;
  clearDraft: () => void;
  lastBill: Bill | null;
  setLastBill: (bill: Bill | null) => void;
}

const BillContext = createContext<BillContextValue | undefined>(undefined);

export function BillProvider({ children }: { children: ReactNode }) {
  const [draftLines, setDraftLines] = useState<DraftLine[]>([]);
  const [lastBill, setLastBill] = useState<Bill | null>(null);

  const addOrUpdateLine = (line: DraftLine) => {
    setDraftLines((current) => {
      const existingIndex = current.findIndex(
        (l) => l.menuItemId === line.menuItemId && l.quantityType === line.quantityType
      );
      if (existingIndex === -1) return [...current, line];
      const updated = [...current];
      updated[existingIndex] = line;
      return updated;
    });
  };

  const removeLine = (index: number) => {
    setDraftLines((current) => current.filter((_, i) => i !== index));
  };

  const clearDraft = () => setDraftLines([]);

  const value = useMemo(
    () => ({
      draftLines,
      addOrUpdateLine,
      removeLine,
      clearDraft,
      lastBill,
      setLastBill,
    }),
    [draftLines, lastBill]
  );

  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
}

export function useBillDraft() {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error("useBillDraft must be used within a BillProvider");
  }
  return context;
}
