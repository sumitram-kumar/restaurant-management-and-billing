import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Auth0Context, initialContext } from "@auth0/auth0-react";
import { toast } from "react-toastify";
import Invoice from "../Invoice";
import { CatalogProvider } from "../../context/CatalogContext";
import { BillProvider } from "../../context/BillContext";
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
        <CatalogProvider>
          <BillProvider>
            <Invoice />
          </BillProvider>
        </CatalogProvider>
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

    await userEvent.click(screen.getByRole("button", { name: /add \/ update/i }));

    expect(toast.error).toHaveBeenCalledWith("Enter All Fields!");
  });

  it("adds a selected menu item to the preview table with the correct amount", async () => {
    renderInvoice();

    // Wait for the catalog to load before interacting with the item select.
    await waitFor(() => expect(mockedGetMenu).toHaveBeenCalled());

    await userEvent.click(screen.getByLabelText("Item"));
    await userEvent.click(
      await screen.findByRole("option", { name: "Paneer Butter Masala" })
    );

    await userEvent.click(screen.getByLabelText("Full"));

    const quantityInput = screen.getByLabelText("Quantity");
    await userEvent.type(quantityInput, "2");

    await userEvent.click(screen.getByRole("button", { name: /add \/ update/i }));

    // 2 x fullPrice(220) = 440
    expect(await screen.findByText("Paneer Butter Masala(F)")).toBeInTheDocument();
    expect(screen.getByText("440")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Paneer Butter Masala added!");
  });
});
