import React from 'react';
import { UserPlus, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  const { setActiveChat } = useChat();
  if (!user) return null;
  const { name, email, profilePic, _id } = user;
  return (
    <div className="glass-card p-4 flex items-center justify-between group hover:scale-[1.02] transition-all">
      <Link to={`/profile/${_id}`} className="flex items-center gap-3 w-full">
        <img 
          src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
          alt={name} 
          className="w-10 h-10 rounded-full border-2 border-primary group-hover:scale-110 transition-transform object-cover" 
        />
        <div className="overflow-hidden">
          <h4 className="font-bold text-ink text-sm truncate group-hover:text-primary transition-colors">{name}</h4>
          <p className="text-muted text-xs truncate">{email}</p>
        </div>
      </Link>
      
      <div className="flex gap-1">
            <button
              onClick={handleFollow}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                isFollowing 
                  ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' 
                  : 'bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110'
              }`}
            >
              {isFollowing ? <><UserMinus size={14} /> Unlink</> : <><UserPlus size={14} /> Link</>}
            </button>
      </div>
    </div>
  );
};

export default UserCard;
