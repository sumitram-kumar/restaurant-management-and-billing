import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
