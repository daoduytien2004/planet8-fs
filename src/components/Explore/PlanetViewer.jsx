import React, { useState, Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Component 3D Model - Fixed normalization + proper rotation
function Planet3DModel({ modelUrl, isRotating }) {
    const gltf = useGLTF(modelUrl);
    const groupRef = useRef(); // Wrapper group cho centering + rotation

    // Clone scene để tránh mutate original
    const scene = React.useMemo(() => gltf.scene.clone(), [gltf.scene]);

    useLayoutEffect(() => {
        if (!groupRef.current || !scene) return;

        // Traverse để đảm bảo all children đã load
        scene.traverse((child) => {
            if (child.isMesh) {
                child.geometry.computeBoundingBox();
            }
        });

        // Tính bounding box CHÍNH XÁC từ scene
        const box = new THREE.Box3().setFromObject(scene);

        // Kiểm tra box hợp lệ
        if (!box.isEmpty()) {
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Tính max dimension
            const maxDim = Math.max(size.x, size.y, size.z);

            // Scale để fit trong 3 units
            const targetSize = 3;
            const scale = maxDim > 0 ? targetSize / maxDim : 1;

            // Apply scale vào GROUP
            groupRef.current.scale.setScalar(scale);

            // Center model bằng cách offset scene
            scene.position.set(-center.x, -center.y, -center.z);
        }
    }, [scene]);

    // Xoay GROUP quanh trục Y (group đã centered, nên xoay đúng)
    useFrame((state, delta) => {
        if (isRotating && groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
}


const PlanetViewer = ({ planet }) => {
    const [isRotating, setIsRotating] = useState(false);
    const [viewMode, setViewMode] = useState('3d'); // '3d' hoặc '2d'

    if (!planet) {
        return (
            <div className="flex flex-col items-center justify-center p-12 z-[1] text-slate-500 text-xl">
                <p>Chọn một hành tinh để xem chi tiết</p>
            </div>
        );
    }

    const handleRotate = () => {
        setIsRotating(!isRotating);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === '3d' ? '2d' : '3d');
        // Tắt rotation khi chuyển sang 2D
        if (viewMode === '3d') {
            setIsRotating(false);
        }
    };

    // Kiểm tra có model 3D không
    const hasModel3D = planet.model3d && planet.model3d !== '';
    // Quyết định hiển thị 3D hay 2D dựa trên viewMode và availability
    const show3D = viewMode === '3d' && hasModel3D;

    return (
        <div className="flex flex-col items-center justify-center p-12 z-[1]">
            <div className="w-[450px] h-[450px] flex items-center justify-center mb-8 relative xl:w-[350px] xl:h-[350px]">
                {show3D ? (
                    // Render 3D Model
                    <Canvas
                        key={planet.id}
                        camera={{ position: [0, 0, 5], fov: 45 }}
                        gl={{
                            antialias: true,
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: 1.6
                        }}
                    >
                        {/* Advanced Lighting Setup */}

                        {/* Ambient: Ánh sáng tổng thể */}
                        <ambientLight intensity={1.2} />

                        {/* Hemisphere: Ánh sáng trời/đất tự nhiên */}
                        <hemisphereLight
                            color="#ffffff"      // Sky color
                            groundColor="#444444" // Ground color
                            intensity={0.8}
                        />

                        {/* Key Light: Mặt trời chính */}
                        <pointLight
                            position={[10, 10, 10]}
                            intensity={2.5}
                            color="#ffffff"
                            castShadow={false}
                        />

                        {/* Fill Light 1: Phản chiếu từ không gian */}
                        <pointLight
                            position={[-8, 5, -8]}
                            intensity={1.0}
                            color="#6699ff"
                        />

                        {/* Fill Light 2: Ánh sáng phụ */}
                        <pointLight
                            position={[0, -5, 5]}
                            intensity={0.6}
                            color="#ffeecc"
                        />

                        {/* Directional Light: Ánh sáng mặt trời đồng đều */}
                        <directionalLight
                            position={[5, 3, 5]}
                            intensity={0.8}
                            color="#ffffff"
                        />

                        {/* 3D Model với loading fallback */}
                        <Suspense fallback={null}>
                            <Planet3DModel
                                modelUrl={planet.model3d}
                                isRotating={isRotating}
                            />
                        </Suspense>

                        {/* Controls để xoay, zoom */}
                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            target={[0, 0, 0]}
                        />
                    </Canvas>
                ) : (
                    // Hiển thị ảnh 2D
                    <img
                        src={planet.image2d || '/planets/default.png'}
                        alt={planet.nameVi}
                        className={`w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-transform duration-300 ${isRotating ? 'animate-[rotate_20s_linear_infinite]' : ''}`}
                    />
                )}
            </div>
            <div className="flex gap-4">
                {/* Nút toggle giữa 3D và 2D - chỉ hiển thị nếu có model 3D */}
                {hasModel3D && (
                    <button className="px-6 py-3 bg-slate-800/80 border border-indigo-500/30 text-white rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-2 text-sm hover:bg-indigo-500/20 hover:border-indigo-500" onClick={toggleViewMode}>
                        {viewMode === '3d' ? 'Ảnh 2D' : 'Model 3D'}
                    </button>
                )}

                {/* Nút xoay - chỉ hiển thị khi đang ở chế độ 3D */}
                {show3D && (
                    <button className="px-6 py-3 bg-slate-800/80 border border-indigo-500/30 text-white rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-2 text-sm hover:bg-indigo-500/20 hover:border-indigo-500" onClick={handleRotate}>
                        {isRotating ? 'Dừng xoay' : 'Xoay 3D'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanetViewer;