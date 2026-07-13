import { RegisterPage } from "./pages/RegisterPage";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { EventsPage } from "./pages/EventPage/EventPage";
import { CreateEventPage } from "./pages/EventPage/CreateEventPage";
import { EventDetailPage } from "./pages/EventPage/EventDetailPage";
import { EditEventPage } from "./pages/EventPage/EditEventPage";
import "./App.css";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
