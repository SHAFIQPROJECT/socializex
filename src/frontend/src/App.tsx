import Layout from "@/components/Layout";
import AIPage from "@/pages/AIPage";
import AdminPage from "@/pages/AdminPage";
import ChatPage from "@/pages/ChatPage";
import ConversationPage from "@/pages/ConversationPage";
import ExplorePage from "@/pages/ExplorePage";
import FeedPage from "@/pages/FeedPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import NotificationsPage from "@/pages/NotificationsPage";
import ProfilePage from "@/pages/ProfilePage";
import ReelsPage from "@/pages/ReelsPage";
import SavedPage from "@/pages/SavedPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import { useAuthStore } from "@/stores/authStore";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

function requireAuth() {
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}

function requireAdmin() {
  const { isAuthenticated, user } = useAuthStore.getState();
  if (!isAuthenticated) throw redirect({ to: "/login" });
  if (!user?.isAdmin) throw redirect({ to: "/feed" });
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.015 280 / 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.20 0.02 280 / 0.4)",
            color: "oklch(0.96 0.005 280)",
          },
        }}
      />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: requireAuth,
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const feedRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/feed",
  component: FeedPage,
});
const exploreRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/explore",
  component: ExplorePage,
});
const reelsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/reels",
  component: ReelsPage,
});
const chatRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/chat",
  component: ChatPage,
});
const conversationRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/chat/$conversationId",
  component: ConversationPage,
});
const notificationsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/notifications",
  component: NotificationsPage,
});
const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile/$userId",
  component: ProfilePage,
});
const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/settings",
  component: SettingsPage,
});
const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/admin",
  beforeLoad: requireAdmin,
  component: AdminPage,
});
const searchRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/search",
  component: SearchPage,
});
const savedRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/saved",
  component: SavedPage,
});
const aiRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/ai",
  component: AIPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  protectedRoute.addChildren([
    feedRoute,
    exploreRoute,
    reelsRoute,
    chatRoute,
    conversationRoute,
    notificationsRoute,
    profileRoute,
    settingsRoute,
    adminRoute,
    searchRoute,
    savedRoute,
    aiRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
