import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Auth0Context, initialContext } from "@auth0/auth0-react";
import { ColorModeProvider } from "../../context/ColorModeContext";
import { ProtectedRoute } from "../ProtectedRoute";

// withAuthenticationRequired reads Auth0Context directly (it doesn't go
// through the useAuth0 export in a way a module mock can intercept), so the
// real context provider is used here with a controlled value instead of
// mocking @auth0/auth0-react.
function renderWithAuthState(isAuthenticated: boolean) {
  function SecretPage() {
    return <div>secret content</div>;
  }

  return render(
    <MemoryRouter>
      <ColorModeProvider>
        <Auth0Context.Provider
          value={{
            ...initialContext,
            isAuthenticated,
            isLoading: false,
            loginWithRedirect: jest.fn(),
          }}
        >
          <ProtectedRoute component={SecretPage} title="Secret" />
        </Auth0Context.Provider>
      </ColorModeProvider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows the redirecting fallback and never renders the page when unauthenticated", () => {
    renderWithAuthState(false);

    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("renders the wrapped page once authenticated", () => {
    renderWithAuthState(true);

    expect(screen.getByText("secret content")).toBeInTheDocument();
    expect(screen.getByText("Secret")).toBeInTheDocument();
  });
});
