import { useAppSelector } from "@/redux/store";
import { Outlet, useRoutes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "@/utils/RootAuth";

// Main Layout
import Layout from "@/components/layout/Layout";

// Auth pages
import Login from "@/modules//auth/login/Login";
import Register from "@/modules//auth/register/Register";

//Main Pages
import Task from "@/modules/task/Task";
import Team from "@/modules/team/Team";
import Dashboard from "@/modules/dashboard";
import Client from "@/modules/client/Client";
import Project from "@/modules/project/Project";
import NotFound from "@/modules//notFound/NotFound";
import TaskDetail from "@/modules/taskDetail/TaskDetail";
import ClientDetail from "@/modules/clientDetail/ClientDetail";
import ProjectDetail from "@/modules/projectDetail/ProjectDetail";

export const Routes = () => {
  const { user } = useAppSelector((state) => state.auth);

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
          element: <Dashboard />,
        },
        {
          path: "/project",
          element: <Project />,
        },
        {
          path: "/project/:id",
          element: <ProjectDetail />,
        },
        {
          path: "/task",
          element: <Task />,
        },
        {
          path: "/task/:id",
          element: <TaskDetail />,
        },
        ...(user.role !== "client"
          ? [
              {
                path: "/client",
                element: <Client />,
              },
            ]
          : []),
        ...(user.role !== "client"
          ? [
              {
                path: "/client/:id",
                element: <ClientDetail />,
              },
            ]
          : []),
        {
          path: "/user",
          element: <Team />,
        },
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
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};
