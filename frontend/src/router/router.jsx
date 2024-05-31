import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Login from "../pages/Login";
import Dashboard from "../layout/Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import MainPageHandler from "./MainPageHandler";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainPageHandler>
        <Main />
      </MainPageHandler>
    ),
    children: [
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoutes>
        <Dashboard />
      </PrivateRoutes>
    ),
  },
]);

export default router;
