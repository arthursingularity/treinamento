"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────
   Product Database — each product is stored in a location address
   Addresses match GLB collection names: 05D22N1 … 05D24N3
   ────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1, name: "CAIXA 601",              code: "MTR-001", cubo: "05D22N1", saldo: "1000", qtdporcx: "100" },
  { id: 2, name: "ESPELHO 501",            code: "ROL-002", cubo: "05D22N1", saldo: "150", qtdporcx: "30" },
  { id: 3, name: "CILINDRO 501 GORJE",     code: "COR-003", cubo: "05D22N2", saldo: "800", qtdporcx: "40" },
  { id: 4, name: "TAMBOR 1001",            code: "SEN-004", cubo: "05D22N2", saldo: "50", qtdporcx: "5" },
  { id: 5, name: "TAMBOR 1002",            code: "VLV-005", cubo: "05D22N3", saldo: "200", qtdporcx: "100" },
  { id: 6, name: "TAMPA 701/100",          code: "CIL-006", cubo: "05D22N3", saldo: "450", qtdporcx: "100" },
  { id: 7, name: "CAIXA 501",              code: "FUS-007", cubo: "05D23N1", saldo: "1200", qtdporcx: "60" },
  { id: 8, name: "ARRUELA FECHAMENTO 500", code: "CNT-008", cubo: "05D23N1", saldo: "5000", qtdporcx: "500" },
  { id: 9, name: "TAMBOR 1006",            code: "RLT-009", cubo: "05D23N2", saldo: "20", qtdporcx: "1" },
  { id: 10, name: "TAMBOR 1007",           code: "DJT-010", cubo: "05D23N2", saldo: "30", qtdporcx: "15" },
  { id: 11, name: "TAMBOR 1008",           code: "MNG-011", cubo: "05D23N3", saldo: "60", qtdporcx: "3" },
  { id: 12, name: "TAMBOR 1009",           code: "FLT-012", cubo: "05D23N3", saldo: "100", qtdporcx: "10" },
  { id: 13, name: "ROLAMENTO 6205",        code: "RLM-013", cubo: "05D24N1", saldo: "300", qtdporcx: "20" },
  { id: 14, name: "RETENTOR 50X72",        code: "RTN-014", cubo: "05D24N1", saldo: "500", qtdporcx: "100" },
  { id: 15, name: "CORREIA A-68",          code: "CRR-015", cubo: "05D24N2", saldo: "150", qtdporcx: "10" },
  { id: 16, name: "BUCHA BRONZE 25MM",     code: "BCH-016", cubo: "05D24N2", saldo: "800", qtdporcx: "40" },
  { id: 17, name: "ANEL O-RING 45MM",      code: "ANL-017", cubo: "05D24N3", saldo: "2000", qtdporcx: "100" },
  { id: 18, name: "GAXETA VEDAÇÃO 30MM",   code: "GXT-018", cubo: "05D24N3", saldo: "400", qtdporcx: "20" },
];

/* ──────────────────────────────────────────────
   Hook — detect mobile (only for JS-level decisions)
   ────────────────────────────────────────────── */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth <= breakpoint);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

/* ──────────────────────────────────────────────
   GLB Hierarchy:
   Scene
     ├─ 05D22N1  (group, 35 CB children)
     │    ├─ CB1..CB10   → pallet structure (always visible)
     │    ├─ CB11..CB35  → 25 box slots
     ├─ 05D22N2, 05D22N3, 05D23N1-N3, 05D24N1-N3 (same pattern)
     ├─ ESTRUTURA [mesh] (rack)
     └─ FLOOR [mesh]
   ────────────────────────────────────────────── */

/** Walk up the Object3D tree to find an ancestor with the given name */
function hasAncestorNamed(obj, name) {
  if (!name) return false;
  const upper = name.toUpperCase();
  let current = obj.parent;
  while (current) {
    if (current.name?.toUpperCase() === upper) return true;
    current = current.parent;
  }
  return false;
}

