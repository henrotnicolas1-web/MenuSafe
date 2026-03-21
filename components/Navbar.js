"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import {
  BookOpen, BarChart2, Users, Link2,
  Scale, X, Menu, ChevronDown,
  Shield, FileText, Smartphone, Camera
} from "lucide-react";

function Logo({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PRODUCT_LINKS = [
  { Icon: Shield,      label: "Détection allergènes",   desc: "14 allergènes, 900+ ingrédients",     href: "/#features" },
  { Icon: Smartphone,  label: "Carte multilingue",       desc: "QR code, 8 langues, filtrage live",   href: "/#features" },
  { Icon: FileText,    label: "PDF conforme INCO",       desc: "Document légal en 1 clic",             href: "/#features" },
  { Icon: Camera,      label: "Import IA",               desc: "Photo de carte → données complètes",  href: "/#features" },
];

const RESOURCES_LINKS = [
  { Icon: Scale,    label: "Loi INCO expliquée",   desc: "Obligations, sanctions, simulateur",  href: "/loi-inco" },
  { Icon: BarChart2, label: "Comparatif",           desc: "MenuSafe vs classeur, PDF, Excel",    href: "/comparatif" },
  { Icon: Users,    label: "Par métier",            desc: "Restaurant, boulangerie, hôtel…",     href: "/metiers" },
  { Icon: Link2,    label: "Intégrations",          desc: "Caisses, exports, API",               href: "/partenaires" },
];

export default function Navbar() {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [openMenu, setOpenMenu] = useState(null); // null | "product" | "resources"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef(null);

  function openDropdown(name) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(name);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function navigate(href) {
    setOpenMenu(null);
    setDrawerOpen(false);
    if (href.startsWith("/#")) {
      router.push("/");
      setTimeout(() => {
        const id = href.slice(2);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      router.push(href);
    }
  }

  function DropdownMenu({ links }) {
    return (
      <div
        onMouseEnter={() => openDropdown(openMenu)}
        onMouseLeave={scheduleClose}
        style={{
          position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: "white", border: "1px solid #EBEBEB", borderRadius: 16,
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)", padding: 8, minWidth: 320, zIndex: 200,
        }}>
        {links.map(({ Icon, label, desc, href }) => (
          <div key={href} onClick={() => navigate(href)}
            style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "#F7F7F5"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={16} color="#1A1A1A" strokeWidth={1.75} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" }}>{label}</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setDrawerOpen(false)} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: "white", padding: "20px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Logo size={22} />
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={20} color="#888" />
              </button>
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Produit</p>
            {PRODUCT_LINKS.map(({ Icon, label, href }) => (
              <div key={href} onClick={() => navigate(href)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid #F5F5F5", cursor: "pointer" }}>
                <Icon size={15} color="#555" />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{label}</span>
              </div>
            ))}

            <p style={{ fontSize: 10, fontWeight: 700, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 20, marginBottom: 8 }}>Ressources</p>
            {RESOURCES_LINKS.map(({ Icon, label, href }) => (
              <div key={href} onClick={() => navigate(href)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", borderBottom: "1px solid #F5F5F5", cursor: "pointer" }}>
                <Icon size={15} color="#555" />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>{label}</span>
              </div>
            ))}

            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => navigate("/dashboard")} style={{ padding: "11px", fontSize: 14, fontWeight: 600, background: "white", color: "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" }}>
                Se connecter
              </button>
              <button onClick={() => navigate("/auth")} style={{ padding: "11px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
                Essayer gratuitement →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
            <Logo size={24} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
              {/* Produit dropdown */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => openDropdown("product")}
                onMouseLeave={scheduleClose}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", fontSize: 13, fontWeight: 500, color: openMenu === "product" ? "#1A1A1A" : "#555", background: openMenu === "product" ? "#F5F5F5" : "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  Produit <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: openMenu === "product" ? "rotate(180deg)" : "none" }} />
                </button>
                {openMenu === "product" && <DropdownMenu links={PRODUCT_LINKS} />}
              </div>

              {/* Tarifs */}
              <button onClick={() => navigate("/#pricing")} style={{ padding: "8px 12px", fontSize: 13, fontWeight: 500, color: "#555", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = "#1A1A1A"}
                onMouseLeave={e => e.target.style.color = "#555"}>
                Tarifs
              </button>

              {/* Ressources dropdown */}
              <div style={{ position: "relative" }}
                onMouseEnter={() => openDropdown("resources")}
                onMouseLeave={scheduleClose}>
                <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 12px", fontSize: 13, fontWeight: 500, color: openMenu === "resources" ? "#1A1A1A" : "#555", background: openMenu === "resources" ? "#F5F5F5" : "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}>
                  Ressources <ChevronDown size={13} style={{ transition: "transform 0.2s", transform: openMenu === "resources" ? "rotate(180deg)" : "none" }} />
                </button>
                {openMenu === "resources" && <DropdownMenu links={RESOURCES_LINKS} />}
              </div>
            </div>
          )}

          {/* Desktop CTA */}
          {!isMobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button onClick={() => navigate("/dashboard")} style={{ fontSize: 13, fontWeight: 600, padding: "8px 14px", background: "white", color: "#555", border: "1px solid #E0E0E0", borderRadius: 9, cursor: "pointer" }}>
                Se connecter
              </button>
              <button onClick={() => navigate("/auth")} style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer" }}>
                Essayer gratuitement →
              </button>
            </div>
          ) : (
            <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "1px solid #E0E0E0", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
              <Menu size={18} color="#1A1A1A" />
            </button>
          )}
        </div>
      </nav>
    </>
  );
}