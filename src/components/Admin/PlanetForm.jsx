import { useState, useEffect } from 'react';
import planetApi from '../../apis/planetApi';
import gasApi from '../../apis/gasApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PlanetForm = ({ open, onOpenChange, planet, onSuccess }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [gases, setGases] = useState([]);

    // Initial State - matched with backend JSON structure
    const [formData, setFormData] = useState({
        nameEn: '',
        nameVi: '',
        planetId: '', // e.g., 'mercury'
        overview: '',
        shortDescription: '',
        type: 'Rocky',
        image2d: '',
        model3d: '',
        physical: {
            radiusKm: 0,
            massKg: '',
            gravity: 0,
            temperatureAvgC: 0,
            density: 0
        },
        orbit: {
            rotationPeriodHours: 0,
            orbitalPeriodDays: 0,
            distanceFromSunKm: 0,
            axialTiltDeg: 0,
            orderFromSun: 0
        },
        moons: [], // Array of { name: '', size: 0, distanceFromPlanet: 0 }
        gases: []  // Array of { gasId: '', percentage: 0 }
    });

    useEffect(() => {
        loadGases();
        if (planet) {
            // Populate form with existing planet data
            setFormData({
                ...formData,
                ...planet,
                physical: { ...formData.physical, ...planet.physical },
                orbit: { ...formData.orbit, ...planet.orbit },
                moons: planet.moons || [],
                gases: planet.gases ? planet.gases.map(g => ({ gasId: g.id, name: g.name, percentage: g.PlanetAtmosphere?.percentage || 0 })) : []
            });
        }
    }, [planet]);

    const loadGases = async () => {
        try {
            const response = await gasApi.getAll({ limit: 9999 });
            const { items } = response.data;
            setGases(items);
        } catch (error) {
            console.error('Failed to load gases', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Moons Management
    const addMoon = () => {
        setFormData(prev => ({
            ...prev,
            moons: [...prev.moons, { name: '', size: 0, distanceFromPlanet: 0 }]
        }));
    };

    const updateMoon = (index, field, value) => {
        const newMoons = [...formData.moons];
        newMoons[index][field] = value;
        setFormData(prev => ({ ...prev, moons: newMoons }));
    };

    const removeMoon = (index) => {
        const newMoons = formData.moons.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, moons: newMoons }));
    };

    // Atmosphere Management
    const addGas = () => {
        setFormData(prev => ({
            ...prev,
            gases: [...prev.gases, { gasId: '', percentage: 0 }]
        }));
    };

    const updateGas = (index, field, value) => {
        const newGases = [...formData.gases];
        newGases[index][field] = value;
        setFormData(prev => ({ ...prev, gases: newGases }));
    };

    const removeGas = (index) => {
        const newGases = formData.gases.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, gases: newGases }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (planet) {
                await planetApi.update(planet.id, formData);
            } else {
                await planetApi.create(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Submit error:', error);
            alert('Lỗi lưu dữ liệu: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Thông Tin Chung' },
        { id: 'physical', label: 'Vật Lý' },
        { id: 'orbit', label: 'Quỹ Đạo' },
        { id: 'moons', label: 'Mặt Trăng' },
        { id: 'atmosphere', label: 'Khí Quyển' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0f172a] border-indigo-500/20 text-white sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{planet ? 'Chỉnh Sửa Hành Tinh' : 'Thêm Hành Tinh Mới'}</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin chi tiết cho hành tinh. Tất cả các trường là bắt buộc.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 border-b border-indigo-500/20 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-transparent text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Tên (EN)</label>
                                <Input value={formData.nameEn} onChange={e => handleChange('nameEn', e.target.value)} className="bg-slate-900/50 border-slate-700" placeholder="e.g. Earth" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Tên (VI)</label>
                                <Input value={formData.nameVi} onChange={e => handleChange('nameVi', e.target.value)} className="bg-slate-900/50 border-slate-700" placeholder="e.g. Trái Đất" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Mã Hành Tinh (ID Slug)</label>
                                <Input value={formData.planetId} onChange={e => handleChange('planetId', e.target.value)} className="bg-slate-900/50 border-slate-700" placeholder="e.g. earth" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Thứ Tự Từ Mặt Trời</label>
                                <Input type="number" value={formData.orbit.orderFromSun} onChange={e => handleNestedChange('orbit', 'orderFromSun', parseInt(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Mô Tả Ngắn</label>
                                <Input
                                    value={formData.shortDescription}
                                    onChange={e => handleChange('shortDescription', e.target.value)}
                                    className="bg-slate-900/50 border-slate-700"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Tổng Quan (Overview)</label>
                                <Textarea
                                    value={formData.overview}
                                    onChange={e => handleChange('overview', e.target.value)}
                                    className="bg-slate-900/50 border-slate-700 min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Loại</label>
                                <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f172a] border-slate-700 text-white">
                                        <SelectItem value="Rocky">Hành Tinh Đá (Rocky)</SelectItem>
                                        <SelectItem value="Gas Giant">Khí Khổng Lồ (Gas Giant)</SelectItem>
                                        <SelectItem value="Ice Giant">Băng Khổng Lồ (Ice Giant)</SelectItem>
                                        <SelectItem value="Dwarf Planet">Hành Tinh Lùn (Dwarf)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Ảnh 2D</label>
                                <Tabs defaultValue="url" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                                        <TabsTrigger value="url">Link URL</TabsTrigger>
                                        <TabsTrigger value="upload">Upload Ảnh</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="url" className="space-y-2 mt-2">
                                        <Input
                                            value={formData.image2d}
                                            onChange={e => handleChange('image2d', e.target.value)}
                                            className="bg-slate-900/50 border-slate-700"
                                            placeholder="https://..."
                                        />
                                    </TabsContent>
                                    <TabsContent value="upload" className="space-y-2 mt-2">
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/30 hover:bg-slate-800/50 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                </div>
                                                <input
                                                    id="dropzone-file"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            // For now, we just create a local URL for preview
                                                            // In a real app, you'd upload this to Cloudinary here or on submit
                                                            const url = URL.createObjectURL(file);
                                                            handleChange('image2d', url);
                                                            // Store file if needed for upload logic later: handleChange('imageFile', file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {/* Preview Section */}
                                {formData.image2d && (
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-slate-400 mb-2 block">Preview:</label>
                                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-700 bg-black/40">
                                            <img
                                                src={formData.image2d}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/placeholder.png'; e.target.style.opacity = '0.5' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <label className="text-sm font-medium text-slate-300">Model 3D (.glb)</label>
                                <Tabs defaultValue="url" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                                        <TabsTrigger value="url">Link URL</TabsTrigger>
                                        <TabsTrigger value="upload">Upload Model</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="url" className="space-y-2 mt-2">
                                        <Input
                                            value={formData.model3d}
                                            onChange={e => handleChange('model3d', e.target.value)}
                                            className="bg-slate-900/50 border-slate-700"
                                            placeholder="https://.../model.glb"
                                        />
                                    </TabsContent>
                                    <TabsContent value="upload" className="space-y-2 mt-2">
                                        <div className="flex items-center justify-center w-full">
                                            <label htmlFor="dropzone-model" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/30 hover:bg-slate-800/50 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                    </svg>
                                                    <p className="text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-slate-500">.GLB, .GLTF (MAX. 50MB)</p>
                                                </div>
                                                <input
                                                    id="dropzone-model"
                                                    type="file"
                                                    className="hidden"
                                                    accept=".glb,.gltf"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            handleChange('model3d', url);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {/* Preview Section (Simple Text/Link for now to avoid crashes) */}
                                {formData.model3d && (
                                    <div className="mt-4 p-4 rounded-lg border border-indigo-500/30 bg-indigo-500/10 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium text-indigo-200">Model Selected</p>
                                            <p className="text-xs text-indigo-400 truncate w-full">{formData.model3d}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PHYSICAL TAB */}
                    {activeTab === 'physical' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Bán Kính (radiusKm)</label>
                                <Input type="number" value={formData.physical.radiusKm} onChange={e => handleNestedChange('physical', 'radiusKm', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Khối Lượng (massKg)</label>
                                <Input value={formData.physical.massKg} onChange={e => handleNestedChange('physical', 'massKg', e.target.value)} className="bg-slate-900/50 border-slate-700" placeholder="e.g. 5.972e24" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Trọng Lực (gravity - m/s²)</label>
                                <Input type="number" step="0.1" value={formData.physical.gravity} onChange={e => handleNestedChange('physical', 'gravity', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Mật Độ (density - g/cm³)</label>
                                <Input type="number" step="0.01" value={formData.physical.density} onChange={e => handleNestedChange('physical', 'density', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Nhiệt Độ TB (temperatureAvgC - °C)</label>
                                <Input type="number" value={formData.physical.temperatureAvgC} onChange={e => handleNestedChange('physical', 'temperatureAvgC', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                        </div>
                    )}

                    {/* ORBIT TAB */}
                    {activeTab === 'orbit' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">KC đến Mặt Trời (km)</label>
                                <Input type="number" value={formData.orbit.distanceFromSunKm} onChange={e => handleNestedChange('orbit', 'distanceFromSunKm', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Chu Kỳ Quay (Giờ)</label>
                                <Input type="number" step="0.1" value={formData.orbit.rotationPeriodHours} onChange={e => handleNestedChange('orbit', 'rotationPeriodHours', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Chu Kỳ Quỹ Đạo (Ngày)</label>
                                <Input type="number" step="0.1" value={formData.orbit.orbitalPeriodDays} onChange={e => handleNestedChange('orbit', 'orbitalPeriodDays', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Độ Nghiêng Trục (Độ)</label>
                                <Input type="number" step="0.01" value={formData.orbit.axialTiltDeg} onChange={e => handleNestedChange('orbit', 'axialTiltDeg', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700" />
                            </div>
                        </div>
                    )}

                    {/* MOONS TAB */}
                    {activeTab === 'moons' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-300">Danh Sách Mặt Trăng</label>
                                <Button size="sm" onClick={addMoon} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="h-4 w-4 mr-1" /> Thêm</Button>
                            </div>

                            {formData.moons.map((moon, index) => (
                                <div key={index} className="flex gap-2 items-end bg-slate-800/50 p-3 rounded-md border border-slate-700/50">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-slate-400">Tên</label>
                                        <Input value={moon.name} onChange={e => updateMoon(index, 'name', e.target.value)} className="bg-slate-900/50 border-slate-700 h-8" />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <label className="text-xs text-slate-400">Size (km)</label>
                                        <Input type="number" value={moon.size} onChange={e => updateMoon(index, 'size', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700 h-8" />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <label className="text-xs text-slate-400">Dist (km)</label>
                                        <Input type="number" value={moon.distanceFromPlanet} onChange={e => updateMoon(index, 'distanceFromPlanet', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700 h-8" />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeMoon(index)} className="hover:text-red-400 h-8 w-8 mb-[2px]">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {formData.moons.length === 0 && <div className="text-center text-slate-500 py-4 text-sm">Chưa có mặt trăng nào.</div>}
                        </div>
                    )}

                    {/* ATMOSPHERE TAB */}
                    {activeTab === 'atmosphere' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-300">Thành Phần Khí Quyển</label>
                                <Button size="sm" onClick={addGas} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="h-4 w-4 mr-1" /> Thêm</Button>
                            </div>

                            {formData.gases.map((gasEntry, index) => (
                                <div key={index} className="flex gap-2 items-end bg-slate-800/50 p-3 rounded-md border border-slate-700/50">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-slate-400">Loại Khí</label>
                                        <Select
                                            value={gasEntry.gasId.toString()}
                                            onValueChange={(val) => updateGas(index, 'gasId', parseInt(val))}
                                        >
                                            <SelectTrigger className="bg-slate-900/50 border-slate-700 h-8 text-white">
                                                <SelectValue placeholder="Chọn khí" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0f172a] border-slate-700 text-white">
                                                {gases.map(g => (
                                                    <SelectItem key={g.id} value={g.id.toString()}>
                                                        {g.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <label className="text-xs text-slate-400">Tỷ Lệ (%)</label>
                                        <Input type="number" min="0" max="100" step="0.01" value={gasEntry.percentage} onChange={e => updateGas(index, 'percentage', parseFloat(e.target.value))} className="bg-slate-900/50 border-slate-700 h-8" />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeGas(index)} className="hover:text-red-400 h-8 w-8 mb-[2px]">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {formData.gases.length === 0 && <div className="text-center text-slate-500 py-4 text-sm">Chưa có thông tin khí quyển.</div>}
                        </div>
                    )}

                </div>

                <DialogFooter className="mt-6 border-t border-indigo-500/20 pt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">Hủy</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]">
                        {loading ? 'Đang lưu...' : (planet ? 'Cập Nhật' : 'Tạo Mới')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PlanetForm;
