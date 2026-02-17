import Layout from "./components/layout/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { Toaster } from "react-hot-toast";
import { useAuthUser } from "./hooks/useAuthUser.js";

function App() {
  // useQuery when you want to fetch some data. in 'global state'
  const { data: authenticatedUser, isLoading } = useAuthUser();

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            authenticatedUser ? <Homepage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/signup"
          element={!authenticatedUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authenticatedUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
