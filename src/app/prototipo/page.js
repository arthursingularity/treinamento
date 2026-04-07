'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { useState, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';

// ─── Station names (scene roots) ────────────────────────────────────
const STATION_NAMES = ['ESTACAO1', 'ESTACAO2', 'ESTACAO3', 'ESTACAO4'];
const HIGHLIGHT_COLOR = new THREE.Color('#FF8C00');
const MAINTENANCE_COLOR = new THREE.Color('#FFD60A');

// ─── Single COMPONENTE mesh ─────────────────────────────────────────
function ComponenteMesh({ node, isHighlighted, isFaded, isMaintenance, isWarning, enableComponentHover, onComponentHover, onComponentUnhover, onComponentClick }) {
  const meshRef = useRef();

  const originalMaterial = useMemo(() => {
    if (node.material) return node.material.clone();
    return new THREE.MeshStandardMaterial({ color: '#cccccc' });
  }, [node.material]);

  const highlightMaterial = useMemo(() => {
    const mat = originalMaterial.clone();
    mat.color = HIGHLIGHT_COLOR.clone();
    mat.emissive = new THREE.Color('#FF6A00');
    mat.emissiveIntensity = 0.3;
    return mat;
  }, [originalMaterial]);

  const maintenanceMaterial = useMemo(() => {
    const mat = originalMaterial.clone();
    mat.color = MAINTENANCE_COLOR.clone();
    mat.emissive = new THREE.Color('#FFD60A');
    mat.emissiveIntensity = 0.15;
    return mat;
  }, [originalMaterial]);

  const fadedMaterial = useMemo(() => {
    const mat = originalMaterial.clone();
    mat.transparent = true;
    mat.opacity = 0.2;
    mat.depthWrite = false;
    return mat;
  }, [originalMaterial]);

  const warningMaterial = useMemo(() => {
    const mat = originalMaterial.clone();
    mat.color = new THREE.Color('#FF6363');
    mat.emissive = new THREE.Color('#FF6363');
    mat.emissiveIntensity = 0.15;
    return mat;
  }, [originalMaterial]);

  const activeMaterial = isFaded
    ? fadedMaterial
    : isHighlighted
      ? highlightMaterial
      : isMaintenance
        ? maintenanceMaterial
        : (isWarning && enableComponentHover) // user asked: only show red when its station is selected
          ? warningMaterial
          : originalMaterial;

  const handlePointerOver = useCallback((e) => {
    if (enableComponentHover) {
      e.stopPropagation();
      onComponentHover(node.name);
      document.body.style.cursor = 'pointer';
    }
  }, [enableComponentHover, onComponentHover, node.name]);

  const handlePointerOut = useCallback((e) => {
    if (enableComponentHover) {
      e.stopPropagation();
      onComponentUnhover();
      document.body.style.cursor = 'default';
    }
  }, [enableComponentHover, onComponentUnhover]);

  const handleClick = useCallback((e) => {
    if (enableComponentHover) {
      e.stopPropagation();
      // Pass geometry, material and the world matrix so the popup can position the mesh correctly
      const worldMatrix = new THREE.Matrix4();
      e.object.updateMatrixWorld(true);
      worldMatrix.copy(e.object.matrixWorld);
      onComponentClick({
        name: node.name,
        geometry: node.geometry,
        material: node.material,
        worldMatrix,
      });
    }
  }, [enableComponentHover, onComponentClick, node.name, node.geometry, node.material]);

  return (
    <mesh
      ref={meshRef}
      geometry={node.geometry}
      material={activeMaterial}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

// ─── ESTACAO group ──────────────────────────────────────────────────
function EstacaoGroup({
  stationNode,
  hoveredStation,
  setHoveredStation,
  hoveredComponent,
  setHoveredComponent,
  selectedStation,
  setSelectedStation,
  onComponentClick,
  isMaintenance,
}) {
  const stationName = stationNode.name;
  const isThisSelected = selectedStation === stationName;
  const isFaded =
    selectedStation !== null && selectedStation !== stationName;

  const children = useMemo(() => {
    const result = [];
    stationNode.traverse((child) => {
      if (child.isMesh && child.name.startsWith('COMPONENTE')) {
        result.push(child);
      }
    });
    return result;
  }, [stationNode]);

  // Station-level hover (only when NO station is selected)
  const handlePointerOver = useCallback(
    (e) => {
      if (!selectedStation) {
        e.stopPropagation();
        setHoveredStation(stationName);
        document.body.style.cursor = 'pointer';
      }
    },
    [stationName, setHoveredStation, selectedStation]
  );

  const handlePointerOut = useCallback(
    (e) => {
      if (!selectedStation) {
        e.stopPropagation();
        setHoveredStation(null);
        document.body.style.cursor = 'default';
      }
    },
    [setHoveredStation, selectedStation]
  );

  // Only select — never deselect by clicking the station
  const handleClick = useCallback(
    (e) => {
      if (!selectedStation) {
        e.stopPropagation();
        setSelectedStation(stationName);
      }
    },
    [stationName, setSelectedStation, selectedStation]
  );

  const onComponentHoverCb = useCallback((name) => {
    setHoveredComponent(name);
  }, [setHoveredComponent]);

  const onComponentUnhoverCb = useCallback(() => {
    setHoveredComponent(null);
  }, [setHoveredComponent]);

  return (
    <group
      position={stationNode.position}
      rotation={stationNode.rotation}
      scale={stationNode.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children.map((child, i) => {
        const isHighlighted = isThisSelected
          ? hoveredComponent === child.name
          : hoveredStation === stationName;
          
        const isWarning = (i * 3) % 7 === 0;

        return (
          <ComponenteMesh
            key={child.uuid}
            node={child}
            isHighlighted={isHighlighted}
            isFaded={isFaded}
            isMaintenance={isMaintenance}
            isWarning={isWarning}
            enableComponentHover={isThisSelected}
            onComponentHover={onComponentHoverCb}
            onComponentUnhover={onComponentUnhoverCb}
            onComponentClick={onComponentClick}
          />
        );
      })}
    </group>
  );
}

// ─── Full Model ─────────────────────────────────────────────────────
function TecnorModel({ selectedStation, setSelectedStation, onComponentClick, sceneRef, maintenanceStations, hoveredStation, setHoveredStation, hoveredComponent, setHoveredComponent, onSceneReady }) {
  const { scene } = useGLTF('/Tecnor.glb');

  // Expose scene ref for external lookups
  useMemo(() => {
    if (sceneRef) sceneRef.current = scene;
    if (onSceneReady) onSceneReady();
  }, [scene, sceneRef, onSceneReady]);

  const stations = useMemo(() => {
    return STATION_NAMES.map((name) => scene.getObjectByName(name)).filter(
      Boolean
    );
  }, [scene]);

  return (
    <Center>
      <group>
        {stations.map((stationNode) => (
          <EstacaoGroup
            key={stationNode.name}
            stationNode={stationNode}
            hoveredStation={hoveredStation}
            setHoveredStation={setHoveredStation}
            hoveredComponent={hoveredComponent}
            setHoveredComponent={setHoveredComponent}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            onComponentClick={onComponentClick}
            isMaintenance={maintenanceStations.has(stationNode.name)}
          />
        ))}
      </group>
    </Center>
  );
}

// ─── Stations Panel (LEFT) ────────────────────────────────────────────
function StationsPanel({ selectedStation, onSelectStation, onClose, maintenanceStations, onHoverStation }) {
  return (
    <div className="absolute top-4 left-4 bottom-4 w-[210px] z-20 rounded-[16px] bg-[rgba(28,28,30,0.7)] backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="text-[14px] font-semibold text-white">Estações</div>
        {selectedStation && (
          <button
            className="w-7 h-7 rounded-[8px] border-none bg-white/10 text-white/50 text-xs cursor-pointer flex items-center justify-center duration-200 hover:bg-white/20 hover:text-white/90"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-white/10" />

      {/* Station list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
        {STATION_NAMES.map((name, i) => {
          const isActive = selectedStation === name;
          const inMaint = maintenanceStations.has(name);
          const eff = 92 + (i * 2); // Dado fictício
          
          return (
            <button
              key={name}
              onClick={() => onSelectStation(name)}
              onMouseEnter={() => onHoverStation(name)}
              onMouseLeave={() => onHoverStation(null)}
              className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-[10px] mb-1.5 border-none cursor-pointer text-left ${
                isActive
                  ? 'bg-[#ff6600] shadow-[0_4px_16px_rgba(255,102,0,0.4)]'
                  : 'bg-transparent hover:bg-white/5'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-semibold ${isActive ? 'text-white' : 'text-white/90'}`}>
                  {name}
                </div>
                <div className={`text-[11px] font-medium mt-[2px] ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                  {inMaint ? 'Em Diagnóstico' : `Operacional • ${eff}%`}
                </div>
              </div>
              
              {inMaint ? (
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'bg-[#FFD60A] shadow-[0_0_8px_rgba(255,214,10,0.6)]'}`} />
              ) : (
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white/50' : 'bg-[#30D158]/50'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bottom Action Bar ──────────────────────────────────────────────
function BottomBar({ selectedStation, isMaintenance, onSetMaintenance, onSetAvailable }) {
  // Dado fictício baseado no nome da estação
  const technicians = ['Manutenção Solicitada'];
  const tech = selectedStation ? technicians[selectedStation.length % 4] : '';

  return (
    <div
      className={`
        absolute bottom-6 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-4 px-6 py-3.5
        rounded-[16px] bg-[rgba(28,28,30,0.85)]
        backdrop-blur-[40px] border border-white/10
        shadow-[0_12px_40px_rgba(0,0,0,0.6)]
        transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${selectedStation ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[20px] opacity-0 scale-95 pointer-events-none'}
      `}
    >
      <div className="flex flex-col mr-2">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-[2px]">Painel da Máquina</span>
        <span className="text-[14px] font-semibold text-white">
          {selectedStation}
        </span>
        {isMaintenance && <span className="text-[11px] font-medium text-[#FFD60A] mt-0.5">{tech}</span>}
      </div>

      <div className="w-px h-10 bg-white/10 mx-2" />

      <button
        onClick={onSetMaintenance}
        disabled={isMaintenance}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] border-none text-[13px] font-medium transition-all duration-200 ${
          isMaintenance
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-[#FFD60A] text-black cursor-pointer shadow-[0_2px_12px_rgba(255,214,10,0.3)] hover:brightness-110 active:scale-[0.97]'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${isMaintenance ? 'bg-white/20' : 'bg-black'}`} />
        Registrar Ocorrência
      </button>

      <button
        onClick={onSetAvailable}
        disabled={!isMaintenance}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] border-none text-[13px] font-medium transition-all duration-200 ${
          !isMaintenance
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-[#30D158] text-black cursor-pointer shadow-[0_2px_12px_rgba(48,209,88,0.3)] hover:brightness-110 active:scale-[0.97]'
        }`}
      >
        <span className={`w-2 h-2 rounded-full ${!isMaintenance ? 'bg-white/20' : 'bg-black'}`} />
        Retornar Operação
      </button>
    </div>
  );
}

// ─── Components Panel (RIGHT) ─────────────────────────────────────────
function ComponentsPanel({ selectedStation, componentNames, onComponentClick, onHoverComponent }) {
  return (
    <div
      className={`
        absolute top-4 right-4 bottom-4 w-[290px] z-20
        rounded-[16px] bg-[rgba(28,28,30,0.7)]
        backdrop-blur-[40px] border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.6)]
        flex flex-col overflow-hidden
        transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
        ${selectedStation ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1.5">
          {selectedStation} • Detalhamento
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-white">
            Componentes
          </span>
          <span className="bg-white/10 text-white/80 text-[11px] font-bold px-2 py-0.5 rounded-[6px]">
            {componentNames.length} Itens
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-white/10" />

      {/* Component list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
        {componentNames.map((name, i) => {
          const isWarning = (i * 3) % 7 === 0; // Fake alert
          return (
            <button
              key={name}
              onClick={() => onComponentClick(name)}
              onMouseEnter={() => onHoverComponent(name)}
              onMouseLeave={() => onHoverComponent(null)}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-[10px] mb-1 bg-transparent border-none cursor-pointer text-left duration-200 hover:bg-white/5 group relative"
            >
              <div className={`w-[2px] h-[60%] absolute left-1 rounded-full transition-opacity ${isWarning ? 'bg-[#FF453A] opacity-100' : 'opacity-0'}`} />
              
              <span className={`w-8 h-8 rounded-[8px] text-[12px] font-bold flex items-center justify-center shrink-0 ml-1 ${isWarning ? 'bg-[#FF453A]/20 text-[#FF453A] group-hover:bg-[#FF453A]/30' : 'bg-white/5 text-white/60 group-hover:bg-white/10 group-hover:text-white'}`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-white/90 truncate">
                  {name}
                </div>
                <div className="text-[12px] text-white/40 font-medium font-mono mt-0.5">
                  {(Math.abs(name.split('').reduce((a,b)=>a+b.charCodeAt(0),0)) * 13).toString(16).toUpperCase().substring(0,4)}{(i*7+1).toString().padStart(3,'0')}
                </div>
              </div>
              
              {isWarning ? (
                <span className="text-[10px] font-bold text-[#FF453A] uppercase">Revisão</span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Auto-fit camera helper ─────────────────────────────────────────
function CameraFitter({ radius }) {
  const { camera } = useThree();
  const fitted = useRef(false);

  useMemo(() => {
    if (!fitted.current && radius > 0) {
      const dist = radius * 2.8;
      camera.position.set(dist * 0.7, dist * 0.5, dist * 0.7);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      fitted.current = true;
    }
  }, [radius, camera]);

  return null;
}

// ─── Component Popup ────────────────────────────────────────────────
function ComponentPopup({ componentData, onClose }) {
  if (!componentData) return null;

  const { centeredGeometry, boundRadius } = useMemo(() => {
    const geo = componentData.geometry.clone();
    if (componentData.worldMatrix) {
      geo.applyMatrix4(componentData.worldMatrix);
    }
    geo.computeBoundingSphere();
    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    geo.boundingBox.getCenter(center);
    geo.translate(-center.x, -center.y, -center.z);
    geo.computeBoundingSphere();
    return {
      centeredGeometry: geo,
      boundRadius: geo.boundingSphere?.radius || 1,
    };
  }, [componentData.geometry, componentData.worldMatrix]);

  const previewMaterial = useMemo(() => {
    if (componentData.material) {
      const mat = componentData.material.clone();
      // Emphasize metallic look for dark theme
      mat.roughness = 0.3;
      mat.metalness = 0.7;
      return mat;
    }
    return new THREE.MeshStandardMaterial({ color: '#888888', roughness: 0.3, metalness: 0.7 });
  }, [componentData.material]);

  // Fictitious IoT Telemetry
  const hash = componentData.name.length * (componentData.name.charCodeAt(0));
  const temp = 35 + (hash % 45);
  const rpm = 1200 + (hash * 13 % 1000);
  const health = 100 - (hash % 15);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0A0A0C]/70 backdrop-blur-[16px]" />

      {/* Card */}
      <div
        className="relative w-[500px] rounded-[18px] bg-[rgba(28,28,30,0.85)] backdrop-blur-[40px] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-[popIn_0.3s_cubic-bezier(0.25,0.8,0.25,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 relative z-10 border-b border-white/10 bg-white/5">
          <div>
            <div className="text-[10px] font-bold text-[#FF6600] tracking-widest uppercase mb-1">
              Análise de Componente
            </div>
            <div className="text-[18px] font-semibold text-white">
              {componentData.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[8px] border-none bg-white/10 text-white/70 text-sm cursor-pointer flex items-center justify-center duration-200 hover:bg-white/20 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* 3D Preview */}
        <div className="h-[360px] relative">
          <Canvas
            camera={{ position: [2, 1.5, 2], fov: 40, near: 0.001, far: 1000 }}
            className="w-full h-full bg-[#050505]"
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8A9AAB" />

            <CameraFitter radius={boundRadius} />

            <mesh geometry={centeredGeometry} material={previewMaterial} />

            <OrbitControls
              enableDamping
              dampingFactor={0.1}
              maxDistance={boundRadius * 8}
            />
          </Canvas>
          
          {/* Fictitious Live Tag */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-[#1C1C1E]/90 backdrop-blur-md px-2 py-1.5 rounded-[8px] border border-white/10 shadow-lg">
             <span className="text-[9px] font-medium text-white/80 uppercase tracking-widest">Use o mouse para inspecionar</span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-px bg-white/10">
           <div className="bg-[#1C1C1E] p-4 flex flex-col justify-center">
             <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Temp. Operacional</div>
             <div className="text-[16px] font-medium text-white flex items-baseline gap-1">
               {temp} <span className="text-[12px] text-white/40">°C</span>
             </div>
           </div>
           <div className="bg-[#1C1C1E] p-4 flex flex-col justify-center">
             <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Rotação Axial</div>
             <div className="text-[16px] font-medium text-white flex items-baseline gap-1">
               {rpm} <span className="text-[12px] text-white/40">RPM</span>
             </div>
           </div>
           <div className="bg-[#1C1C1E] p-4 flex flex-col justify-center">
             <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Integridade</div>
             <div className={`text-[16px] font-medium flex items-baseline gap-1 ${health < 90 ? 'text-[#FFD60A]' : 'text-[#30D158]'}`}>
               {health}% 
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────
export default function PrototipoPage() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [maintenanceStations, setMaintenanceStations] = useState(new Set());
  const [hoveredStation, setHoveredStation] = useState(null);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const sceneRef = useRef(null);

  const [sceneLoaded, setSceneLoaded] = useState(0);

  // Build component lists dynamically from the actual GLB scene
  const stationComponents = useMemo(() => {
    const scene = sceneRef.current;
    if (!scene) return {};
    const map = {};
    STATION_NAMES.forEach((stationName) => {
      const stationNode = scene.getObjectByName(stationName);
      if (!stationNode) { map[stationName] = []; return; }
      const components = [];
      stationNode.traverse((child) => {
        if (child.isMesh && child.name.startsWith('COMPONENTE')) {
          components.push(child.name);
        }
      });
      map[stationName] = components;
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneLoaded]);

  const currentComponents = selectedStation
    ? stationComponents[selectedStation] || []
    : [];

  // Click from 3D viewport
  const handle3DComponentClick = useCallback((data) => {
    setSelectedComponent(data);
  }, []);

  // Click from the right panel list — look up the mesh node from the scene
  const handlePanelComponentClick = useCallback((componentName) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const meshNode = scene.getObjectByName(componentName);
    if (!meshNode || !meshNode.isMesh) return;

    meshNode.updateMatrixWorld(true);
    const worldMatrix = new THREE.Matrix4().copy(meshNode.matrixWorld);

    setSelectedComponent({
      name: meshNode.name,
      geometry: meshNode.geometry,
      material: meshNode.material,
      worldMatrix,
    });
  }, []);

  const handleSceneReady = useCallback(() => {
    setSceneLoaded((v) => v + 1);
  }, []);

  const handleDeselect = useCallback(() => {
    setSelectedStation(null);
    setSelectedComponent(null);
    setHoveredStation(null);
    setHoveredComponent(null);
  }, []);

  const handleSetMaintenance = useCallback(() => {
    if (!selectedStation) return;
    setMaintenanceStations((prev) => new Set(prev).add(selectedStation));
  }, [selectedStation]);

  const handleSetAvailable = useCallback(() => {
    if (!selectedStation) return;
    setMaintenanceStations((prev) => {
      const next = new Set(prev);
      next.delete(selectedStation);
      return next;
    });
  }, [selectedStation]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0A0C] font-[Inter,SF_Pro_Display,-apple-system,sans-serif]">
      {/* Floating header */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full bg-[rgba(28,28,30,0.7)] backdrop-blur-[40px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 pointer-events-none select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#30D158] shadow-[0_0_8px_rgba(48,209,88,0.8)]" />
          <span className="text-[13px] font-semibold text-white tracking-wide">
            INDPACK - MONTAGEM 1
          </span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="text-[11px] font-medium text-white/50 font-mono tracking-wider">
          UPTIME: 99.98%
        </div>
      </div>

      {/* LEFT: Stations panel */}
      <StationsPanel
        selectedStation={selectedStation}
        onSelectStation={setSelectedStation}
        onClose={handleDeselect}
        maintenanceStations={maintenanceStations}
        onHoverStation={setHoveredStation}
      />

      {/* RIGHT: Components panel */}
      <ComponentsPanel
        selectedStation={selectedStation}
        componentNames={currentComponents}
        onComponentClick={handlePanelComponentClick}
        onHoverComponent={setHoveredComponent}
      />

      {/* Component popup */}
      <ComponentPopup
        componentData={selectedComponent}
        onClose={() => setSelectedComponent(null)}
      />

      {/* Bottom action bar */}
      <BottomBar
        selectedStation={selectedStation}
        isMaintenance={selectedStation ? maintenanceStations.has(selectedStation) : false}
        onSetMaintenance={handleSetMaintenance}
        onSetAvailable={handleSetAvailable}
      />

      {/* 3‑D viewport */}
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 3 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={handleDeselect}
      >
        <color attach="background" args={['#0A0A0C']} />
        <fog attach="fog" args={['#0A0A0C', 20, 60]} />

        {/* Lighting refined for dark theme */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-8, 10, -5]} intensity={0.5} color="#8A9AAB" />
        <hemisphereLight
          skyColor="#ffffff"
          groundColor="#000000"
          intensity={0.2}
        />

        {/* Model (auto-centered) */}
        <TecnorModel
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          onComponentClick={handle3DComponentClick}
          sceneRef={sceneRef}
          maintenanceStations={maintenanceStations}
          hoveredStation={hoveredStation}
          setHoveredStation={setHoveredStation}
          hoveredComponent={hoveredComponent}
          setHoveredComponent={setHoveredComponent}
          onSceneReady={handleSceneReady}
        />

        {/* Ground plane for subtle reflection / depth */}
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -3, 0]}
        >
          <planeGeometry args={[150, 150]} />
          <meshStandardMaterial color="#050505" roughness={0.6} metalness={0.2} />
        </mesh>

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}

// ─── Preload ────────────────────────────────────────────────────────
useGLTF.preload('/Tecnor.glb');
