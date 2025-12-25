import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import authService from '../services/authService';
import './AdminDashboard.css';

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
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Quản Lý Người Dùng
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Thống Kê
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="tab-content">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {loading ? (
                            <div className="loading">Đang tải dữ liệu...</div>
                        ) : (
                            <>
                                <div className="users-table-container">
                                    <table className="users-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên đăng nhập</th>
                                                <th>Email</th>
                                                <th>Vai trò</th>
                                                <th>Cấp độ</th>
                                                <th>Điểm kinh nghiệm</th>
                                                <th>Xác thực</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`role-badge ${user.role}`}>
                                                            {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                                        </span>
                                                    </td>
                                                    <td>{user.level || 1}</td>
                                                    <td>{user.totalXp || 0}</td>
                                                    <td>
                                                        <span className={`verify-badge ${user.isVerified ? 'verified' : ''}`}>
                                                            {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                        </span>
                                                    </td>
                                                    <td className="action-buttons">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="btn-edit"
                                                            disabled={user.id === currentUser.id}
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="btn-delete"
                                                            disabled={user.id === currentUser.id}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        Trang trước
                                    </button>
                                    <span className="page-info">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
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
                    <div className="tab-content">
                        {loading ? (
                            <div className="loading">Đang tải thống kê...</div>
                        ) : stats ? (
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="admin-stat-value">{stats.totalUsers}</div>
                                    <div className="admin-stat-label">Tổng số người dùng</div>
                                </div>
                                <div className="stat-card">
                                    <div className="admin-stat-value">{stats.adminCount}</div>
                                    <div className="admin-stat-label">Quản trị viên</div>
                                </div>
                                <div className="stat-card">
                                    <div className="admin-stat-value">{stats.userCount}</div>
                                    <div className="admin-stat-label">Người dùng thường</div>
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
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Chỉnh sửa: {selectedUser.username}</h2>
                        <div className="form-group">
                            <label>Vai trò:</label>
                            <select
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                className="form-select"
                            >
                                <option value="user">Người dùng</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={confirmEdit} className="btn-confirm">Lưu</button>
                            <button onClick={() => setShowEditModal(false)} className="btn-cancel">Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Xóa người dùng</h2>
                        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser.username}</strong>?</p>
                        <p className="warning-text">Hành động này không thể hoàn tác!</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete} className="btn-confirm-delete">Xóa</button>
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
