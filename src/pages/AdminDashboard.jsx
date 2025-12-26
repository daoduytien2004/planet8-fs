import { useState, useEffect } from 'react';
import adminService from '../apis/adminApi';
import authService from '../apis/authApi';
import { showToast } from '../components/ui/Toast';
import QuizManager from '../components/Admin/QuizManager';
import PlanetManager from '../components/Admin/PlanetManager';
import GasManager from '../components/Admin/GasManager';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const AdminDashboard = () => {
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
            showToast('Không thể tải danh sách người dùng', 'error');
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
            showToast('Cập nhật thành công', 'success');
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            showToast('Cập nhật thất bại', 'error');
        }
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            await adminService.deleteUser(selectedUser.id);
            showToast('Xóa người dùng thành công', 'success');
            setShowDeleteModal(false);
            setSelectedUser(null);
            // Reload users after deletion
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast(error.response?.data?.message || 'Không thể xóa người dùng', 'error');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[90vh] bg-background relative flex flex-col overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-30 z-0 bg-[size:100px_100px] bg-[image:radial-gradient(1px_1px_at_50px_50px,white,transparent)]" />
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none z-0" />

            {/* Main Layout: Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden relative z-10">
                <AdminSidebar activeView={activeTab} setActiveView={setActiveTab} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
                    <div className="max-w-7xl mx-auto">

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-bold tracking-tight">Người Dùng</h2>
                                    <Input
                                        placeholder="Tìm kiếm người dùng..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>

                                {loading ? (
                                    <div className="text-center py-12 text-muted-foreground">Đang tải dữ liệu...</div>
                                ) : (
                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[80px]">ID</TableHead>
                                                    <TableHead>Tên đăng nhập</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead className="text-center">Vai trò</TableHead>
                                                    <TableHead className="text-center">Level</TableHead>
                                                    <TableHead className="text-center">XP</TableHead>
                                                    <TableHead className="text-center">Trạng thái</TableHead>
                                                    <TableHead className="text-right">Hành động</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map(user => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium">{user.id}</TableCell>
                                                        <TableCell>{user.username}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                                                }`}>
                                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">{user.level || 1}</TableCell>
                                                        <TableCell className="text-center">{user.totalXp || 0}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isVerified
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                }`}>
                                                                {user.isVerified ? 'Verified' : 'Unverified'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => handleEditUser(user)}
                                                                    disabled={user.id === currentUser.id}
                                                                >
                                                                    <Pencil className="h-4 w-4 text-blue-500" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    disabled={user.id === currentUser.id}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                                {/* Pagination */}
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Stats Tab */}
                        {activeTab === 'stats' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold tracking-tight">Thống Kê</h2>
                                {loading ? (
                                    <div className="text-center py-12 text-muted-foreground">Đang tải dữ liệu...</div>
                                ) : stats ? (
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Quản Trị Viên</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-purple-600">{stats.adminCount}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">Người Dùng Thường</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-blue-600">{stats.userCount}</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground">Không có dữ liệu thống kê</div>
                                )}
                            </div>
                        )}

                        {/* Quiz Manager Tab */}
                        {activeTab === 'quizzes' && (
                            <QuizManager />
                        )}

                        {/* Planet Manager Tab */}
                        {activeTab === 'planets' && (
                            <PlanetManager />
                        )}

                        {/* Gas Manager Tab */}
                        {activeTab === 'gases' && (
                            <GasManager />
                        )}

                    </div>
                </main >
            </div>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
                        <DialogDescription>
                            Thay đổi thông tin và quyền hạn của {selectedUser?.username}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm font-medium">Vai trò</label>
                                <Select
                                    value={selectedUser.role}
                                    onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                                >
                                    <SelectTrigger className="w-[180px] col-span-3">
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">Người dùng (User)</SelectItem>
                                        <SelectItem value="admin">Quản trị viên (Admin)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
                        <Button onClick={confirmEdit}>Lưu Tha Đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Xóa Người Dùng?</DialogTitle>
                        <DialogDescription>
                            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tài khoản <strong>{selectedUser?.username}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Xóa Luôn</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};


