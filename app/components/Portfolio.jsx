import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

const DATA = {
  name: "Hamdi Sevketbeyoglu",
  title: "D365 Developer",
  tagline: "Transforming business processes through Dynamics 365 solutions.",
  bio: "I'm a Dynamics 365 developer passionate about building scalable ERP/CRM solutions that drive real business value. With deep expertise in CRM, Power Platform, Azure integrations, and the full D365 ecosystem, I help organizations modernize their operations.",
  email: "hamdi.sevketbeyoglu@gmail.com",
  github: "https://github.com/hamdisevketbeyoglu",
  linkedin: "https://linkedin.com/in/hamdisevketbeyoglu",
  website: "https://www.hamdisevketbeyoglu.com",
  profileImage: "/profile.jpg",
  skills: [
    { name: "D365", level: 95 }, { name: "Power Automate", level: 90 }, { name: "Power Platform", level: 88 },
    { name: "C# / .NET", level: 85 }, { name: "Azure DevOps", level: 82 }, { name: "SQL Server", level: 88 },
    { name: "Power Automate", level: 85 }, { name: "JavaScript", level: 95 }, { name: "Data Entities", level: 90 },
    { name: "Azure Services", level: 78 },
  ],
  articles: [
    { id: 1, title: "Extending D365 F&O with Chain of Command", excerpt: "Chain of Command is the modern way to customize D365 without over-layering. Here's how to use it effectively.", date: "Feb 12, 2026", readTime: "8 min", tags: ["D365 F&O", "X++"] },
    { id: 2, title: "Building Custom Power Apps for D365 Workflows", excerpt: "A practical guide to creating canvas and model-driven apps that extend your Dynamics 365 processes.", date: "Jan 28, 2026", readTime: "12 min", tags: ["Power Platform", "D365"] },
    { id: 3, title: "Data Migration Strategies for D365 Finance", excerpt: "Migrating legacy data into D365 is one of the riskiest parts of any implementation. Here's a battle-tested approach.", date: "Dec 15, 2025", readTime: "10 min", tags: ["Data Migration", "DMF"] },
    { id: 4, title: "Azure Integration Patterns for Dynamics 365", excerpt: "From Logic Apps to Service Bus — connecting D365 with the broader Azure ecosystem.", date: "Nov 03, 2025", readTime: "15 min", tags: ["Azure", "Integration"] },
  ],
  projects: [
    { name: "d365-devtools", description: "Developer utilities for D365 F&O — code generators, label search, metadata explorers.", language: "C#", stars: 847, forks: 112, color: "#68217A" },
    { name: "power-automate-templates", description: "Ready-to-use Power Automate flow templates for common D365 business processes.", language: "TypeScript", stars: 523, forks: 89, color: "#3178c6" },
    { name: "xpp-snippets", description: "Curated X++ code snippets and patterns for D365 Finance & Operations development.", language: "X++", stars: 412, forks: 145, color: "#512BD4" },
    { name: "d365-data-migrator", description: "Automated data migration toolkit for D365 using Data Entities with validation and rollback.", language: "C#", stars: 364, forks: 67, color: "#68217A" },
    { name: "ssrs-report-builder", description: "Simplified SSRS report development for D365 with reusable templates.", language: "C#", stars: 289, forks: 42, color: "#68217A" },
    { name: "d365-azure-connector", description: "Lightweight library for integrating D365 with Azure services.", language: "C#", stars: 215, forks: 38, color: "#68217A" },
  ],
};

