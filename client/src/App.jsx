import { Route, Routes } from "react-router-dom";
import OpenRoute from "./components/core/auth/OpenRoute";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import CreatePage from "./pages/CreatePage";
// import UpdatePage from "./pages/UpdatePage";
import AllPages from "./pages/AllPages";
import UpdatePage from "./pages/UpdatePage";
import Page from "./pages/Page";

const App = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white text-black">
      <Routes>
        <Route
          path="/"
          element={
            <OpenRoute>
              <Home />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/pages/:id"
          element={
              <Page/>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/createPage"
            element={
              <PrivateRoute>
                <CreatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/editPage/:id"
            element={
              <PrivateRoute>
                <UpdatePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/pages"
            element={
              <PrivateRoute>
                <AllPages />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/privacy-policy" element={<Privacy />} />
      </Routes>
    </div>
  );
};

export default App;
