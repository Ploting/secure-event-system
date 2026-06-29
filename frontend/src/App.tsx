import { RegisterPage } from './pages/RegisterPage';
import { Route, Routes } from "react-router-dom";
import { LoginPage } from './pages/LoginPage';
import { HealthCheckPage } from './pages/HealthCheckPage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HealthCheckPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