// ─── THREE.JS BACKGROUND ────────────────────────────────────────────────────
function ThreeScene() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 30;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    const accent = new THREE.Color("#a78bfa"), cyan = new THREE.Color("#22d3ee"), white = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      velocities.push({ x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008, z: (Math.random() - 0.5) * 0.004 });
      const c = Math.random(), col = c < 0.33 ? accent : c < 0.66 ? cyan : white;
      colors[i * 3] = col.r; colors[i * 3 + 1] = col.g; colors[i * 3 + 2] = col.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Floating Tech Logos (loaded from PNG files in /public) ────────
    const shapes = [];
    const loader = new THREE.TextureLoader();

    function makePngSprite(path, size) {
      const texture = loader.load(path);
      texture.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.55 });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(size, size, 1);
      return sprite;
    }

    // ── Logo config: path, position, size, float speed/amplitude, rotation ──
    // Save each PNG to your /public/logos/ folder
    const logos = [
      { path: "/logos/react.png",           pos: [-14, 8, -8],    size: 5,   fs: 0.5,  fa: 2,   rotSpeed: 0.004 },
      { path: "/logos/angular.png",         pos: [17, -4, -6],    size: 5,   fs: 0.7,  fa: 1.5, rotSpeed: -0.003 },
      { path: "/logos/power-apps.png",      pos: [0, 1, -18],     size: 6.5, fs: 0.2,  fa: 1,   rotSpeed: 0.002 },
      { path: "/logos/dataverse.png",       pos: [-17, -9, -10],  size: 5,   fs: 0.6,  fa: 1.8, rotSpeed: -0.004 },
      { path: "/logos/power-platform.png",  pos: [12, 11, -12],   size: 5,   fs: 0.3,  fa: 3,   rotSpeed: 0.005 },
      { path: "/logos/azure.png",           pos: [-8, -12, -9],   size: 5.5, fs: 0.8,  fa: 1.2, rotSpeed: -0.003 },
      { path: "/logos/microsoft.png",       pos: [20, 6, -14],    size: 4.5, fs: 0.4,  fa: 2.5, rotSpeed: 0.003 },
      { path: "/logos/dotnet.png",          pos: [-20, 3, -13],   size: 4.5, fs: 0.55, fa: 1.6, rotSpeed: -0.002 },
    ];

    logos.forEach((l) => {
      const sprite = makePngSprite(l.path, l.size);
      sprite.position.set(...l.pos);
      scene.add(sprite);
      shapes.push({ mesh: sprite, baseY: l.pos[1], fs: l.fs, fa: l.fa, rotSpeed: l.rotSpeed });
    });

    // Connection lines
    const linePos = new Float32Array(particleCount * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: "#a78bfa", transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const onMouse = (e) => { mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1; mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1; };
    window.addEventListener("mousemove", onMouse);
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll);
    const onResize = () => { const nw = mount.clientWidth, nh = mount.clientHeight; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
    window.addEventListener("resize", onResize);

    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.02;
      camera.position.z = 30 - scrollY * 0.003;
      camera.lookAt(0, 0, 0);

      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x; pos[i * 3 + 1] += velocities[i].y; pos[i * 3 + 2] += velocities[i].z;
        if (Math.abs(pos[i * 3]) > 40) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 40) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 25) velocities[i].z *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      let li = 0;
      const lp = lineGeo.attributes.position.array;
      for (let i = 0; i < 150; i++) {
        for (let j = i + 1; j < 150; j++) {
          const dx = pos[i*3]-pos[j*3], dy = pos[i*3+1]-pos[j*3+1], dz = pos[i*3+2]-pos[j*3+2];
          if (dx*dx+dy*dy+dz*dz < 80 && li < particleCount*2) {
            lp[li*3]=pos[i*3]; lp[li*3+1]=pos[i*3+1]; lp[li*3+2]=pos[i*3+2]; li++;
            lp[li*3]=pos[j*3]; lp[li*3+1]=pos[j*3+1]; lp[li*3+2]=pos[j*3+2]; li++;
          }
        }
      }
      lineGeo.setDrawRange(0, li);
      lineGeo.attributes.position.needsUpdate = true;

      shapes.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(t * s.fs) * s.fa;
        s.mesh.material.rotation += s.rotSpeed;
      });
      particles.rotation.y = t * 0.015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── HOOKS & COMPONENTS ─────────────────────────────────────────────────────
function useReveal(th = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: th });
    obs.observe(el); return () => obs.disconnect();
  }, [th]);
  return [ref, v];
}

