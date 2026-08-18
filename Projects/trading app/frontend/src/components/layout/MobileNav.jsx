import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Briefcase, Star, User } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
