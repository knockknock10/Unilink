import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, PlusCircle, User } from 'lucide-react';

const Navigation = () => {
  const menuItems = [
    { label: 'Feed', path: '/', Icon: LayoutDashboard },
    { label: 'Groups', path: '/groups', Icon: Users },
    { label: 'Create', path: '/create', Icon: PlusCircle },
    { label: 'Messages', path: '/messages', Icon: MessageSquare },
    { label: 'Profile', path: '/profile', Icon: User },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map(({ label, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `
            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[15px] tracking-wide
            ${isActive 
              ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
              : 'text-primary/70 hover:bg-white/60 hover:text-primary hover:scale-105'
            }
          `}
        >
          <Icon size={22} strokeWidth={2.5} />
          <span className="hidden lg:block">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
