import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMenu } from "../api/menu";
import { getCurrentTaxRate } from "../api/tax";
import { MenuItem, TaxRate } from "../types";

interface CatalogContextValue {
  menuItems: MenuItem[];
  taxRate: TaxRate;
  isLoading: boolean;
  refreshMenu: () => Promise<void>;
  refreshTaxRate: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

// Menu items and the tax rate are both "billing configuration" consumed by
// the same set of screens (Invoice, ShowMenu, AddMenuItem, EditMenuItem,
// UpdateTax), so one context replaces what used to be foodData/rates state
// lifted into App.jsx and drilled through every route's props.
export function CatalogProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth0();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [taxRate, setTaxRate] = useState<TaxRate>({ cgst: 0, sgst: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const refreshMenu = useCallback(async () => {
    setMenuItems(await getMenu());
  }, []);

  const refreshTaxRate = useCallback(async () => {
    setTaxRate(await getCurrentTaxRate());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    Promise.all([refreshMenu(), refreshTaxRate()]).finally(() => setIsLoading(false));
  }, [isAuthenticated, refreshMenu, refreshTaxRate]);

  const value = useMemo(
    () => ({ menuItems, taxRate, isLoading, refreshMenu, refreshTaxRate }),
    [menuItems, taxRate, isLoading, refreshMenu, refreshTaxRate]
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
