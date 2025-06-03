import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registros from "./pages/Registros";
import RegistroDetalhe from "./pages/RegistroDetalhe";
import NovoRegistro from "./components/NovoRegistro";

function App() {
  return (
    <Router>
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<Registros />} />
          <Route path="/registro/:id" element={<RegistroDetalhe />} />
          <Route path="/novo-registro" element={<NovoRegistro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
