import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./routing/ProtectedRoute";
import { useColorMode } from "./context/ColorModeContext";
import Login from "./components/Login";
import Home from "./components/Home";
import Invoice from "./components/Invoice";
import ShowMenu from "./components/ShowMenu";
import UpdateTax from "./components/UpdateTax";
import Stats from "./components/Stats";
import AddMenuItem from "./components/AddMenuItem";
import EditMenuItem from "./components/EditMenuItem";
import PrintInvoice from "./components/PrintInvoice";

const App = () => {
  const { mode } = useColorMode();

  return (
    // GitHub Pages serves static files with no server-side rewrites, so a
    // hard refresh or direct link on a BrowserRouter path (e.g. /invoice)
    // would 404. HashRouter keeps all client-side routing after a `#`,
    // which the server never sees.
    <HashRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme={mode}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={<ProtectedRoute component={Home} title="Dashboard" />}
        />
        <Route
          path="/tax"
          element={<ProtectedRoute component={UpdateTax} title="Tax Settings" />}
        />
        <Route
          path="/invoice"
          element={<ProtectedRoute component={Invoice} title="New Invoice" />}
        />
        <Route
          path="/menu"
          element={<ProtectedRoute component={ShowMenu} title="Menu" />}
        />
        <Route
          path="/addMenuItem"
          element={<ProtectedRoute component={AddMenuItem} title="Add Menu Item" />}
        />
        <Route
          path="/editMenuItem/:food_id"
          element={<ProtectedRoute component={EditMenuItem} title="Edit Menu Item" />}
        />
        <Route
          path="/printInvoice"
          element={<ProtectedRoute component={PrintInvoice} title="Invoice" />}
        />
        <Route
          path="/showStats"
          element={<ProtectedRoute component={Stats} title="Sales & Tax Stats" />}
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
