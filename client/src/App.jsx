import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/home/HomePage.jsx";
import { ListingPage } from "./components/listing/ListingPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
