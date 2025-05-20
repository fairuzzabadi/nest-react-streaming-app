import { createBrowserRouter } from "react-router-dom";
import { Dashboard, ErrorPage, Login, Signup } from "./pages";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import {
  EnterEmail,
  ResetPassword,
  SetNewPassword,
} from "./pages/forgot-password/components";
import {
  Explore,
  UsersVideos,
  Settings,
  Video,
} from "./pages/dashboard/components";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    children: [
      {
        path: "",
        element: <EnterEmail />,
      },
      {
        path: "2",
        element: <ResetPassword />,
      },
      {
        path: "3",
        element: <SetNewPassword />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <UsersVideos />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "/video/:id",
        element: <Video />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