/** Get the parent group name (address) for a mesh */
function getParentAddress(obj) {
  let current = obj.parent;
  while (current) {
    if (current.name && /^\d{2}D\d{2}N\d$/.test(current.name)) return current.name;
    current = current.parent;
  }
  return null;
}

/* ──────────────────────────────────────────────
   Pre-compute the CB allocation per address.
   Each product occupies ceil(saldo/qtdporcx) boxes.
   Products in the same address stack sequentially
   starting from CB11, up to max CB35 (25 slots).
   Returns a Map: address → { totalOccupied, ranges: [{ productId, from, to }] }
   ────────────────────────────────────────────── */
function buildAddressAllocation(products) {
  const byAddress = {};
  products.forEach((p) => {
    if (!byAddress[p.cubo]) byAddress[p.cubo] = [];
    byAddress[p.cubo].push(p);
  });

  const allocation = {};
  Object.entries(byAddress).forEach(([address, prods]) => {
    let cursor = 11; // first box slot
    const ranges = [];
    prods.forEach((p) => {
      const boxes = Math.min(Math.ceil(Number(p.saldo) / Number(p.qtdporcx)), 25);
      const from = cursor;
      const to = Math.min(cursor + boxes - 1, 35); // CB35 is max
      ranges.push({ productId: p.id, from, to });
      cursor = to + 1;
    });
    allocation[address] = {
      totalOccupied: Math.min(cursor - 11, 25),
      ranges,
    };
  });
  return allocation;
}

const ADDRESS_ALLOCATION = buildAddressAllocation(PRODUCTS);

/* ──────────────────────────────────────────────
   3D Rack Model — loads estoque.glb and highlights CBs
   ────────────────────────────────────────────── */
function RackModel({ highlightedProduct }) {
  const { scene } = useGLTF("/estoque.glb");
  const modelRef = useRef();
  const materialsRef = useRef({});
  const pulseRef = useRef(0);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (!materialsRef.current[child.uuid]) {
          materialsRef.current[child.uuid] = {
            originalColor: child.material.color.clone(),
          };
        }
      }
    });
  }, [clonedScene]);

  useFrame((_, delta) => {
    pulseRef.current += delta * 3;
    const lerpSpeed = delta * 5;

    const highlightedCubo = highlightedProduct?.cubo;
    const highlightedId = highlightedProduct?.id;

    clonedScene.traverse((child) => {
      if (child.isMesh && materialsRef.current[child.uuid]) {
        const info = materialsRef.current[child.uuid];
        const isCB = child.name?.toUpperCase().startsWith("CB");

        let cbIdx = 0;
        let parentAddr = null;
        if (isCB) {
          const numStr = child.name.replace(/^CB/i, '');
          if (numStr.length > 2) {
            cbIdx = parseInt(numStr.slice(0, -3), 10); // strip 3-digit suffix
          } else {
            cbIdx = parseInt(numStr, 10);
          }
          parentAddr = getParentAddress(child);
        }

        // CB1-10 are pallets → always visible, never highlighted
        const isPallet = isCB && cbIdx >= 1 && cbIdx <= 10;

        // CB11-35 are box slots → check if occupied
        const isBoxSlot = isCB && cbIdx >= 11 && cbIdx <= 35;
        let isOccupied = false;
        let isHighlightedProductBox = false;

        if (isBoxSlot && parentAddr) {
          const alloc = ADDRESS_ALLOCATION[parentAddr];
          if (alloc) {
            for (const range of alloc.ranges) {
              if (cbIdx >= range.from && cbIdx <= range.to) {
                isOccupied = true;
                if (highlightedId === range.productId) {
                  isHighlightedProductBox = true;
                }
                break;
              }
            }
          }
        }

        // Unoccupied box slots → hide them (opacity 0)
        const isEmptySlot = isBoxSlot && !isOccupied;

        child.material.transparent = true;
        child.material.side = THREE.FrontSide;

        if (isEmptySlot) {
          // Empty box slot → invisible
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0, lerpSpeed);
          child.material.depthWrite = false;
          child.renderOrder = -1;
        } else if (highlightedCubo && isHighlightedProductBox && parentAddr === highlightedCubo) {
          // THIS product's boxes in the highlighted address → orange glow
          const pulse = 0.85 + Math.sin(pulseRef.current) * 0.15;
          child.material.color.set("#FF9F0A");
          child.material.emissive = new THREE.Color("#FF6B00");
          child.material.emissiveIntensity = 0.3 * pulse;
          child.material.roughness = 0.3;
          child.material.metalness = 0.6;
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 1, lerpSpeed);
          child.material.depthWrite = true;
          child.renderOrder = 2;
        } else if (highlightedCubo) {
          // Non-highlighted objects → semi-transparent
          child.material.color.copy(info.originalColor);
          child.material.emissive = new THREE.Color("#000000");
          child.material.emissiveIntensity = 0;
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 0.7, lerpSpeed);
          child.material.depthWrite = false;
          child.renderOrder = 0;
        } else {
          // No highlight active → restore fully (occupied boxes always visible)
          child.material.color.copy(info.originalColor);
          child.material.emissive = new THREE.Color("#000000");
          child.material.emissiveIntensity = 0;
          child.material.opacity = THREE.MathUtils.lerp(child.material.opacity, 1, lerpSpeed);
          child.material.depthWrite = true;
          child.renderOrder = 0;
        }
      }
    });
  });

  return (
    <Center>
      <primitive ref={modelRef} object={clonedScene} scale={1} />
    </Center>
  );
}

