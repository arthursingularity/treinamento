"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────
   Product Database — each product is stored in a CUBO
   ────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 1, name: "CAIXA 601", code: "MTR-001", cubo: "CUBO1" },
  { id: 2, name: "ESPELHO 501", code: "ROL-002", cubo: "CUBO1" },
  { id: 3, name: "CILINDRO 501 GORJE", code: "COR-003", cubo: "CUBO2" },
  { id: 4, name: "TAMBOR 1001", code: "SEN-004", cubo: "CUBO2" },
  { id: 5, name: "TAMBOR 1002", code: "VLV-005", cubo: "CUBO3" },
  { id: 6, name: "TAMPA 701/100", code: "CIL-006", cubo: "CUBO3" },
  { id: 7, name: "CAIXA 501", code: "FUS-007", cubo: "CUBO4" },
  { id: 8, name: "ARRUELA FECHAMENTO 500", code: "CNT-008", cubo: "CUBO4" },
  { id: 9, name: "TAMBOR 1006", code: "RLT-009", cubo: "CUBO5" },
  { id: 10, name: "TAMBOR 1007", code: "DJT-010", cubo: "CUBO5" },
  { id: 11, name: "TAMBOR 1008", code: "MNG-011", cubo: "CUBO6" },
  { id: 12, name: "TAMBOR 1009", code: "FLT-012", cubo: "CUBO6" },
];

/* ──────────────────────────────────────────────
   3D Rack Model — loads estoque.glb and highlights cubes
   ────────────────────────────────────────────── */
function RackModel({ highlightedCubo }) {
  const { scene } = useGLTF("/estoque.glb");
  const modelRef = useRef();
  const materialsRef = useRef({});
  const pulseRef = useRef(0);

  // Clone the scene so we can modify materials independently
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [scene]);

  // Store original materials and setup
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Store original color for each mesh
        const parentName = child.parent?.name || child.name;
        if (!materialsRef.current[child.uuid]) {
          materialsRef.current[child.uuid] = {
            originalColor: child.material.color.clone(),
            parentName: parentName,
            meshName: child.name,
          };
        }
      }
    });
  }, [clonedScene]);

  // Animate highlight
  useFrame((_, delta) => {
    pulseRef.current += delta * 3;

    clonedScene.traverse((child) => {
      if (child.isMesh && materialsRef.current[child.uuid]) {
        const info = materialsRef.current[child.uuid];
        const isCubo =
          child.name?.toUpperCase().includes(highlightedCubo?.toUpperCase()) ||
          child.parent?.name?.toUpperCase().includes(highlightedCubo?.toUpperCase());

        if (highlightedCubo && isCubo) {
          // Pulse between orange tones
          const pulse = 0.85 + Math.sin(pulseRef.current) * 0.15;
          child.material.color.set("#FF9F0A");
          child.material.emissive = new THREE.Color("#FF6B00");
          child.material.emissiveIntensity = 0.3 * pulse;
          child.material.roughness = 0.3;
          child.material.metalness = 0.6;
        } else {
          // Restore original
          child.material.color.copy(info.originalColor);
          child.material.emissive = new THREE.Color("#000000");
          child.material.emissiveIntensity = 0;
          child.material.roughness = child.material.roughness || 0.5;
          child.material.metalness = child.material.metalness || 0.5;
        }
      }
    });
  });

  return (
    <Center>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={1}
      />
    </Center>
  );
}

/* ──────────────────────────────────────────────
   Scene
   ────────────────────────────────────────────── */
