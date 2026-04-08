import React from 'react';
import { UserPlus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  if (!user) return null;
  const { name, email, avatar, _id } = user;
  return (
    <div className="glass-card p-4 flex items-center justify-between group hover:scale-[1.02] transition-all">
      <Link to={`/profile/${_id}`} className="flex items-center gap-3 w-full">
        <img 
          src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
          alt={name} 
          className="w-10 h-10 rounded-full border-2 border-primary group-hover:scale-110 transition-transform object-cover" 
        />
        <div className="overflow-hidden">
          <h4 className="font-bold text-primary text-sm truncate group-hover:text-accent transition-colors">{name}</h4>
          <p className="text-primary/60 text-xs truncate">{email}</p>
        </div>
      </Link>
      
      <div className="flex gap-1">
        <button className="p-2 text-zinc-400 hover:text-accent hover:bg-secondary/20 rounded-xl transition-all">
          <MessageCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
