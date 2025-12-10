import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  assessments: 'Assessments',
  interview: 'Interview Prep',
  analytics: 'Analytics',
  chat: 'AI Chat',
  admin: 'Admin',
  users: 'Users',
  questions: 'Questions',
  datasets: 'Datasets',
  settings: 'Settings',
  profile: 'Profile',
  setup: 'Setup',
  quiz: 'Quiz',
  results: 'Results',
  text: 'Text Mode',
  voice: 'Voice Mode',
  bot: 'Bot Mode',
  active: 'Active',
  history: 'History',
  report: 'Report',
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from path if items not provided
  const breadcrumbs = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            )}
            {isLast || !item.href ? (
              <span className={cn(
                'font-medium truncate max-w-[150px]',
                isLast ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              )}>
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="text-slate-500 dark:text-slate-400 hover:text-brand-purple transition-colors truncate max-w-[150px]"
              >
                {index === 0 ? (
                  <Home className="h-4 w-4" />
                ) : (
                  item.label
                )}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    
    // Skip numeric IDs in breadcrumbs
    if (/^\d+$/.test(segment)) continue;
    
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = i === segments.length - 1;
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  }
  
  return breadcrumbs;
}