function Scene({ highlightedCubo }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={0.4} color="#FFFFFF" />

      <RackModel highlightedCubo={highlightedCubo} />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={6}
      />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 0, 0]}
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [highlightedCubo, setHighlightedCubo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locateAnimation, setLocateAnimation] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
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
    setHighlightedCubo(selectedProduct.cubo);
    setLocateAnimation(true);
    setTimeout(() => setLocateAnimation(false), 400);
  }

  function handleClear() {
    setSelectedProduct(null);
    setHighlightedCubo(null);
    setSearchTerm("");
  }

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setSearchTerm("");
    setIsDropdownOpen(false);
    setHighlightedCubo(null);
  }

  // Group products by cubo for the info card
  const cuboProducts = {};
  PRODUCTS.forEach((p) => {
    if (!cuboProducts[p.cubo]) cuboProducts[p.cubo] = [];
    cuboProducts[p.cubo].push(p);
  });

  return (
    <div style={styles.container}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h1 style={styles.headerTitle}>Sistema de Localização de Estoque</h1>
              <p style={styles.headerSub}>
                Sistema de rastreamento 3D do estoque
              </p>
            </div>
          </div>
          <div style={{
            ...styles.badge,
            background: highlightedCubo ? "rgba(255, 159, 10, 0.15)" : "rgba(48, 209, 88, 0.15)",
            color: highlightedCubo ? "#FF9F0A" : "#30D158",
          }}>
            {highlightedCubo ? `📍 ${highlightedCubo}` : "PRONTO"}
          </div>
        </div>
      </header>

      {/* ── 3D Canvas ── */}
      <div style={styles.canvasWrapper}>
        <Canvas
          shadows
          camera={{ position: [4, 3, 4], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene highlightedCubo={highlightedCubo} />
        </Canvas>

        {/* Gradient overlay bottom */}
        <div style={styles.gradientOverlay} />

        {/* Cubo info card (when locating) */}
        {highlightedCubo && (
          <div style={styles.cuboInfoCard}>
            <div style={styles.cuboInfoHeader}>
              <div style={styles.cuboInfoDot} />
              <span style={styles.cuboInfoTitle}>{highlightedCubo}</span>
            </div>
            <div style={styles.cuboInfoDivider} />
            <div style={styles.cuboInfoItems}>
              {cuboProducts[highlightedCubo]?.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.cuboInfoItem,
                    background: p.id === selectedProduct?.id ? "rgba(255, 159, 10, 0.12)" : "transparent",
                    borderRadius: 8,
                    padding: "6px 8px",
                  }}
                >
                  <span style={styles.cuboInfoCode}>{p.code}</span>
                  <span style={{
                    ...styles.cuboInfoName,
                    color: p.id === selectedProduct?.id ? "#FF9F0A" : "#FFFFFF",
                  }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Action Panel ── */}
      <div style={styles.bottomPanel}>
        <div style={styles.bottomInner}>
          {/* Search / Select */}
          <div style={styles.searchContainer} ref={dropdownRef}>
            <div style={styles.searchInputWrapper}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={selectedProduct ? selectedProduct.name : "Buscar peça por nome ou código..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                style={{
                  ...styles.searchInput,
                  color: selectedProduct && !searchTerm ? "#FFFFFF" : "#FFFFFF",
                }}
              />
              {selectedProduct && (
                <button onClick={handleClear} style={styles.clearBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && filteredProducts.length > 0 && (
              <div style={styles.dropdown}>
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    style={{
                      ...styles.dropdownItem,
                      background: selectedProduct?.id === product.id ? "rgba(0, 122, 255, 0.12)" : "transparent",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={(e) => e.target.style.background = selectedProduct?.id === product.id ? "rgba(0, 122, 255, 0.12)" : "transparent"}
                  >
                    <div style={styles.dropdownItemLeft}>
                      <span style={styles.dropdownItemName}>{product.name}</span>
                      <span style={styles.dropdownItemCode}>{product.code}</span>
                    </div>
                    <span style={styles.dropdownItemCubo}>{product.cubo}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              onClick={handleLocate}
              disabled={!selectedProduct}
              style={{
                ...styles.locateBtn,
                opacity: selectedProduct ? 1 : 0.4,
                transform: locateAnimation ? "scale(0.96)" : "scale(1)",
                cursor: selectedProduct ? "pointer" : "not-allowed",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Localiza</span>
            </button>

            <button
              onClick={handleClear}
              style={{
                ...styles.clearActionBtn,
                opacity: highlightedCubo ? 1 : 0.4,
                cursor: highlightedCubo ? "pointer" : "not-allowed",
              }}
              disabled={!highlightedCubo}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

/* ──────────────────────────────────────────────
   Styles — iOS-inspired inline styles
   ────────────────────────────────────────────── */
const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, #0A0A0F 0%, #1C1C1E 100%)",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  // Header
  header: {
    position: "relative",
    zIndex: 10,
    padding: "16px 20px 12px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    background: "rgba(28, 28, 30, 0.75)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  },
  headerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 600,
    margin: "0 auto",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "rgba(0, 122, 255, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: "#FFFFFF",
    letterSpacing: -0.3,
    margin: 0,
  },
  headerSub: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  badge: {
    padding: "5px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  // Canvas
  canvasWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    background: "linear-gradient(to top, rgba(28, 28, 30, 0.95) 0%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 2,
  },

  // Cubo info card
  cuboInfoCard: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 5,
    background: "rgba(44, 44, 46, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 16,
    padding: "14px 16px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    minWidth: 200,
    animation: "slideIn 0.3s ease-out",
  },
  cuboInfoHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cuboInfoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#FF9F0A",
    boxShadow: "0 0 8px rgba(255, 159, 10, 0.6)",
  },
  cuboInfoTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#FF9F0A",
  },
  cuboInfoDivider: {
    height: 1,
    background: "rgba(255, 255, 255, 0.06)",
    margin: "10px 0",
  },
  cuboInfoItems: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  cuboInfoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cuboInfoCode: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: 500,
    fontFamily: "'SF Mono', 'Menlo', monospace",
  },
  cuboInfoName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#FFFFFF",
  },

  // Bottom panel
  bottomPanel: {
    position: "relative",
    zIndex: 10,
    padding: "16px 20px 32px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    background: "rgba(28, 28, 30, 0.85)",
    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  },
  bottomInner: {
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  // Search
  searchContainer: {
    position: "relative",
  },
  searchInputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(118, 118, 128, 0.12)",
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    transition: "all 0.2s ease",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    transition: "opacity 0.2s",
  },

  // Dropdown
  dropdown: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    marginBottom: 8,
    background: "rgba(44, 44, 46, 0.95)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 14,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    maxHeight: 240,
    overflowY: "auto",
    padding: 6,
    boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
    zIndex: 20,
  },
  dropdownItem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.15s ease",
    fontFamily: "inherit",
    textAlign: "left",
  },
  dropdownItemLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    pointerEvents: "none",
  },
  dropdownItemName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#FFFFFF",
    pointerEvents: "none",
  },
  dropdownItemCode: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "'SF Mono', 'Menlo', monospace",
    pointerEvents: "none",
  },
  dropdownItemCubo: {
    fontSize: 12,
    fontWeight: 600,
    color: "#007AFF",
    background: "rgba(0, 122, 255, 0.12)",
    padding: "3px 8px",
    borderRadius: 6,
    pointerEvents: "none",
  },

  // Action buttons
  actionButtons: {
    display: "flex",
    gap: 12,
  },
  locateBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 20px",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    background: "#007AFF",
    color: "#FFFFFF",
    border: "1px solid #007AFF",
    fontFamily: "inherit",
    letterSpacing: -0.2,
    transition: "all 0.25s ease",
    boxShadow: "0 4px 20px rgba(0, 122, 255, 0.3)",
  },
  clearActionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 20px",
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 600,
    background: "rgba(255, 59, 48, 0.12)",
    color: "#FF3B30",
    border: "1px solid rgba(255, 59, 48, 0.2)",
    fontFamily: "inherit",
    letterSpacing: -0.2,
    transition: "all 0.25s ease",
    cursor: "pointer",
  },
};

// Preload the model
useGLTF.preload("/estoque.glb");