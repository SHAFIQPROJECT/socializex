import UserAvatar from "@/components/ui/UserAvatar";
import { useAuthStore } from "@/stores/authStore";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  Bot,
  ChevronLeft,
  ChevronRight,
  Compass,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Play,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Reels", href: "/reels", icon: Play },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Saved", href: "/saved", icon: Bookmark },
  { label: "AI", href: "/ai", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

const MOBILE_NAV = NAV_ITEMS.slice(0, 5);

function NavLink({
  item,
  collapsed,
  isActive,
  badge,
}: {
  item: (typeof NAV_ITEMS)[number];
  collapsed: boolean;
  isActive: boolean;
  badge?: number;
}) {
  const Icon = item.icon;
  return (
    <Link to={item.href} data-ocid={`nav.${item.label.toLowerCase()}_link`}>
      <motion.div
        whileHover={{ scale: 1.02, x: collapsed ? 0 : 2 }}
        whileTap={{ scale: 0.97 }}
        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-neon cursor-pointer ${
          isActive
            ? "bg-primary/15 text-primary neon-glow-purple"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <Icon size={20} className="shrink-0" />
        {!collapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
        {badge !== undefined && badge > 0 && (
          <span className="absolute right-2 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-card fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-border/40 lg:flex"
        style={{ minWidth: collapsed ? 72 : 240 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-4">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary neon-glow-purple">
                <span className="text-sm font-bold">SX</span>
              </div>
              <span className="gradient-text text-lg font-bold">
                SocializeX
              </span>
            </motion.div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <span className="text-sm font-bold">SX</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-neon"
            data-ocid="nav.collapse_button"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Search shortcut */}
        {!collapsed && (
          <div className="px-3 pt-4">
            <Link to="/search" data-ocid="nav.search_link">
              <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-neon cursor-pointer">
                <Search size={14} />
                <span>Search...</span>
              </div>
            </Link>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={
                currentPath === item.href ||
                currentPath.startsWith(`${item.href}/`)
              }
            />
          ))}
        </nav>

        {/* User section */}
        {user && (
          <div className="border-t border-border/30 p-3">
            <Link
              to="/profile/$userId"
              params={{ userId: user.id.toString() }}
              data-ocid="nav.profile_link"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-3 rounded-xl p-2 hover:bg-muted/40 transition-neon cursor-pointer ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <UserAvatar
                  src={user.avatarUrl}
                  name={user.displayName}
                  online={true}
                  size="sm"
                />
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.displayName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                )}
              </motion.div>
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={() => logout()}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-neon"
                data-ocid="nav.logout_button"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            )}
          </div>
        )}
      </motion.aside>

      {/* Mobile header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-border/30 bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50"
            data-ocid="nav.mobile_menu_button"
          >
            <Menu size={20} />
          </button>
          <span className="gradient-text font-bold text-lg">SocializeX</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/search">
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50"
              data-ocid="nav.mobile_search_button"
            >
              <Search size={20} />
            </button>
          </Link>
          <Link to="/notifications">
            <button
              type="button"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50"
              data-ocid="nav.mobile_notif_button"
            >
              <Bell size={20} />
            </button>
          </Link>
          {user && (
            <Link to="/profile/$userId" params={{ userId: user.id.toString() }}>
              <UserAvatar
                src={user.avatarUrl}
                name={user.displayName}
                online={true}
                size="xs"
              />
            </Link>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col glass-card border-r border-border/40"
            >
              <div className="flex items-center justify-between border-b border-border/30 px-4 py-4">
                <span className="gradient-text text-lg font-bold">
                  SocializeX
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50"
                  data-ocid="nav.mobile_close_button"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    onKeyDown={(e) => e.key === "Enter" && setMobileOpen(false)}
                    className="w-full text-left"
                  >
                    <NavLink
                      item={item}
                      collapsed={false}
                      isActive={
                        currentPath === item.href ||
                        currentPath.startsWith(`${item.href}/`)
                      }
                    />
                  </button>
                ))}
              </nav>
              {user && (
                <div className="border-t border-border/30 p-4">
                  <Link
                    to="/profile/$userId"
                    params={{ userId: user.id.toString() }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/40">
                      <UserAvatar
                        src={user.avatarUrl}
                        name={user.displayName}
                        online={true}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:block min-h-screen flex-1"
      >
        <div className="min-h-screen">{children}</div>
      </motion.main>

      {/* Mobile main (no sidebar offset) */}
      <main className="min-h-screen w-full pt-16 pb-20 lg:hidden">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border/30 bg-background/80 px-2 py-2 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={`mobile_nav.${item.label.toLowerCase()}_link`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-neon ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon
                  size={22}
                  className={isActive ? "neon-glow-purple" : ""}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-dot"
                    className="h-1 w-1 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
