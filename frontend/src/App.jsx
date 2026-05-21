import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/protected/Dashboard";
import Payments from "./pages/protected/payments";
import Home from "./pages/public/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        
        

        {/* Protected app */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}