import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Auth0Context, initialContext } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import Invoice from "../Invoice";
import { CatalogProvider } from "../../context/CatalogContext";
import { BillProvider } from "../../context/BillContext";
import { ConfirmDialogProvider } from "../../context/ConfirmDialogContext";
import * as menuApi from "../../api/menu";
import * as taxApi from "../../api/tax";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("../../api/menu");
jest.mock("../../api/tax");

const mockedGetMenu = menuApi.getMenu as jest.Mock;
const mockedGetCurrentTaxRate = taxApi.getCurrentTaxRate as jest.Mock;

function renderInvoice() {
  return render(
    <MemoryRouter>
      <Auth0Context.Provider value={{ ...initialContext, isAuthenticated: true }}>
        <ConfirmDialogProvider>
          <CatalogProvider>
            <BillProvider>
              <Invoice />
            </BillProvider>
          </CatalogProvider>
        </ConfirmDialogProvider>
      </Auth0Context.Provider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetMenu.mockResolvedValue([
    {
      id: 1,
      name: "Paneer Butter Masala",
      category: "Main Course",
      halfPrice: "120",
      fullPrice: "220",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
  ]);
  mockedGetCurrentTaxRate.mockResolvedValue({ cgst: 2.5, sgst: 2.5 });
});

describe("Invoice", () => {
  it("shows a validation error when adding with no fields filled", async () => {
    renderInvoice();

    await userEvent.click(screen.getByRole("button", { name: /add to order/i }));

    expect(toast.error).toHaveBeenCalledWith("Enter All Fields!");
  });

  it("adds a selected menu item to the preview table with the correct amount", async () => {
    renderInvoice();

    // Wait for the catalog to actually finish loading (the item select's
    // label itself flips from "Loading menu..." to "Item") rather than just
    // the API call having been made, since the state update lands a tick
    // after the promise resolves.
    await userEvent.click(await screen.findByLabelText("Item"));
    await userEvent.click(
      await screen.findByRole("option", { name: "Paneer Butter Masala" })
    );

    await userEvent.click(screen.getByLabelText("Full"));

    const quantityInput = screen.getByLabelText("Quantity");
    await userEvent.type(quantityInput, "2");

    await userEvent.click(screen.getByRole("button", { name: /add to order/i }));

    // 2 x fullPrice(220) = 440
    expect(await screen.findByText("Paneer Butter Masala (F)")).toBeInTheDocument();
    expect(screen.getByText("₹440")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Paneer Butter Masala added!");
  });
});
