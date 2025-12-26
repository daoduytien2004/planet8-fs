import { useState, useEffect } from 'react';
import planetApi from '../../apis/planetApi';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PlanetForm from './PlanetForm';

const PlanetManager = () => {
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);

    useEffect(() => {
        loadPlanets();
    }, []);

    const loadPlanets = async () => {
        setLoading(true);
        try {
            const data = await planetApi.getAll();
            console.log(data)
            setPlanets(data);
        } catch (error) {
            console.error('Error loading planets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedPlanet(null);
        setShowFormModal(true);
    };

    const handleEdit = async (planet) => {
        try {
            // Fetch full details including nested data before editing
            const fullDetails = await planetApi.getById(planet.id);
            setSelectedPlanet(fullDetails);
            setShowFormModal(true);
        } catch (error) {
            console.error('Error fetching details:', error);
            alert('Không thể tải thông tin chi tiết');
        }
    };

    const handleDelete = async (planet) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa hành tinh ${planet.nameVi}?`)) {
            try {
                await planetApi.delete(planet.id);
                loadPlanets();
            } catch (error) {
                console.error('Error deleting planet:', error);
                alert('Xóa thất bại');
            }
        }
    };

    const handleFormSubmit = async () => {
        setShowFormModal(false);
        loadPlanets();
    };

    const filteredPlanets = planets.filter(p =>
        p.nameVi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0f172a]/80 border border-indigo-500/20 rounded-[20px] p-8 backdrop-blur-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Quản Lý Hành Tinh</h2>
                    <p className="text-slate-400 text-sm">Quản lý thông tin, vật lý và khí quyển của các hành tinh.</p>
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
                <div className="rounded-md border border-indigo-500/20 bg-[#1e293b]/30 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-900/50">
                            <TableRow className="hover:bg-transparent border-indigo-500/10">
                                <TableHead className="w-[80px] text-indigo-300">ID</TableHead>
                                <TableHead className="text-indigo-300">Hành Tinh</TableHead>
                                <TableHead className="text-indigo-300">Loại</TableHead>
                                <TableHead className="text-center text-indigo-300">Khoảng cách đến Mặt Trời (AU)</TableHead>
                                <TableHead className="text-center text-indigo-300">Mặt trăng</TableHead>
                                <TableHead className="text-right text-indigo-300">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPlanets.map(planet => (
                                <TableRow key={planet.id} className="hover:bg-indigo-500/5 border-indigo-500/10">
                                    <TableCell className="font-mono text-slate-500">#{planet.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={planet.image2d || '/placeholder.png'}
                                                    alt={planet.nameEn}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{planet.nameVi}</div>
                                                <div className="text-xs text-slate-500">{planet.nameEn}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-300">{planet.type || 'N/A'}</TableCell>
                                    <TableCell className="text-center text-slate-300">
                                        {planet.orbit?.distanceFromSunKm ? `${(planet.orbit.distanceFromSunKm / 1000000).toFixed(1)}M km` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-300">{planet.moons?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(planet)} className="hover:bg-blue-500/10 hover:text-blue-400 text-slate-400">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(planet)} className="hover:bg-red-500/10 hover:text-red-400 text-slate-400">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPlanets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                        Chưa có hành tinh nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {showFormModal && (
                <PlanetForm
                    open={showFormModal}
                    onOpenChange={setShowFormModal}
                    planet={selectedPlanet}
                    onSuccess={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default PlanetManager;
