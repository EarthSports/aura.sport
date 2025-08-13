<!-- src/lib/components/AnatomyViewer.svelte -->
<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
    import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

    const dispatch = createEventDispatcher();
    let canvas: HTMLCanvasElement;
    let interactiveObjects: THREE.Object3D[] = [];

    export let showSkeleton = true;
    export let showMuscles = true;
    export let showFascia = true;
    export let showSkin = true;

    let skeletonGroup = new THREE.Group();
    let muscleGroup = new THREE.Group();
    let fasciaGroup = new THREE.Group();
    let skinGroup = new THREE.Group();

    $: if (skeletonGroup) skeletonGroup.visible = showSkeleton;
    $: if (muscleGroup) muscleGroup.visible = showMuscles;
    $: if (fasciaGroup) fasciaGroup.visible = showFascia;
    $: if (skinGroup) skinGroup.visible = showSkin;


    onMount(() => {
        if (!canvas) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(0, 0.5, 3);

        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            preserveDrawingBuffer: true,
        });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.setPixelRatio(window.devicePixelRatio);

        new RGBELoader()
            .setPath('https://threejs.org/examples/textures/equirectangular/')
            .load('studio_small_03_1k.hdr', function (texture) {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = new THREE.Color(0x374151);
                scene.environment = texture;
            });


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.8, 0);
        controls.enableDamping = true;

        const modelContainer = new THREE.Group();
        scene.add(modelContainer);

        modelContainer.add(skeletonGroup, muscleGroup, fasciaGroup, skinGroup);

        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            '/human-anatomy.glb',
            (gltf) => {
                const model = gltf.scene;
                
                model.traverse((child) => {
                    if (child.isMesh) {
                        const name = child.name.toLowerCase();
                        const meshClone = child.clone();
                        
                        if (meshClone.material) {
                            meshClone.material.metalness = 0.4;
                            meshClone.material.roughness = 0.5;
                        }

                        if (name.includes('muscle')) {
                            muscleGroup.add(meshClone);
                        } else if (name.includes('fascia')) {
                            fasciaGroup.add(meshClone);
                        } else if (name.includes('skin')) {
                             skinGroup.add(meshClone);
                        } else {
                            skeletonGroup.add(meshClone);
                        }
                        interactiveObjects.push(meshClone);
                    }
                });

                const box = new THREE.Box3().setFromObject(modelContainer);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                modelContainer.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 1.8 / maxDim;
                modelContainer.scale.set(scale, scale, scale);

                // --- FIX: Rotate the model to be upright by default ---
                modelContainer.rotation.x = -Math.PI / 2;

            },
            undefined,
            (error) => {
                console.error('An error happened while loading the model:', error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onCanvasClick = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(interactiveObjects, true);

            if (intersects.length > 0) {
                const firstIntersect = intersects[0].object;
                if (firstIntersect.visible) {
                    const partName = firstIntersect.name.replace(/_/g, ' ');
                    dispatch('partClick', partName);
                }
            }
        };
        canvas.addEventListener('click', onCanvasClick);

        const handleResize = () => {
            const container = canvas.parentElement;
            if (container && container.clientWidth > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);
        
        setTimeout(handleResize, 10);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', onCanvasClick);
        };
    });
</script>

<div class="w-full h-full">
    <canvas bind:this={canvas} class="w-full h-full rounded-lg cursor-pointer"></canvas>
</div>
