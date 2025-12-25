import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import planetService from '../../services/planetService';

function SolarSystem() {
    const mountRef = useRef(null);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        let animationId;
        let planetsArray = [];
        let planetMeshes = [];

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 50, 100);

        // Renderer với enhanced settings
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.8; // Tăng exposure cho sáng hơn
        renderer.shadowMap.enabled = true; // Enable shadows
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Post-processing for glowing sun
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Bloom pass - makes sun glow
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            2.5,   // Strength - càng cao càng chói
            0.6,   // Radius
            0.85   // Threshold - chỉ glow vật sáng (>0.85 brightness)
        );
        composer.addPass(bloomPass);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 20;
        controls.maxDistance = 500;
        controls.enablePan = false;
        controls.target.set(0, 0, 0);

        // Lighting - Tăng intensity cho planets sáng hơn
        const ambientLight = new THREE.AmbientLight(0xffffff, 3.5); // Tăng ambient
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 5, 800); // Tăng sun light
        sunLight.castShadow = true; // Enable shadows from sun
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            starsVertices.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(
            starsGeometry,
            new THREE.PointsMaterial({ color: 0xffffff, size: 1 })
        );
        scene.add(stars);

        // GLTF Loader
        const gltfLoader = new GLTFLoader();

        // Sun - Load GLB model
        let sun; // Declare variable for later use in animation

        gltfLoader.load(
            '/models/sun.glb',
            (gltf) => {
                console.log('✓ Loaded Sun GLB');
                const sunModel = gltf.scene;

                // Wrapper group for normalization
                const sunWrapper = new THREE.Group();

                // Calculate bounding box
                const box = new THREE.Box3().setFromObject(sunModel);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);

                // Scale to size 10
                const scale = maxDim > 0 ? 10 / maxDim : 1;
                sunWrapper.scale.setScalar(scale);

                // Center model
                sunModel.position.set(-center.x, -center.y, -center.z);

                // Add super bright emissive glow
                sunModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.emissive = new THREE.Color(0xffaa00);
                        child.material.emissiveIntensity = 2.1; // Rất sáng để trigger bloom
                    }
                });

                sunWrapper.add(sunModel);
                scene.add(sunWrapper);
                sun = sunWrapper;

                console.log('✓ Sun added to scene');
            },
            undefined,
            (error) => {
                console.error('✗ Failed to load Sun GLB:', error);
            }
        );

        // Fetch planets from database and load GLB models
        const loadPlanets = async () => {
            try {
                const planetsData = await planetService.getAll();
                setLoading(false);

                // Orbital data mapped by planet name (lowercase)
                const orbitalData = {
                    'mercury': { distance: 25, orbitSpeed: 0.004, size: 2.2 },
                    'venus': { distance: 38, orbitSpeed: 0.0015, size: 3.8 },
                    'earth': { distance: 50, orbitSpeed: 0.001, size: 3.8 },
                    'mars': { distance: 62, orbitSpeed: 0.0008, size: 3 },
                    'jupiter': { distance: 85, orbitSpeed: 0.0005, size: 9 },
                    'saturn': { distance: 110, orbitSpeed: 0.0003, size: 7.5 },
                    'uranus': { distance: 135, orbitSpeed: 0.0002, size: 5.2 },
                    'neptune': { distance: 160, orbitSpeed: 0.0001, size: 5.2 }
                };

                planetsData.forEach((planetData) => {
                    // Get planet name (lowercase)
                    const planetName = (planetData.nameEn || planetData.nameVi).toLowerCase();
                    const orbital = orbitalData[planetName];

                    if (!orbital) {
                        console.warn(`No orbital data for planet: ${planetName}`);
                        return;
                    }

                    console.log(`Processing planet: ${planetData.nameVi}, model: ${planetData.model3d}`);

                    // Only load if has GLB model
                    if (!planetData.model3d) {
                        console.warn(`⚠️ No GLB model for ${planetData.nameVi}, skipping`);
                        return;
                    }

                    // Function to create planet system
                    const createPlanetSystem = (planetMesh) => {
                        planetMesh.userData = {
                            name: planetData.nameEn?.toLowerCase() || planetData.nameVi.toLowerCase(),
                            planetId: planetData.planetId
                        };

                        const planetSystem = new THREE.Group();
                        const planetContainer = new THREE.Group();
                        planetContainer.add(planetMesh);
                        planetContainer.position.x = orbital.distance;
                        planetSystem.add(planetContainer);

                        // Orbit line
                        const orbitCurve = new THREE.EllipseCurve(0, 0, orbital.distance, orbital.distance);
                        const orbitPoints = orbitCurve.getPoints(100);
                        const orbitLine = new THREE.Line(
                            new THREE.BufferGeometry().setFromPoints(orbitPoints),
                            new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 })
                        );
                        orbitLine.rotation.x = Math.PI / 2;
                        scene.add(orbitLine);

                        scene.add(planetSystem);
                        planetsArray.push({
                            model: planetMesh,
                            planetContainer,
                            planetSystem,
                            ...orbital,
                            rotSpeed: 0.001,
                            data: planetData
                        });
                        planetMeshes.push(planetMesh);

                        console.log(`✓ Added planet: ${planetData.nameVi}`);
                    };

                    // Load GLB model
                    gltfLoader.load(
                        planetData.model3d,
                        (gltf) => {
                            console.log(`✓ Loaded GLB for ${planetData.nameVi}`);
                            const model = gltf.scene;

                            // Normalize model trong một wrapper group
                            const modelWrapper = new THREE.Group();

                            // Tính bounding box
                            const box = new THREE.Box3().setFromObject(model);
                            const size = box.getSize(new THREE.Vector3());
                            const center = box.getCenter(new THREE.Vector3());
                            const maxDim = Math.max(size.x, size.y, size.z);

                            // Scale wrapper
                            const scale = maxDim > 0 ? orbital.size / maxDim : 1;
                            modelWrapper.scale.setScalar(scale);

                            // Center model bằng cách offset trong wrapper
                            model.position.set(-center.x, -center.y, -center.z);

                            modelWrapper.add(model);

                            createPlanetSystem(modelWrapper);
                        },
                        undefined,
                        (error) => {
                            console.error(`✗ Failed to load GLB for ${planetData.nameVi}:`, error);
                        }
                    );
                });
            } catch (error) {
                console.error('Error fetching planets:', error);
                setLoading(false);
            }
        };

        loadPlanets();

        // Asteroid Belt
        const asteroidBelt = new THREE.Group();
        const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 1,
            metalness: 0.2
        });

        for (let i = 0; i < 1500; i++) {
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            const angle = Math.random() * Math.PI * 2;
            const distance = 68 + Math.random() * 12;
            const yOffset = (Math.random() - 0.5) * 3;

            asteroid.position.set(
                Math.cos(angle) * distance,
                yOffset,
                Math.sin(angle) * distance
            );

            const scale = 0.5 + Math.random() * 1.5;
            asteroid.scale.set(scale, scale, scale);

            asteroidBelt.add(asteroid);
        }
        scene.add(asteroidBelt);

        // Raycasting
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredPlanet = null;

        const onMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planetMeshes, true);

            if (hoveredPlanet) hoveredPlanet.scale.set(1, 1, 1);

            if (intersects.length > 0) {
                // Find root model
                let obj = intersects[0].object;
                while (obj.parent && !obj.userData.name) {
                    obj = obj.parent;
                }
                if (obj.userData.name) {
                    hoveredPlanet = obj;
                    hoveredPlanet.scale.set(1.2, 1.2, 1.2);
                    container.style.cursor = 'pointer';
                }
            } else {
                hoveredPlanet = null;
                container.style.cursor = 'default';
            }
        };

        const onClick = () => {
            if (hoveredPlanet) {
                setSelectedPlanet(hoveredPlanet.userData.name);
            }
        };

        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('click', onClick);

        // Animation
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            stars.rotation.y += 0.0001;
            if (sun) sun.rotation.y += 0.001; // Check if sun loaded
            asteroidBelt.rotation.y += 0.0004;

            planetsArray.forEach(({ model, planetContainer, planetSystem, orbitSpeed, rotSpeed }) => {
                if (planetSystem && orbitSpeed) {
                    planetSystem.rotation.y += orbitSpeed;
                }
                if (model && rotSpeed) {
                    model.rotation.y += rotSpeed;
                }
            });

            composer.render(); // Use composer for bloom effect
        };
        animate();

        // Resize
        const onResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height); // Update composer size too
        };
        window.addEventListener('resize', onResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onResize);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('click', onClick);

            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <>
            <div
                ref={mountRef}
                style={{
                    width: '100%',
                    height: '90vh'
                }}
            />
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '1.5rem',
                    zIndex: 3000
                }}>
                    Đang tải hệ Mặt Trời...
                </div>
            )}
            {selectedPlanet && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    zIndex: 2000
                }}>
                    {selectedPlanet.toUpperCase()}
                    <button
                        onClick={() => setSelectedPlanet(null)}
                        style={{
                            marginLeft: '15px',
                            background: '#4a90e2',
                            border: 'none',
                            color: 'white',
                            padding: '5px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}

export default SolarSystem;
