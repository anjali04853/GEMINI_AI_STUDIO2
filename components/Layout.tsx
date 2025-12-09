import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bot,
  ClipboardCheck,
  BrainCircuit
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children?: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, children, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      )
    }
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </NavLink>
);

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Bot className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-lg font-bold text-slate-900">GeminiApp</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem to="/" icon={LayoutDashboard} onClick={closeSidebar}>Dashboard</NavItem>
          <NavItem to="/assessments" icon={ClipboardCheck} onClick={closeSidebar}>Assessments</NavItem>
          <NavItem to="/interview" icon={BrainCircuit} onClick={closeSidebar}>Interview Prep</NavItem>
          <NavItem to="/chat" icon={Bot} onClick={closeSidebar}>AI Chat</NavItem>
          <NavItem to="/profile" icon={UserIcon} onClick={closeSidebar}>Profile</NavItem>
          <NavItem to="/settings" icon={Settings} onClick={closeSidebar}>Settings</NavItem>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1"></div>
        </header>
        
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};