// import { useAppSelector } from "@/redux/store";
import { Outlet, useRoutes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/utils/RootAuth";

import Layout from "@/components/layouts/Layout";

// Main Layout

// Auth pages

//Main Pages

// import { RootState } from "../redux/store";

export const Routes = () => {
  // const { user } = useAppSelector((state: RootState) => state.auth);

  return useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        // {
        //   index: true,
        //   element: <Dashboard />,
        // },
        // {
        //   path: "/project",
        //   element: <Project />,
        // },
      ],
    },
    {
      element: (
        <PublicRoute>
          <Outlet />
        </PublicRoute>
      ),
      children: [
        // {
        //   path: "login",
        //   element: <Login />,
        // },
        // {
        //   path: "register",
        //   element: <Register />,
        // },
      ],
    },
    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ]);
};