function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, v] = useReveal();
  const tr = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)" };
  return <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "translate(0)" : tr[direction], transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s` }}>{children}</div>;
}

function SkillBar({ name, level, delay, color }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "#bbb", fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: 12, color: "#666" }}>{level}%</span>
      </div>
      <div style={{ height: 4, background: "#ffffff08", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, width: v ? `${level}%` : "0%", background: `linear-gradient(90deg, ${color}, ${color}88)`, transition: `width 1.2s cubic-bezier(.16,1,.3,1) ${delay}s` }} />
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function Portfolio3D() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles and projects from MongoDB API
  useEffect(() => {
    async function fetchData() {
      try {
        const [artRes, projRes] = await Promise.all([
          fetch("/api/articles").then((r) => r.json()),
          fetch("/api/projects").then((r) => r.json()),
        ]);
        if (artRes.success && artRes.data) setArticles(artRes.data);
        else setArticles(DATA.articles); // fallback to hardcoded

        if (projRes.success && projRes.data) setProjects(projRes.data);
        else setProjects(DATA.projects); // fallback to hardcoded
      } catch (err) {
        console.error("API fetch failed, using fallback data:", err);
        setArticles(DATA.articles);
        setProjects(DATA.projects);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      for (const id of ["contact", "projects", "articles", "about", "home"]) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 300) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const NAV = ["home", "about", "articles", "projects", "contact"];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#050508", color: "#e0e0e0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .btn-glow:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(167,139,250,0.3) !important; }
        .btn-outline:hover { border-color: #a78bfa !important; color: #a78bfa !important; }
        .photo-frame:hover { transform: scale(1.04) !important; box-shadow: 0 0 60px rgba(167,139,250,0.12) !important; }
        .article-card { transition: transform 0.35s, border-color 0.35s, box-shadow 0.35s !important; }
        .article-card:hover { transform: translateY(-6px) !important; border-color: #a78bfa22 !important; box-shadow: 0 16px 48px rgba(167,139,250,0.06) !important; }
        .project-card { transition: transform 0.35s, border-color 0.35s, box-shadow 0.35s !important; }
        .project-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.3) !important; border-color: #a78bfa22 !important; }
        .contact-card { transition: border-color 0.3s, transform 0.3s !important; }
        .contact-card:hover { border-color: #a78bfa33 !important; transform: translateY(-3px) !important; }
        .orbit { animation: orbitSpin 15s linear infinite; }
        @keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scroll-anim { animation: pulse 2.5s ease infinite; }
        @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        .mob-link { animation: slideIn 0.4s ease forwards; opacity: 0; }
        @keyframes slideIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @media (max-width: 800px) {
          .desk-nav { display: none !important; }
          .burger-btn { display: flex !important; }
          .hero-inner { flex-direction: column !important; text-align: center !important; }
          .hero-left { align-items: center !important; }
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <ThreeScene />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,5,8,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid #ffffff08" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => scrollTo("home")} style={{ background: "none", border: "none", color: "#f0f0f0", fontSize: 20, fontFamily: "'Sora'", fontWeight: 700, cursor: "pointer" }}>
            <span style={{ color: "#a78bfa" }}>{"<"}</span>HS<span style={{ color: "#a78bfa" }}>{"/>"}</span>
          </button>
          <div className="desk-nav" style={{ display: "flex", gap: 28 }}>
            {NAV.map((n) => (
              <button key={n} onClick={() => scrollTo(n)} style={{ background: "none", border: "none", fontSize: 12, fontFamily: "'Outfit'", textTransform: "uppercase", letterSpacing: 2, cursor: "pointer", color: activeSection === n ? "#a78bfa" : "#888", transition: "color 0.3s", position: "relative", padding: "4px 0" }}>
                {n}
                {activeSection === n && <span style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 16, height: 2, borderRadius: 1, background: "#a78bfa" }} />}
              </button>
            ))}
          </div>
          <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}>
            <span style={{ width: 22, height: 2, background: "#e0e0e0", borderRadius: 1, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
            <span style={{ width: 22, height: 2, background: "#e0e0e0", borderRadius: 1, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: "#e0e0e0", borderRadius: 1, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ position: "fixed", inset: "64px 0 0 0", background: "rgba(5,5,8,0.97)", zIndex: 99, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          {NAV.map((n, i) => <button key={n} className="mob-link" onClick={() => scrollTo(n)} style={{ background: "none", border: "none", color: "#e0e0e0", fontSize: 26, fontFamily: "'Sora'", cursor: "pointer", fontWeight: 300, animationDelay: `${i * 0.08}s` }}>{n}</button>)}
        </div>
      )}

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "120px 24px 60px" }}>
        <div className="hero-inner" style={{ maxWidth: 1100, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 60, flexWrap: "wrap" }}>
          <div className="hero-left" style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column" }}>
            <Reveal><p style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: "#a78bfa", marginBottom: 16, fontWeight: 500 }}>Hello, I'm</p></Reveal>
            <Reveal delay={0.1}><h1 style={{ fontFamily: "'Sora'", fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(135deg, #f8f8f8 0%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{DATA.name}</h1></Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ width: 32, height: 2, background: "linear-gradient(90deg, #a78bfa, transparent)", borderRadius: 1 }} />
                <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 300, color: "#888" }}>{DATA.title}</h2>
              </div>
            </Reveal>
            <Reveal delay={0.3}><p style={{ fontSize: 16, lineHeight: 1.7, color: "#999", maxWidth: 460, marginBottom: 36 }}>{DATA.tagline}</p></Reveal>
            <Reveal delay={0.4}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button onClick={() => scrollTo("projects")} className="btn-glow" style={{ padding: "14px 32px", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "'Outfit'", cursor: "pointer", transition: "transform 0.3s, box-shadow 0.3s" }}>View My Work</button>
                <button onClick={() => scrollTo("contact")} className="btn-outline" style={{ padding: "14px 32px", background: "transparent", color: "#ccc", border: "1px solid #333", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "'Outfit'", cursor: "pointer", transition: "border-color 0.3s, color 0.3s" }}>Get in Touch</button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} direction="left">
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div className="photo-frame" style={{ width: 280, height: 340, borderRadius: 16, overflow: "hidden", border: "1px solid #ffffff12", background: "#0a0a10", position: "relative", zIndex: 2, transition: "transform 0.5s, box-shadow 0.5s" }}>
                <img src={DATA.profileImage} alt={DATA.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              {/* Glow border */}
              <div style={{ position: "absolute", inset: -1, borderRadius: 16, background: "linear-gradient(135deg, #a78bfa33, transparent 60%, #22d3ee33)", zIndex: 1, pointerEvents: "none" }} />
              {/* Orbiting ring */}
              <div className="orbit" style={{ position: "absolute", top: -24, left: -24, right: -24, bottom: -24, border: "1px solid #a78bfa12", borderRadius: "50%", zIndex: 0 }} />
              <div className="orbit" style={{ position: "absolute", top: -40, left: -40, right: -40, bottom: -40, border: "1px dashed #22d3ee08", borderRadius: "50%", zIndex: 0, animationDuration: "25s", animationDirection: "reverse" }} />
            </div>
          </Reveal>
        </div>
        <div className="scroll-anim" style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#555", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(180deg, #555, transparent)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#a78bfa", marginBottom: 12, fontWeight: 500 }}>01 — About</p>
            <h2 style={{ fontFamily: "'Sora'", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, marginBottom: 40, lineHeight: 1.2, background: "linear-gradient(135deg, #f0f0f0, #a78bfa88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>A bit about me</h2>
          </Reveal>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            <Reveal delay={0.1}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #ffffff0a", borderRadius: 16, padding: 32, backdropFilter: "blur(8px)" }}>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#aaa", marginBottom: 20 }}>{DATA.bio}</p>
                <a href={DATA.website} target="_blank" rel="noreferrer" style={{ color: "#a78bfa", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Visit my website →</a>
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.15}><p style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "#666", marginBottom: 20, fontWeight: 500 }}>Technical Skills</p></Reveal>
              {DATA.skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} level={s.level} delay={0.1 + i * 0.04} color={i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#22d3ee" : "#34d399"} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" style={{ padding: "120px 24px", position: "relative", zIndex: 1, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#a78bfa", marginBottom: 12, fontWeight: 500 }}>02 — Articles</p>
            <h2 style={{ fontFamily: "'Sora'", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, marginBottom: 40, lineHeight: 1.2, background: "linear-gradient(135deg, #f0f0f0, #a78bfa88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Things I've written</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {loading ? (
              <p style={{ color: "#555", fontSize: 14 }}>Loading articles...</p>
            ) : articles.map((a, i) => (
              <Reveal key={a._id || a.id || i} delay={i * 0.1}>
                <div className="article-card" onClick={() => { if (a.slug) window.location.href = `/articles/${a.slug}`; }} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #ffffff08", borderRadius: 14, padding: 28, cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", textDecoration: "none" }}>
                  <div style={{ fontFamily: "'Sora'", fontSize: 36, fontWeight: 700, color: "#a78bfa12", marginBottom: 12 }}>0{i + 1}</div>
                  <h3 style={{ fontFamily: "'Sora'", fontSize: 18, fontWeight: 600, color: "#eee", marginBottom: 12, lineHeight: 1.4 }}>{a.title}</h3>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{a.excerpt}</p>
                  <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#555", marginBottom: 12 }}>
                    <span>{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : a.date}</span>
                    <span>·</span>
                    <span>{a.readTime}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(a.tags || []).map((t) => <span key={t} style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#a78bfa", background: "rgba(167,139,250,0.08)", padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>{t}</span>)}
                    </div>
                    <span style={{ color: "#555", fontSize: 13 }}>Read →</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "120px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#a78bfa", marginBottom: 12, fontWeight: 500 }}>03 — Projects</p>
            <h2 style={{ fontFamily: "'Sora'", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, marginBottom: 40, lineHeight: 1.2, background: "linear-gradient(135deg, #f0f0f0, #a78bfa88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Open Source & Side Projects</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {loading ? (
              <p style={{ color: "#555", fontSize: 14 }}>Loading projects...</p>
            ) : projects.map((p, i) => (
              <Reveal key={p._id || p.name || i} delay={i * 0.08}>
                <div className="project-card" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #ffffff08", borderRadius: 14, padding: 28, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={p.languageColor || p.color || "#a78bfa"} strokeWidth="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Sora'", fontSize: 17, fontWeight: 600, color: "#eee" }}>{p.name}</h3>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, flex: 1 }}>{p.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#999" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: p.languageColor || p.color || "#a78bfa", display: "inline-block" }} />{p.language}</span>
                    <span style={{ fontSize: 13, color: "#666" }}>★ {p.stars}</span>
                    <span style={{ fontSize: 13, color: "#666" }}>⑂ {p.forks}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "120px 24px", position: "relative", zIndex: 1, background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: "#a78bfa", marginBottom: 12, fontWeight: 500 }}>04 — Contact</p>
            <h2 style={{ fontFamily: "'Sora'", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 600, marginBottom: 16, lineHeight: 1.2, background: "linear-gradient(135deg, #f0f0f0, #a78bfa88)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Let's build something together.</h2>
            <p style={{ color: "#777", fontSize: 16, maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>I'm always open to new opportunities, collaborations, or a good conversation about D365 and enterprise tech.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {[
                { icon: "✉", label: DATA.email, href: `mailto:${DATA.email}` },
                { icon: "⌂", label: "GitHub", href: DATA.github },
                { icon: "in", label: "LinkedIn", href: DATA.linkedin },
                { icon: "◎", label: "Website", href: DATA.website },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", border: "1px solid #ffffff08", borderRadius: 12, color: "#bbb", textDecoration: "none", fontSize: 14, background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: 18, color: "#a78bfa", width: 24, textAlign: "center" }}>{c.icon}</span>
                  <span>{c.label}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ padding: "40px 24px", borderTop: "1px solid #ffffff06", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#444", fontSize: 13 }}>Designed & built by {DATA.name} · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}