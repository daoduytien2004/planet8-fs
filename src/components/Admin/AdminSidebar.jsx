import { useState } from 'react';
import { LayoutDashboard, Users, FileQuestion, LogOut, Globe, FlaskConical } from 'lucide-react';
import { cn } from "@/lib/utils";

const AdminSidebar = ({ activeView, setActiveView }) => {
    const menuItems = [
        { id: 'stats', label: 'Thống Kê', icon: LayoutDashboard },
        { id: 'users', label: 'Người Dùng', icon: Users },
        { id: 'planets', label: 'Quản Lý Hành Tinh', icon: Globe },
        { id: 'gases', label: 'Quản Lý Khí Quyển', icon: FlaskConical },
        { id: 'quizzes', label: 'Quản Lý Quiz', icon: FileQuestion },
    ];

    return (
        <aside className="w-64 bg-[#0f172a]/95 backdrop-blur-xl border-r border-indigo-500/20 h-full flex flex-col transition-all duration-300 md:w-20 lg:w-64 group relative overflow-hidden shadow-2xl">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

            <div className="flex flex-col gap-2 p-4 relative z-10">
                <div className="pb-4 mb-4 border-b border-indigo-500/10 md:hidden lg:block">
                    <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Main Menu</h3>
                </div>

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group-hover:justify-start md:justify-center lg:justify-start relative overflow-hidden",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-200 shadow-[0_4px_20px_rgba(99,102,241,0.2)] border border-indigo-500/30"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
                            <Icon className={cn("h-5 w-5", isActive ? "text-indigo-300" : "text-slate-500 group-hover:text-white")} />
                            <span className={cn(
                                "font-medium whitespace-nowrap transition-all duration-300 md:hidden lg:block",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                            )}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto p-4 border-t border-indigo-500/10 relative z-10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors md:justify-center lg:justify-start">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium md:hidden lg:block">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
