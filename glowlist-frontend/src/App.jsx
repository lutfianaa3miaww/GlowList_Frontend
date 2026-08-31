import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Produk from "./pages/Produk";
import AddProduk from "./pages/AddProduk";
import EditProduk from "./pages/EditProduk";
import Kategori from "./pages/Kategori";
import Tentang from "./pages/Tentang";
import { Navigate } from "react-router-dom";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/Login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/Login" element={<Login />} />

      <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
      >
      <Route index element={<Home />} />
      <Route path="produk" element={<Produk />} />
      <Route path="produk/tambah" element={<AddProduk />} />
      <Route path="produk/edit/:id" element={<EditProduk />} />
      <Route path="kategori" element={<Kategori />} />
      <Route path="tentang" element={<Tentang />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
}