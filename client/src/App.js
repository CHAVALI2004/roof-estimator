import { useState } from "react";

import Estimator from "./Pages/Estimator";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  const [isAdmin, setIsAdmin] = useState(
    Boolean(localStorage.getItem("adminToken"))
  );

  const isAdminPage =
    window.location.pathname === "/admin";

  if (isAdminPage) {
    if (!isAdmin) {
      return (
        <AdminLogin
          onLogin={() => setIsAdmin(true)}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => setIsAdmin(false)}
      />
    );
  }

  return <Estimator />;
}

export default App;