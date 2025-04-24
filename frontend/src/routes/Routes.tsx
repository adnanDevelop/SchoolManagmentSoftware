// import { useAppSelector } from "@/redux/store";
import { Outlet, useRoutes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/utils/RootAuth";

import Layout from "@/components/layouts/Layout";

// Auth pages
import Login from "@/modules/auth/login/Login";
import ForgetPassword from "@/modules/auth/forgetPassword/ForgetPassword";

// Main Layout
import TeacherDashboard from "@/modules/dashboards/teacherDashboard/TeacherDashboard";

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
        {
          index: true,
          element: <TeacherDashboard />,
        },
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
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
      ],
    },
    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ]);
};
