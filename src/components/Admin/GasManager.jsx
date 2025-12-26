import { useState, useEffect } from 'react';
import gasApi from '../../apis/gasApi';
import { showToast } from '../ui/Toast';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, FlaskConical } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const GasManager = () => {
    const [gases, setGases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGas, setSelectedGas] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    // Form state
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        loadGases();
    }, [page]);

    const loadGases = async () => {
        setLoading(true);
        try {
            // Controller returns paginated response
            const response = await gasApi.getAll({ page, limit });
            // Adjust based on your paginatedSuccess response structure
            // Assuming response structure: { items: [], meta: { totalPages, ... } } or similar
            // If response is the raw axios data, accessing data
            const { items, meta } = response.data;
            if (items) {
                setGases(items);
                setTotalPages(meta?.totalPages || 1);
            } else {
                // Fallback if structure varies
                setGases(response.rows || response);
                setTotalPages(Math.ceil((response.count || response.length) / limit));
            }

        } catch (error) {
            console.error('Error loading gases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedGas(null);
        setFormData({ name: '' });
        setIsDialogOpen(true);
    };

    const handleEdit = (gas) => {
        setSelectedGas(gas);
        setFormData({ name: gas.name });
        setIsDialogOpen(true);
    };

    const handleDelete = async (gas) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khí ${gas.name}?`)) {
            try {
                await gasApi.delete(gas.id);
                loadGases();
            } catch (error) {
                console.error('Error deleting gas:', error);
                showToast('Xóa thất bại', 'error');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedGas) {
                await gasApi.update(selectedGas.id, formData);
            } else {
                await gasApi.create(formData);
            }
            setIsDialogOpen(false);
            loadGases();
        } catch (error) {
            console.error('Submit error:', error);
            showToast('Lỗi lưu dữ liệu: ' + (error.response?.data?.message || error.message), 'error');
        }
    };

    const filteredGases = gases?.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0f172a]/80 border border-indigo-500/20 rounded-[20px] p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <FlaskConical className="h-6 w-6 text-indigo-400" />
                        Quản Lý Khí Quyển
                    </h2>
                    <p className="text-slate-400 text-sm">Danh sách các loại khí trong khí quyển các hành tinh.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-slate-900/50 border-slate-700 text-white"
                        />
                    </div>
                    <Button onClick={handleCreate} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Thêm Mới</span>
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Đang tải dữ liệu...</div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="rounded-md border border-indigo-500/20 bg-[#1e293b]/30 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="hover:bg-transparent border-indigo-500/10">
                                    <TableHead className="w-[80px] text-indigo-300">ID</TableHead>
                                    <TableHead className="text-indigo-300">Tên Khí</TableHead>
                                    <TableHead className="text-right text-indigo-300">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGases.map(gas => (
                                    <TableRow key={gas.id} className="hover:bg-indigo-500/5 border-indigo-500/10">
                                        <TableCell className="font-mono text-slate-500">#{gas.id}</TableCell>
                                        <TableCell className="font-medium text-white">{gas.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(gas)} className="hover:bg-blue-500/10 hover:text-blue-400 text-slate-400">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(gas)} className="hover:bg-red-500/10 hover:text-red-400 text-slate-400">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredGases.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                                            Chưa có dữ liệu khí.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            disabled={page === 1}
                            className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-slate-400">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={page === totalPages}
                            className="text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#0f172a] border-indigo-500/20 text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedGas ? 'Chỉnh Sửa Khí' : 'Thêm Khí Mới'}</DialogTitle>
                        <DialogDescription>
                            Nhập tên loại khí hóa học.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-slate-300">
                                Tên
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3 bg-slate-900/50 border-slate-700"
                                placeholder="Ví dụ: Oxygen, Nitrogen"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-400">Hủy</Button>
                        <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700">Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GasManager;
