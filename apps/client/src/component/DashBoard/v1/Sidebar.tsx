"use client"
import React, { useState } from 'react';
import { Home, Code, Heart, Video, MessageSquare, User } from 'lucide-react';

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState('Home');

    const menuItems = [
        { icon: Home, label: 'Home' },
        { icon: Code, label: 'Projects' },
        { icon: Heart, label: 'Job Listings' },
        { icon: Video, label: 'Your Interviews' },
        { icon: MessageSquare, label: 'Your Chats' },
    ];

    return (
        <div className="flex flex-col justify-between max-h-screen w-70 bg-divBg text-white m-2 rounded-2xl my-5 ml-4 ">
            <nav className="flex flex-col gap-1 p-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.label;

                    return (
                        <button
                            key={item.label}
                            onClick={() => setActiveItem(item.label)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-zinc-800'
                                : 'hover:bg-zinc-800/50 hover:cursor-pointer'
                                }`}
                        >
                            <Icon size={20} className="text-white" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Profile */}
            <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <User size={24} className="text-zinc-900" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium hover:cursor-pointer">Adheesh Verma</span>
                        <span className="text-xs text-zinc-400">Developer</span>
                    </div>
                </div>
            </div>
        </div>
    );
}