/* ──────────────────────────────────────────────
   Scene
   ────────────────────────────────────────────── */
function Scene({ highlightedProduct }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#FFFFFF" />
      <RackModel highlightedProduct={highlightedProduct} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={12} blur={2.5} far={6} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} target={[0, 0, 0]} />
    </>
  );
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [highlightedProduct, setHighlightedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locateAnimation, setLocateAnimation] = useState(false);
  const dropdownRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredProducts = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleLocate() {
    if (!selectedProduct) return;
    setHighlightedProduct(selectedProduct);
    setLocateAnimation(true);
    setTimeout(() => setLocateAnimation(false), 400);
  }

  function handleClear() {
    setSelectedProduct(null);
    setHighlightedProduct(null);
    setSearchTerm("");
  }

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setHighlightedProduct(null);
  }

  const cuboProducts = {};
  PRODUCTS.forEach((p) => {
    if (!cuboProducts[p.cubo]) cuboProducts[p.cubo] = [];
    cuboProducts[p.cubo].push(p);
  });

  return (
    <div className="w-screen h-dvh flex flex-col overflow-hidden relative gradient-dark">

      {/* ── Header ── */}
      <header className="relative z-10 px-3 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 glass-blur bg-dark-header border-b border-border-subtle">
        <div className="flex justify-between items-center max-w-[600px] mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Icon — hidden on mobile */}
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-ios-blue/10 items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-semibold text-white tracking-tight-ios m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                {isMobile ? "Protótipo System" : "Sistema de Localização de Estoque"}
              </h1>
              <p className="text-[13px] text-ios-gray mt-0.5 hidden sm:block">
                Sistema de rastreamento 3D do estoque
              </p>
            </div>
          </div>

          <div className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide-ios shrink-0 ml-2 ${
            highlightedProduct
              ? "bg-maint-badge text-ios-orange"
              : "bg-complete-badge text-ios-green"
          }`}>
            {highlightedProduct ? `📍 ${highlightedProduct.cubo}` : "PRONTO"}
          </div>
        </div>
      </header>

      {/* ── 3D Canvas ── */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <Canvas
          shadows
          camera={{ position: [4, 3, 4], fov: isMobile ? 55 : 50 }}
          style={{ background: "transparent", touchAction: "none" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene highlightedProduct={highlightedProduct} />
        </Canvas>

        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] sm:h-[100px] gradient-fade-up pointer-events-none z-[2]" />

        {/* Cubo info card */}
        {highlightedProduct && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-[5] glass-blur rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-border-card min-w-[160px] sm:min-w-[200px] max-w-[calc(100vw-24px)] sm:max-w-none"
            style={{ background: "rgba(44, 44, 46, 0.85)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-ios-orange glow-orange" />
              <span className="text-[13px] sm:text-[15px] font-semibold text-ios-orange">{highlightedProduct.cubo}</span>
            </div>
            <div className="h-px bg-border-subtle my-2 sm:my-2.5" />
            <div className="flex flex-col gap-1">
              {cuboProducts[highlightedProduct.cubo]?.map((p) => (
                <div
                  key={p.id}
                  className={`flex justify-between items-center gap-2 sm:gap-3 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 ${
                    p.id === selectedProduct?.id ? "bg-ios-orange/10" : ""
                  }`}
                >
                  <span className="text-[10px] sm:text-xs text-ios-gray font-medium font-mono">{p.code}</span>
                  <span className={`text-[11px] sm:text-[13px] font-medium ${
                    p.id === selectedProduct?.id ? "text-ios-orange" : "text-white"
                  }`}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Panel ── */}
      <div className="relative z-10 px-3 sm:px-5 pt-3 sm:pt-4 pb-5 sm:pb-8 glass-blur bg-dark-bottom border-t border-border-subtle">
        <div className="max-w-[600px] mx-auto flex flex-col gap-2.5 sm:gap-3">

          {/* Search */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 sm:gap-2.5 rounded-[10px] sm:rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-3 border border-border-subtle"
              style={{ background: "rgba(118, 118, 128, 0.12)" }}
            >
              <svg width={isMobile ? 16 : 18} height={isMobile ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={selectedProduct ? selectedProduct.name : (isMobile ? "Buscar peça..." : "Buscar peça por nome ou código...")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-[15px] text-white min-w-0"
              />
              {selectedProduct && (
                <button onClick={handleClear} className="bg-none border-none cursor-pointer p-1 flex items-center justify-center rounded-lg shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && filteredProducts.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 glass-blur rounded-xl sm:rounded-[14px] border border-border-card max-h-[200px] sm:max-h-[240px] overflow-y-auto p-1 sm:p-1.5 z-20"
                style={{ background: "rgba(44, 44, 46, 0.95)", boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)", WebkitOverflowScrolling: "touch" }}
              >
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className={`w-full flex justify-between items-center px-2.5 sm:px-3 py-2 sm:py-2.5 border-none rounded-lg sm:rounded-[10px] cursor-pointer transition-colors duration-150 text-left hover:bg-white/[0.06] ${
                      selectedProduct?.id === product.id ? "bg-ios-blue/10" : "bg-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 pointer-events-none">
                      <span className="text-[13px] sm:text-sm font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis pointer-events-none">{product.name}</span>
                      <span className="text-[11px] sm:text-xs text-ios-gray font-mono pointer-events-none">{product.code}</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-ios-blue bg-ios-blue/10 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 pointer-events-none">{product.cubo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={handleLocate}
              disabled={!selectedProduct}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-[14px] text-[15px] sm:text-base font-semibold bg-[#FF6600] text-white tracking-btn transition-all duration-250 active:scale-[0.97]"
              style={{
                opacity: selectedProduct ? 1 : 0.4,
                transform: locateAnimation ? "scale(0.96)" : "scale(1)",
                cursor: selectedProduct ? "pointer" : "not-allowed",
              }}
            >
              <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Localizar</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!highlightedProduct}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-[14px] text-[15px] sm:text-base font-semibold bg-ios-red/10 text-ios-red border border-ios-red/20 tracking-btn transition-all duration-250 active:scale-[0.97]"
              style={{
                opacity: highlightedProduct ? 1 : 0.4,
                cursor: highlightedProduct ? "pointer" : "not-allowed",
              }}
            >
              <svg width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Limpar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload("/estoque.glb");