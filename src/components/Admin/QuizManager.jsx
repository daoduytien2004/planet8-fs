import { useState, useEffect } from 'react';
import quizApi from '../../apis/quizApi';
import planetApi from '../../apis/planetApi';
import QuestionManager from './QuestionManager';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, FileQuestion, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const QuizManager = () => {
    const [planets, setPlanets] = useState([]);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'questions'

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        planetId: '',
        rewardXp: 50,
        minLevel: 1
    });

    useEffect(() => {
        loadPlanets();
    }, []);

    useEffect(() => {
        if (selectedPlanet) {
            loadQuizzes(selectedPlanet.id, currentPage);
        }
    }, [selectedPlanet, currentPage]);

    const loadPlanets = async () => {
        try {
            const data = await planetApi.getAll();
            setPlanets(data);
            if (data.length > 0 && !selectedPlanet) {
                setSelectedPlanet(data[0]);
            }
        } catch (error) {
            console.error('Error loading planets:', error);
        }
    };

    const loadQuizzes = async (planetId, page) => {
        setLoading(true);
        try {
            const response = await quizApi.getQuizzesByPlanet(planetId, page, itemsPerPage);
            // Handle both structure types (array vs object with items/pagination)
            if (Array.isArray(response)) {
                setQuizzes(response);
                setTotalPages(1);
            } else {
                setQuizzes(response.items || []);
                setTotalPages(response.pagination?.totalPages || 1);
            }
        } catch (error) {
            console.error('Error loading quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateQuiz = () => {
        setSelectedQuiz(null);
        setFormData({
            title: '',
            description: '',
            planetId: selectedPlanet?.id || '',
            rewardXp: 50,
            minLevel: 1
        });
        setShowQuizModal(true);
    };

    const handleEditQuiz = (quiz) => {
        setSelectedQuiz(quiz);
        setFormData({
            title: quiz.title,
            description: quiz.description,
            planetId: quiz.planetId,
            rewardXp: quiz.rewardXp,
            minLevel: quiz.minLevel
        });
        setShowQuizModal(true);
    };

    const handleDeleteQuiz = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa Quiz này không?')) {
            try {
                await quizApi.delete(id);
                loadQuizzes(selectedPlanet.id, currentPage);
            } catch (error) {
                console.error('Error deleting quiz:', error);
                alert('Xóa thất bại');
            }
        }
    };

    const handleManageQuestions = (quiz) => {
        setSelectedQuiz(quiz);
        setViewMode('questions');
    };

    const handleSaveQuiz = async () => {
        try {
            if (selectedQuiz) {
                await quizApi.update(selectedQuiz.id, formData);
            } else {
                await quizApi.create(formData);
            }
            setShowQuizModal(false);
            loadQuizzes(selectedPlanet.id, currentPage);
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Lưu thất bại');
        }
    };

    if (viewMode === 'questions' && selectedQuiz) {
        return (
            <QuestionManager
                quiz={selectedQuiz}
                onBack={() => setViewMode('list')}
            />
        );
    }

    return (
        <div className="bg-[#0f172a]/80 border border-indigo-500/20 rounded-[20px] p-8 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Quản Lý Quiz</h2>
                <Button onClick={handleCreateQuiz} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" /> Thêm Quiz Mới
                </Button>
            </div>

            {/* Planet Filter */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {planets.map(planet => (
                    <button
                        key={planet.id}
                        onClick={() => {
                            setSelectedPlanet(planet);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap text-sm font-medium ${selectedPlanet?.id === planet.id
                            ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-white'
                            }`}
                    >
                        {planet.nameVi}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Đang tải...</div>
            ) : (
                <>
                    <div className="rounded-md border border-indigo-500/20 bg-[#1e293b]/30">
                        <Table>
                            <TableHeader className="bg-slate-900/50">
                                <TableRow className="hover:bg-transparent border-indigo-500/10">
                                    <TableHead className="w-[80px] text-indigo-300">ID</TableHead>
                                    <TableHead className="text-indigo-300">Tiêu đề</TableHead>
                                    <TableHead className="text-indigo-300">Hành tinh</TableHead>
                                    <TableHead className="text-center text-indigo-300">Level</TableHead>
                                    <TableHead className="text-center text-indigo-300">XP</TableHead>
                                    <TableHead className="text-right text-indigo-300">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quizzes.map(quiz => (
                                    <TableRow key={quiz.id} className="hover:bg-indigo-500/5 border-indigo-500/10">
                                        <TableCell className="font-mono text-slate-500">#{quiz.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-white">{quiz.title}</div>
                                            <div className="text-xs text-slate-500 line-clamp-1">{quiz.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {planets.find(p => p.id === quiz.planetId)?.nameVi || 'Unknown'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center text-white">{quiz.minLevel}</TableCell>
                                        <TableCell className="text-center text-emerald-400 font-medium">{quiz.rewardXp}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleManageQuestions(quiz)} title="Câu hỏi">
                                                    <FileQuestion className="h-4 w-4 text-emerald-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEditQuiz(quiz)} title="Sửa">
                                                    <Pencil className="h-4 w-4 text-blue-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)} title="Xóa">
                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {quizzes.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                            Chưa có quiz nào cho hành tinh này
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="bg-transparent border-indigo-500/30 text-slate-300 hover:text-white hover:bg-indigo-500/20"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> Trước
                            </Button>
                            <span className="text-slate-400 text-sm">
                                Trang <span className="text-white font-medium">{currentPage}</span> / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="bg-transparent border-indigo-500/30 text-slate-300 hover:text-white hover:bg-indigo-500/20"
                            >
                                Sau <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
                <DialogContent className="bg-[#0f172a] border-indigo-500/20 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-white">{selectedQuiz ? 'Chỉnh Sửa Quiz' : 'Thêm Quiz Mới'}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {selectedQuiz ? 'Cập nhật thông tin cho bài kiểm tra này.' : 'Tạo một bài kiểm tra mới cho người dùng.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Tiêu đề</label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Nhập tên quiz..."
                                className="bg-slate-900/50 border-slate-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                placeholder="Mô tả nội dung..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Hành tinh</label>
                                <Select
                                    value={formData.planetId.toString()}
                                    onValueChange={(value) => setFormData({ ...formData, planetId: parseInt(value) })}
                                >
                                    <SelectTrigger className="w-full bg-slate-900/50 border-slate-700 text-white">
                                        <SelectValue placeholder="Chọn hành tinh" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-slate-700 text-white">
                                        {planets.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={p.image2d || p.image2D}
                                                        alt={p.name}
                                                        className="w-5 h-5 rounded-full object-cover"
                                                    />
                                                    <span>{p.nameVi}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Level Yêu Cầu</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={formData.minLevel}
                                    onChange={e => setFormData({ ...formData, minLevel: parseInt(e.target.value) })}
                                    className="bg-slate-900/50 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Phần thưởng XP</label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.rewardXp}
                                onChange={e => setFormData({ ...formData, rewardXp: parseInt(e.target.value) })}
                                className="bg-slate-900/50 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-white">Hủy</Button>
                        <Button onClick={handleSaveQuiz} className="bg-indigo-600 hover:bg-indigo-700">Lưu Thay Đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuizManager;
