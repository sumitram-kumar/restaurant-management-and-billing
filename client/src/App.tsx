import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/styles/App.css";
import { ProtectedRoute } from "./routing/ProtectedRoute";
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
  return (
    // GitHub Pages serves static files with no server-side rewrites, so a
    // hard refresh or direct link on a BrowserRouter path (e.g. /invoice)
    // would 404. HashRouter keeps all client-side routing after a `#`,
    // which the server never sees.
    <HashRouter>
      <div className="App">
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
          theme="dark"
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<ProtectedRoute component={Home} />} />
          <Route path="/tax" element={<ProtectedRoute component={UpdateTax} />} />
          <Route path="/invoice" element={<ProtectedRoute component={Invoice} />} />
          <Route path="/menu" element={<ProtectedRoute component={ShowMenu} />} />
          <Route
            path="/addMenuItem"
            element={<ProtectedRoute component={AddMenuItem} />}
          />
          <Route
            path="/editMenuItem/:food_id"
            element={<ProtectedRoute component={EditMenuItem} />}
          />
          <Route
            path="/printInvoice"
            element={<ProtectedRoute component={PrintInvoice} />}
          />
          <Route path="/showStats" element={<ProtectedRoute component={Stats} />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
