import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, PlusCircle, User, Compass } from 'lucide-react';

const Navigation = () => {
  const menuItems = [
    { label: 'Feed', path: '/', Icon: LayoutDashboard },
    { label: 'Explore', path: '/groups', Icon: Compass },
    { label: 'Create', path: '/create', Icon: PlusCircle },
    { label: 'Messages', path: '/messages', Icon: MessageSquare },
    { label: 'Profile', path: '/profile', Icon: User },
  ];

  return (
    <nav className="flex flex-col gap-3 py-4">
      {menuItems.map(({ label, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-black text-[14px] uppercase tracking-widest
            ${isActive 
              ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-105' 
              : 'text-primary/60 hover:bg-white hover:text-primary hover:shadow-md active:scale-95'
            }
          `}
        >
          {({ isActive }) => (
            <>
              <Icon size={24} strokeWidth={isActive ? 3 : 2.5} className="shrink-0" />
              <span className="hidden lg:block whitespace-nowrap">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
