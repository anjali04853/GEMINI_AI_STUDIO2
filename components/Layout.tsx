import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bot,
  ClipboardCheck,
  BrainCircuit,
  BarChart2,
  ShieldAlert,
  Search,
  Bell,
  ChevronLeft,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Breadcrumb } from './Breadcrumb';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
  isCollapsed?: boolean;
  isAdmin?: boolean;
}

const NavItem = ({ to, icon: Icon, children, onClick, isCollapsed }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    end={to === "/dashboard" || to === "/dashboard/admin"}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
        isActive
          ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20 border-l-4 border-brand-pink pl-2"
          : "text-slate-600 dark:text-slate-300 hover:bg-brand-lavender dark:hover:bg-slate-700 hover:text-brand-purple"
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon 
          className={cn(
            "h-5 w-5 transition-colors flex-shrink-0", 
            isActive ? "text-white animate-pulse-glow" : "text-slate-500 dark:text-slate-400 group-hover:text-brand-purple"
          )} 
          aria-hidden="true" 
        />
        {!isCollapsed && <span className="truncate">{children}</span>}
        {isCollapsed && (
            <div className="absolute left-14 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap bg-slate-900 text-white dark:bg-slate-700">
                {children}
            </div>
        )}
      </>
    )}
  </NavLink>
);

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="min-h-screen flex font-sans bg-brand-offWhite dark:bg-slate-900 transition-colors duration-300">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-purple text-white rounded-md shadow-lg"
      >
        Skip to main content
      </a>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:static lg:flex lg:flex-col shadow-xl lg:shadow-none border-r",
        "bg-gradient-to-b from-brand-offWhite to-brand-lavender border-slate-200",
        "dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 dark:shadow-slate-900/50",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className="h-16 flex items-center px-4 border-b relative border-slate-100/50 dark:border-slate-700">
          <div className="flex items-center space-x-2 w-full overflow-hidden">
             <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 shadow-accent">
                <Bot className="h-5 w-5 text-white" />
             </div>
             {!isSidebarCollapsed && (
                <span className="text-xl font-bold tracking-tight animate-in fade-in duration-300 whitespace-nowrap text-slate-900 dark:text-white">
                   Skill<span className="text-brand-purple">Forge</span>
                </span>
             )}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden p-1 rounded hover:bg-opacity-10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Collapse Button (Desktop) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-accent text-white rounded-full items-center justify-center shadow-md hover:scale-110 transition-transform"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
             <ChevronLeft className={cn("h-4 w-4 transition-transform", isSidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1" aria-label="Main Navigation">
          <NavItem to="/dashboard" icon={LayoutDashboard} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Dashboard</NavItem>
          <NavItem to="/dashboard/assessments" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Assessments</NavItem>
          <NavItem to="/dashboard/interview" icon={BrainCircuit} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Interview Prep</NavItem>
          <NavItem to="/dashboard/analytics" icon={BarChart2} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Analytics</NavItem>
          <NavItem to="/dashboard/chat" icon={Bot} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>AI Chat</NavItem>
          
          {user?.role === 'admin' && (
            <>
              <div className={cn("pt-6 pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-opacity text-slate-400 dark:text-slate-500", isSidebarCollapsed && "opacity-0")}>
                 Admin
              </div>
              <div role="group" className="space-y-1">
                <NavItem to="/dashboard/admin" icon={ShieldAlert} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Admin Panel</NavItem>
                <NavItem to="/dashboard/admin/users" icon={UserIcon} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Users</NavItem>
                <NavItem to="/dashboard/admin/questions" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Questions</NavItem>
                <NavItem to="/dashboard/admin/datasets" icon={ClipboardCheck} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Datasets</NavItem>
                <NavItem to="/dashboard/admin/settings" icon={Settings} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>System</NavItem>
              </div>
            </>
          )}

          <div className={cn("pt-6 pb-2 px-3 text-xs font-bold uppercase tracking-wider transition-opacity text-slate-400 dark:text-slate-500", isSidebarCollapsed && "opacity-0")}>
             User
          </div>
          <div role="group" className="space-y-1">
            <NavItem to="/dashboard/profile" icon={UserIcon} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Profile</NavItem>
            <NavItem to="/dashboard/settings" icon={Settings} onClick={closeSidebar} isCollapsed={isSidebarCollapsed}>Settings</NavItem>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm">
          {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3 mb-4 px-1 overflow-hidden">
                    <div className="relative flex-shrink-0">
                        <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-accent p-[2px]">
                             <div className="h-full w-full rounded-full bg-slate-900/10 flex items-center justify-center">
                                 {user?.name.charAt(0)}
                             </div>
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-accent border-2 border-white dark:border-slate-800 rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs truncate text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    className="flex-1 justify-start h-9 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                  </Button>
                  <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title={`Theme: ${theme}`}
                  >
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </button>
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-9 w-9 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-accent cursor-pointer hover:scale-105 transition-transform" title={user?.name}>
                     {user?.name.charAt(0)}
                     <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-accent border-2 border-white dark:border-slate-800 rounded-full"></span>
                  </div>
                  <button onClick={toggleTheme} className="text-slate-400 dark:text-slate-500 hover:text-brand-purple transition-colors" title={`Theme: ${theme}`}>
                    {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  </button>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                      <LogOut className="h-5 w-5" />
                  </button>
              </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-0 relative transition-all duration-300">
        <header className="h-16 shadow-sm border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all duration-300 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700">
          <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple mr-4 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 transition-colors text-slate-400 dark:text-slate-500 group-focus-within:text-brand-purple" />
                  </div>
                  <input 
                      type="text"
                      placeholder="Search..." 
                      className="pl-10 pr-4 py-2 w-64 border-none rounded-full text-sm focus:ring-2 focus:ring-brand-purple/50 focus:w-80 transition-all duration-300 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-600"
                  />
              </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 rounded-full relative transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border border-white dark:border-slate-800"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-accent p-[2px] cursor-pointer hover:shadow-accent transition-shadow">
                  <div className="h-full w-full rounded-full flex items-center justify-center overflow-hidden bg-white dark:bg-slate-800">
                       <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
              </div>
          </div>
        </header>
        
        <div id="main-content" className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth bg-brand-offWhite dark:bg-slate-900 transition-colors duration-300">
          <Breadcrumb className="mb-4" />
          <Outlet />
        </div>
      </main>
    </div>
  );
};