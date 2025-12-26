import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import authService from '../services/authService';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const currentUser = authService.getUser();

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'stats') {
            loadStats();
        }
    }, [activeTab, currentPage]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers(currentPage, 10);
            if (response.success) {
                // Sort users by ID in ascending order
                const sortedUsers = [...response.data.items].sort((a, b) => a.id - b.id);
                setUsers(sortedUsers);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        setLoading(true);
        try {
            const statsData = await adminService.getUserStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser({ ...user });
        setShowEditModal(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmEdit = async () => {
        if (!selectedUser) return;

        try {
            const updateData = {
                role: selectedUser.role
            };
            await adminService.updateUser(selectedUser.id, updateData);
            alert('Cập nhật thành công');
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Cập nhật thất bại');
        }
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            await adminService.deleteUser(selectedUser.id);
            alert('Xóa người dùng thành công');
            setShowDeleteModal(false);
            setSelectedUser(null);
            // Reload users after deletion
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Không thể xóa người dùng');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-[90vh] bg-gradient-to-br from-[#0a0a25] to-[#1a1a3e] p-16 px-8 pb-8 relative overflow-x-hidden md:p-8 md:px-6">
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)]" />

            <div className="max-w-[1400px] mx-auto z-10 relative">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 justify-center md:flex-col">
                    <button
                        className={`px-8 py-4 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 backdrop-blur-md border ${activeTab === 'users'
                            ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)]'
                            : 'bg-slate-800/80 border-indigo-500/30 text-white/70 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-white hover:-translate-y-0.5'
                            }`}
                        onClick={() => setActiveTab('users')}
                    >
                        Quản Lý Người Dùng
                    </button>
                    <button
                        className={`px-8 py-4 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 backdrop-blur-md border ${activeTab === 'stats'
                            ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)]'
                            : 'bg-slate-800/80 border-indigo-500/30 text-white/70 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-white hover:-translate-y-0.5'
                            }`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Thống Kê
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-[#0f172a]/80 border border-indigo-500/20 rounded-[20px] p-8 backdrop-blur-md">
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-4 px-6 bg-[#1e293b]/60 border border-indigo-500/30 rounded-[10px] text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)] placeholder:text-white/40"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center text-slate-400 p-12 text-lg">Đang tải dữ liệu...</div>
                        ) : (
                            <>
                                <div className="overflow-x-auto mb-6">
                                    <table className="w-full border-collapse text-sm md:text-sm">
                                        <thead>
                                            <tr className="bg-[#1e293b]/50">
                                                <th className="p-4 text-left text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">ID</th>
                                                <th className="p-4 text-left text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Tên đăng nhập</th>
                                                <th className="p-4 text-left text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Email</th>
                                                <th className="p-4 text-center text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Vai trò</th>
                                                <th className="p-4 text-center text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Cấp độ</th>
                                                <th className="p-4 text-center text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Điểm kinh nghiệm</th>
                                                <th className="p-4 text-center text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Xác thực</th>
                                                <th className="p-4 text-center text-slate-400 font-semibold uppercase tracking-wider border-b-2 border-indigo-500/30">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.id} className="transition-all duration-200 hover:bg-indigo-500/5">
                                                    <td className="p-4 border-b border-indigo-500/10 text-white/90">{user.id}</td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-white/90">{user.username}</td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-white/90">{user.email}</td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-center">
                                                        <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                            ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                                                            : 'bg-slate-700/30 border border-slate-500/30 text-slate-300'
                                                            }`}>
                                                            {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-center text-white/90">{user.level || 1}</td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-center text-white/90">{user.totalXp || 0}</td>
                                                    <td className="p-4 border-b border-indigo-500/10 text-center">
                                                        <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold ${user.isVerified
                                                            ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                                                            : 'bg-red-500/20 border border-red-500/30 text-red-300'
                                                            }`}>
                                                            {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 border-b border-indigo-500/10">
                                                        <div className="flex justify-center gap-2 md:flex-col">
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                className="px-4 py-2 border border-indigo-500/30 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-[#1e293b]/60 text-white hover:bg-indigo-500/20 hover:border-indigo-500 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={user.id === currentUser.id}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="px-4 py-2 border border-indigo-500/30 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-[#1e293b]/60 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                                                                disabled={user.id === currentUser.id}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-6 py-3 bg-[#1e293b]/80 border border-indigo-500/30 rounded-[10px] text-white cursor-pointer transition-all duration-300 font-semibold hover:bg-indigo-500/20 hover:border-indigo-500 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[#1e293b]/80"
                                    >
                                        Trang trước
                                    </button>
                                    <span className="text-slate-400 font-semibold">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-6 py-3 bg-[#1e293b]/80 border border-indigo-500/30 rounded-[10px] text-white cursor-pointer transition-all duration-300 font-semibold hover:bg-indigo-500/20 hover:border-indigo-500 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[#1e293b]/80"
                                    >
                                        Trang sau
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <div className="bg-[#0f172a]/80 border border-indigo-500/20 rounded-[20px] p-8 backdrop-blur-md">
                        {loading ? (
                            <div className="text-center text-slate-400 p-12 text-lg">Đang tải thống kê...</div>
                        ) : stats ? (
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 md:grid-cols-1">
                                <div className="bg-[#1e293b]/50 border border-indigo-500/30 rounded-[20px] p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:border-indigo-500">
                                    <div className="text-6xl font-bold text-indigo-500 mb-2 md:text-5xl">{stats.totalUsers}</div>
                                    <div className="text-slate-400 text-base font-semibold">Tổng số người dùng</div>
                                </div>
                                <div className="bg-[#1e293b]/50 border border-indigo-500/30 rounded-[20px] p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:border-indigo-500">
                                    <div className="text-6xl font-bold text-indigo-500 mb-2 md:text-5xl">{stats.adminCount}</div>
                                    <div className="text-slate-400 text-base font-semibold">Quản trị viên</div>
                                </div>
                                <div className="bg-[#1e293b]/50 border border-indigo-500/30 rounded-[20px] p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:border-indigo-500">
                                    <div className="text-6xl font-bold text-indigo-500 mb-2 md:text-5xl">{stats.userCount}</div>
                                    <div className="text-slate-400 text-base font-semibold">Người dùng thường</div>
                                </div>
                            </div>
                        ) : (
                            <div>Không có dữ liệu thống kê</div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center z-[1000] backdrop-blur-[5px]" onClick={() => setShowEditModal(false)}>
                    <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0f172a] border border-indigo-500/30 rounded-[20px] p-8 max-w-[500px] w-[90%] shadow-[0_20px_60px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-white mb-6 text-2xl font-bold">Chỉnh sửa: {selectedUser.username}</h2>
                        <div className="mb-6">
                            <label className="block text-slate-400 mb-2 font-semibold text-sm">Vai trò:</label>
                            <select
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                className="w-full p-3 bg-[#1e293b]/60 border border-indigo-500/30 rounded-[10px] text-white text-base cursor-pointer transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                            >
                                <option value="user">Người dùng</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                        <div className="flex gap-4 justify-end mt-6">
                            <button onClick={confirmEdit} className="px-6 py-3 border border-indigo-500/30 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 text-base bg-indigo-500 text-white hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(99,102,241,0.4)]">Lưu</button>
                            <button onClick={() => setShowEditModal(false)} className="px-6 py-3 border border-indigo-500/30 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 text-base bg-transparent text-slate-400 hover:bg-indigo-500/10 hover:text-white hover:-translate-y-0.5">Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center z-[1000] backdrop-blur-[5px]" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-gradient-to-br from-[#1a1a3e] to-[#0f172a] border border-indigo-500/30 rounded-[20px] p-8 max-w-[500px] w-[90%] shadow-[0_20px_60px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-white mb-6 text-2xl font-bold">Xóa người dùng</h2>
                        <p className="text-slate-300 mb-4 leading-relaxed">Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser.username}</strong>?</p>
                        <p className="text-red-300 font-semibold">Hành động này không thể hoàn tác!</p>
                        <div className="flex gap-4 justify-end mt-6">
                            <button onClick={confirmDelete} className="px-6 py-3 border border-red-500/50 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 text-base bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:-translate-y-0.5">Xóa</button>
                            <button onClick={() => setShowDeleteModal(false)} className="px-6 py-3 border border-indigo-500/30 rounded-[10px] font-semibold cursor-pointer transition-all duration-300 text-base bg-transparent text-slate-400 hover:bg-indigo-500/10 hover:text-white hover:-translate-y-0.5">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
