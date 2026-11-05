import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Compass, Maximize2, Minimize2, RotateCcw, Volume2, VolumeX,
  Play, Pause, Eye, Info, Sparkles, MapPin, CheckCircle2,
  ChevronRight, X, ArrowLeft, Sun, Moon, Sunset, Layers
} from 'lucide-react';

// Collegiate 3D Locations Catalog
export const CAMPUS_LOCATIONS = [
  {
    id: 'quadrangle',
    name: 'Academic Quadrangle & Main Block',
    category: 'Campus Grounds',
    subtitle: 'Neo-classical stone facade, manicured lawns, and collegiate clock tower',
    theme: {
      skyTop: '#1e3a8a',
      skyBottom: '#93c5fd',
      groundColor: '#15803d',
      ambientColor: '#ffffff',
      lightIntensity: 1.2
    },
    hotspots: [
      {
        id: 'clock-tower',
        title: 'Centennial Clock Tower',
        category: 'Landmark',
        pos: [22, 14, -38],
        desc: 'Historic 65-foot bell and clock tower constructed in 1994, marking lecture intervals and ceremonial college occasions.',
        specs: ['Height: 65 Feet', 'Bells: Cast Bronze Chimes', 'Illumination: Architectural LED Glow']
      },
      {
        id: 'admin-portico',
        title: 'Administrative Grand Portico',
        category: 'Administration',
        pos: [-35, 2, -28],
        desc: 'Central portico housing the Principal’s Chamber, Admissions Registry, Fee Counter, and Examination Directorate.',
        specs: ['Ground Floor: Admissions & Accounts', '1st Floor: Principal & Board Room', 'Service Desk: 8:30 AM - 5:00 PM']
      },
      {
        id: 'memorial-garden',
        title: 'Swami Vivekananda Herbal & Botanical Gardens',
        category: 'Green Campus',
        pos: [32, -8, 26],
        desc: 'Over 140 species of documented indigenous medicinal flora maintained by the Department of Biology and Green Club.',
        specs: ['Species: 140+ Taxa', 'Eco-Zone: Certified Plastic-Free', 'Maintained by: Eco Club']
      }
    ]
  },
  {
    id: 'physics-lab',
    name: 'C.V. Raman Advanced Physics Lab',
    category: 'Laboratories',
    subtitle: 'Equipped with helium-neon optical benches, spectrometer darkrooms, and digital oscilloscopes',
    theme: {
      skyTop: '#0f172a',
      skyBottom: '#1e293b',
      groundColor: '#334155',
      ambientColor: '#cbd5e1',
      lightIntensity: 1.0
    },
    hotspots: [
      {
        id: 'laser-bench',
        title: 'Laser Optics & Diffraction Bench',
        category: 'Optics Equipment',
        pos: [30, 4, -25],
        desc: 'High-precision He-Ne laser setup with fine diffraction gratings and Babinet compensators for wave optics experiments.',
        specs: ['Wavelength: 632.8 nm (Red)', 'Graters: 15,000 LPI', 'Experiment: Wavelength Determination']
      },
      {
        id: 'spectrometer-prism',
        title: 'Gaertner High-Resolution Spectrometer',
        category: 'Optical Instrumentation',
        pos: [-28, -2, -32],
        desc: 'Flint glass prism and sodium vapor source for measuring dispersive power and angle of minimum deviation.',
        specs: ['Vernier Accuracy: 1 arc-minute', 'Light Source: Sodium D-Lines', 'PU Board Mandatory Experiment']
      },
      {
        id: 'oscilloscope-station',
        title: 'Dual-Trace Digital Storage Oscilloscope (DSO)',
        category: 'Electronics Bench',
        pos: [12, -4, 38],
        desc: '100 MHz digital storage oscilloscopes for AC resonance (LCR circuits), rectifiers, and transistor characteristics.',
        specs: ['Bandwidth: 100 MHz', 'Channels: Dual Input', 'Workbenches: 24 Simultaneous Working Stations']
      }
    ]
  },
  {
    id: 'chemistry-lab',
    name: 'Marie Curie Analytical Chemistry Lab',
    category: 'Laboratories',
    subtitle: 'NABL-compliant workstation setup with specialized exhaust fume hoods and electronic analytical balances',
    theme: {
      skyTop: '#064e3b',
      skyBottom: '#047857',
      groundColor: '#1e293b',
      ambientColor: '#a7f3d0',
      lightIntensity: 1.1
    },
    hotspots: [
      {
        id: 'fume-hood',
        title: 'Laminar Flow Exhaust Fume Hood',
        category: 'Safety Infrastructure',
        pos: [-32, 6, -26],
        desc: 'HEPA-filtered localized ventilation exhaust cabinet for safe handling of volatile organic syntheses and concentrated acids.',
        specs: ['Face Velocity: 100 FPM', 'Filter: Activated Carbon & HEPA', 'Safety Compliance: ANSI/ASHRAE 110']
      },
      {
        id: 'titration-desk',
        title: 'Volumetric Titration & Salt Analysis Bench',
        category: 'Analytical Station',
        pos: [26, -5, -34],
        desc: 'Ergonomic acid-resistant granite counters equipped with burette stands, pH meters, and semi-micro qualitative salt kits.',
        specs: ['Workplaces: 60 Students per session', 'Surface: Anti-Corrosive Black Granite', 'Safety: Eyewash & Safety Shower Unit']
      },
      {
        id: 'digital-balance',
        title: 'Mettler Digital Micro-Analytical Balance',
        category: 'Measurement',
        pos: [35, 1, 20],
        desc: 'Zero-draft shielded balance with 0.1 mg precision for preparing analytical standard solutions.',
        specs: ['Sensitivity: 0.0001 g (0.1 mg)', 'Draft Shield: 3-Door Anti-Static Glass', 'Calibration: Automated Internal Weight']
      }
    ]
  },
  {
    id: 'computer-lab',
    name: 'Alan Turing Supercomputing & AI Center',
    category: 'Computer Science',
    subtitle: '120 high-performance workstations connected to Gigabit fiber LAN with dedicated Python & Linux suites',
    theme: {
      skyTop: '#090d16',
      skyBottom: '#1e1b4b',
      groundColor: '#0f172a',
      ambientColor: '#818cf8',
      lightIntensity: 1.05
    },
    hotspots: [
      {
        id: 'pc-cluster',
        title: 'Core i7 Workstations with Dual Monitors',
        category: 'Computing Nodes',
        pos: [28, -2, -28],
        desc: 'Modern dual-boot Windows 11 & Ubuntu Linux workstations running Python, SQL, C++, and Web development toolchains.',
        specs: ['Processor: Intel Core i7 13th Gen', 'RAM: 16 GB DDR5', 'Displays: 24-inch Full HD IPS Dual Screens']
      },
      {
        id: 'network-rack',
        title: 'Cisco Enterprise Gigabit Server Rack',
        category: 'Network Infrastructure',
        pos: [-36, 10, -22],
        desc: 'Central managed switches with 1 Gbps redundant fiber leased lines and collegiate firewall security.',
        specs: ['Bandwidth: 1 Gbps Leased Line', 'Firewall: Fortinet Unified Threat Management', 'Backup: 40 kVA Online UPS']
      },
      {
        id: 'smart-display',
        title: 'Interactive 86-inch 4K Touch Display',
        category: 'Smart Classroom Tech',
        pos: [2, 12, -42],
        desc: 'Interactive smart digital whiteboard used for algorithm walkthroughs, live coding demonstrations, and project reviews.',
        specs: ['Resolution: 3840 x 2160 (4K)', 'Touch Points: 20 Simultaneous Touch', 'OS: Integrated Android & Windows OPS']
      }
    ]
  },
  {
    id: 'library',
    name: 'Dr. S. Radhakrishnan Central Digital Library',
    category: 'Knowledge Repository',
    subtitle: 'Over 28,000 academic textbooks, reference encyclopedias, competitive CET/NEET coaching volumes, and e-learning pods',
    theme: {
      skyTop: '#451a03',
      skyBottom: '#78350f',
      groundColor: '#292524',
      ambientColor: '#fde68a',
      lightIntensity: 1.15
    },
    hotspots: [
      {
        id: 'book-stacks',
        title: 'Science & Commerce Text Archives',
        category: 'Book Stacks',
        pos: [-30, 4, -30],
        desc: 'Four-tiered open-access teak book stacks organized under the Dewey Decimal Classification system.',
        specs: ['Total Titles: 28,500+ Volumes', 'Journals: 42 National & International', 'Borrowing Limit: 3 Cards Per Student']
      },
      {
        id: 'digital-kiosk',
        title: 'National Digital Library (NDLI) e-Kiosks',
        category: 'Digital Repository',
        pos: [32, -3, -25],
        desc: 'Dedicated touch terminals providing instant access to 500,000+ peer-reviewed e-books and Karnataka PU Board solved papers.',
        specs: ['Affiliation: NDLI & INFLIBNET N-LIST', 'Terminals: 16 Dedicated High-Speed Browsing Pods', 'Full-Text Downloads: Available']
      },
      {
        id: 'reading-hall',
        title: 'Silent Academic Reading Hall',
        category: 'Study Zones',
        pos: [0, -6, 36],
        desc: 'Sound-dampened reading hall accommodating 250 students simultaneously with ergonomic wooden desks and LED reading lamps.',
        specs: ['Seating: 250 Capacity', 'Acoustics: Sound Absorption Baffles', 'Hours: 7:30 AM - 7:30 PM']
      }
    ]
  },
  {
    id: 'auditorium',
    name: 'Sir M. Visvesvaraya Auditorium',
    category: 'Cultural & Events',
    subtitle: '1,200-seat acoustically treated performing arts hall hosting college orientations, Pratibha Fest, and scientific symposiums',
    theme: {
      skyTop: '#311042',
      skyBottom: '#4c1d95',
      groundColor: '#18181b',
      ambientColor: '#ddd6fe',
      lightIntensity: 1.1
    },
    hotspots: [
      {
        id: 'grand-stage',
        title: 'Motorized Proscenium Theater Stage',
        category: 'Stage Architecture',
        pos: [0, 8, -44],
        desc: '45-foot wide motorized hardwood stage with motorized acoustic curtains, DMX stage spot lighting, and cyclorama backdrop.',
        specs: ['Width: 45 Feet', 'Floor: Rebounding Hardwood Teak', 'Projection: Christie 12,000-Lumen Laser 4K']
      },
      {
        id: 'audio-console',
        title: '32-Channel Digital Audio Mixing Console',
        category: 'Audio Engineering',
        pos: [34, -4, 25],
        desc: 'Behringer X32 digital audio mixer driving line-array JBL surround speakers with wireless Shure microphone diversity.',
        specs: ['Mixer: 32-Channel Digital DSP', 'Speakers: JBL Line-Array Stereo Arrays', 'Microphones: Shure Wireless UHF Diversity']
      },
      {
        id: 'seating-amphitheater',
        title: 'Tiered Ergonomic Audience Seating',
        category: 'Amphitheater',
        pos: [-28, -6, 28],
        desc: 'Steeply raked tiered velvet seating providing unobstructed sightlines from every seat in the auditorium.',
        specs: ['Capacity: 1,200 Push-Back Seats', 'Air Conditioning: Central Chilled Water HVAC', 'Acoustics: Class-A NRC Wood Paneling']
      }
    ]
  }
];

export const CampusTour3D = ({ isEmbedded = false, initialLocation = 'quadrangle' }) => {
  const mountRef = useRef(null);
  const [currentLocationId, setCurrentLocationId] = useState(initialLocation);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day', 'sunset', 'night'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [headingDegrees, setHeadingDegrees] = useState(0);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const [projectedHotspots, setProjectedHotspots] = useState([]);

  // Three.js instances ref
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereMeshRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioOscRef = useRef(null);

  // Interaction tracking refs
  const isUserInteractingRef = useRef(false);
  const onPointerDownMouseXRef = useRef(0);
  const onPointerDownMouseYRef = useRef(0);
  const lonRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const latRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const phiRef = useRef(0);
  const thetaRef = useRef(0);
  const targetFovRef = useRef(75);

  const currentLocation = CAMPUS_LOCATIONS.find(l => l.id === currentLocationId) || CAMPUS_LOCATIONS[0];

  // Helper to generate a procedural 360 panoramic texture canvas
  const createPanoramaTexture = (loc, time) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Sky & Atmosphere Gradient
    let skyTop = loc.theme.skyTop;
    let skyBottom = loc.theme.skyBottom;
    let groundColor = loc.theme.groundColor;

    if (time === 'sunset') {
      skyTop = '#450a0a';
      skyBottom = '#ea580c';
      groundColor = '#1c1917';
    } else if (time === 'night') {
      skyTop = '#020617';
      skyBottom = '#0f172a';
      groundColor = '#020617';
    }

    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(1, skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    // 2. Distant Horizon / Architectural Silhouettes
    ctx.fillStyle = time === 'night' ? '#0f172a' : '#1e293b';
    for (let x = 0; x < canvas.width; x += 60) {
      const bHeight = 70 + Math.sin(x * 0.05) * 45 + Math.cos(x * 0.02) * 20;
      ctx.fillRect(x, canvas.height * 0.65 - bHeight, 52, bHeight);
      
      // Windows glow
      if (time !== 'day') {
        ctx.fillStyle = '#fef08a';
        for (let wy = canvas.height * 0.65 - bHeight + 10; wy < canvas.height * 0.65 - 8; wy += 15) {
          ctx.fillRect(x + 10, wy, 8, 8);
          ctx.fillRect(x + 28, wy, 8, 8);
        }
        ctx.fillStyle = time === 'night' ? '#0f172a' : '#1e293b';
      }
    }

    // 3. Ground / Floor / Campus Courtyard
    const groundGrad = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
    groundGrad.addColorStop(0, groundColor);
    groundGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    // 4. Perspective Grid / Tiles on Floor
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < canvas.width; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, canvas.height * 0.65);
      ctx.lineTo(i * 1.3 - canvas.width * 0.15, canvas.height);
      ctx.stroke();
    }
    for (let y = canvas.height * 0.65; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 5. Ambient Sun / Moon Light Glow
    const celestialX = canvas.width * 0.45;
    const celestialY = canvas.height * 0.28;
    const glow = ctx.createRadialGradient(celestialX, celestialY, 10, celestialX, celestialY, 260);
    if (time === 'night') {
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      glow.addColorStop(0.2, 'rgba(224, 231, 255, 0.4)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (time === 'sunset') {
      glow.addColorStop(0, 'rgba(253, 224, 71, 0.95)');
      glow.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      glow.addColorStop(0.25, 'rgba(217, 119, 6, 0.35)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(celestialX, celestialY, 260, 0, Math.PI * 2);
    ctx.fill();

    // 6. Collegiate Watermark Banner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(loc.name.toUpperCase(), canvas.width * 0.5, canvas.height * 0.48);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Inverted Panoramic Sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert faces inwards

    const texture = createPanoramaTexture(currentLocation, timeOfDay);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereMeshRef.current = sphere;

    // 5. Render Loop with smooth projection of hotspots
    const render = () => {
      if (!cameraRef.current || !rendererRef.current || !sceneRef.current) return;

      // Auto-rotation when idle
      if (autoRotate && !isUserInteractingRef.current) {
        lonRef.current += 0.08;
      }

      // Constrain vertical pitch between -85 and 85 deg
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      phiRef.current = THREE.MathUtils.degToRad(90 - latRef.current);
      thetaRef.current = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
      const targetY = 500 * Math.cos(phiRef.current);
      const targetZ = 500 * Math.sin(phiRef.current) * Math.sin(thetaRef.current);

      cameraRef.current.lookAt(targetX, targetY, targetZ);

      // Smooth zoom interpolation
      cameraRef.current.fov += (targetFovRef.current - cameraRef.current.fov) * 0.1;
      cameraRef.current.updateProjectionMatrix();

      // Calculate heading degrees for compass (0 to 360)
      const normalizedLon = ((-lonRef.current % 360) + 360) % 360;
      setHeadingDegrees(Math.round(normalizedLon));

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      // Project 3D Hotspot positions into 2D Screen Space
      if (mountRef.current) {
        const curWidth = mountRef.current.clientWidth;
        const curHeight = mountRef.current.clientHeight;

        const nextSpots = (currentLocation.hotspots || []).map(spot => {
          const v = new THREE.Vector3(...spot.pos);
          v.project(cameraRef.current);

          // Check if in front of camera (z < 1)
          const isVisible = v.z < 1;
          const screenX = (v.x * 0.5 + 0.5) * curWidth;
          const screenY = -(v.y * 0.5 - 0.5) * curHeight;

          return {
            ...spot,
            screenX,
            screenY,
            isVisible
          };
        });

        setProjectedHotspots(nextSpots);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (texture) texture.dispose();
    };
  }, []);

  // Update texture when location or time of day changes
  useEffect(() => {
    if (sphereMeshRef.current) {
      const newTex = createPanoramaTexture(currentLocation, timeOfDay);
      sphereMeshRef.current.material.map.dispose();
      sphereMeshRef.current.material.map = newTex;
      sphereMeshRef.current.material.needsUpdate = true;
    }
  }, [currentLocationId, timeOfDay]);

  // Audio ambience synthesis via Web Audio API
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Create warm ambient pink/white noise filtered for tranquil collegiate atmosphere
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.035;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        audioOscRef.current = whiteNoise;
      } catch (e) {
        console.warn('Audio synthesis not permitted or unsupported', e);
      }
    } else {
      if (audioOscRef.current) {
        try { audioOscRef.current.stop(); } catch (e) { }
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) { }
      }
    }

    return () => {
      if (audioOscRef.current) {
        try { audioOscRef.current.stop(); } catch (e) { }
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) { }
      }
    };
  }, [soundEnabled]);

  // Pointer drag & rotation event listeners
  const onPointerDown = (e) => {
    isUserInteractingRef.current = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    onPointerDownMouseXRef.current = clientX;
    onPointerDownMouseYRef.current = clientY;

    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
  };

  const onPointerMove = (e) => {
    if (!isUserInteractingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    lonRef.current = (onPointerDownMouseXRef.current - clientX) * 0.16 + onPointerDownLonRef.current;
    latRef.current = (clientY - onPointerDownMouseYRef.current) * 0.16 + onPointerDownLatRef.current;
  };

  const onPointerUp = () => {
    isUserInteractingRef.current = false;
  };

  const onWheel = (e) => {
    e.preventDefault();
    targetFovRef.current = Math.max(35, Math.min(95, targetFovRef.current + e.deltaY * 0.05));
  };

  const resetView = () => {
    lonRef.current = 0;
    latRef.current = 0;
    targetFovRef.current = 75;
  };

  const toggleFullscreen = () => {
    const elem = mountRef.current?.parentElement;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => { });
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: isEmbedded ? '540px' : 'calc(100vh - 120px)',
      minHeight: '480px',
      backgroundColor: '#090d16',
      borderRadius: isEmbedded ? '18px' : '0px',
      overflow: 'hidden',
      boxShadow: isEmbedded ? '0 24px 60px rgba(11, 37, 69, 0.22)' : 'none',
      border: isEmbedded ? '1.5px solid rgba(212, 175, 55, 0.3)' : 'none',
      userSelect: 'none'
    }}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onWheel={onWheel}
        style={{ width: '100%', height: '100%', cursor: isUserInteractingRef.current ? 'grabbing' : 'grab' }}
      />

      {/* Floating 3D Spatial Hotspots Layer */}
      {hotspotsVisible && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {projectedHotspots.map(spot => {
            if (!spot.isVisible) return null;
            return (
              <div
                key={spot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedHotspot(spot);
                }}
                style={{
                  position: 'absolute',
                  left: `${spot.screenX}px`,
                  top: `${spot.screenY}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                {/* Glowing Pulsing 3D Pin */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212, 175, 55, 0.35)',
                    animation: 'pulse3dPin 2s infinite ease-out'
                  }} />
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    border: '2px solid #ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B2545',
                    transition: 'transform 0.18s ease'
                  }}>
                    <Sparkles size={13} strokeWidth={2.6} />
                  </div>

                  {/* Hotspot Hover Label */}
                  <div style={{
                    position: 'absolute',
                    top: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(11, 37, 69, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)'
                  }}>
                    {spot.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top HUD Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 30
      }}>
        {/* Active Location Badge */}
        <div style={{
          pointerEvents: 'auto',
          backgroundColor: 'rgba(11, 37, 69, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '12px',
          padding: '0.65rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 10px #10b981'
          }} />
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: '700', letterSpacing: '0.05em' }}>
              3D Virtual Tour • {currentLocation.category}
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: '800' }}>
              {currentLocation.name}
            </div>
          </div>
        </div>

        {/* Right HUD Tools (Compass, Time, Audio, Fullscreen) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'auto'
        }}>
          {/* Compass HUD */}
          <div
            title={`Facing: ${headingDegrees}°`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }}
          >
            <Compass size={20} style={{ transform: `rotate(${-headingDegrees}deg)`, transition: 'transform 0.1s linear' }} />
          </div>

          {/* Time of Day Lighting Toggle */}
          <button
            type="button"
            onClick={() => setTimeOfDay(prev => prev === 'day' ? 'sunset' : prev === 'sunset' ? 'night' : 'day')}
            title={`Lighting Mode: ${timeOfDay.toUpperCase()}`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            {timeOfDay === 'day' ? <Sun size={18} color="#facc15" /> : timeOfDay === 'sunset' ? <Sunset size={18} color="#fb923c" /> : <Moon size={18} color="#93c5fd" />}
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause 3D Orbit' : 'Resume 3D Orbit'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: autoRotate ? 'rgba(212, 175, 55, 0.25)' : 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: autoRotate ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: autoRotate ? '#D4AF37' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            {autoRotate ? <Pause size={17} /> : <Play size={17} />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Campus Ambiance' : 'Enable Campus Ambiance'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: soundEnabled ? 'rgba(212, 175, 55, 0.25)' : 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: soundEnabled ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: soundEnabled ? '#D4AF37' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={resetView}
            title="Reset Perspective"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={17} />
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen 3D View"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(11, 37, 69, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Hotspot Inspection Modal Overlay */}
      {selectedHotspot && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '92%',
          maxWidth: '520px',
          backgroundColor: 'rgba(11, 37, 69, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #D4AF37',
          borderRadius: '14px',
          padding: '1.4rem',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          animation: 'slideUpHotspot 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <span style={{
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                color: '#D4AF37',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                {selectedHotspot.category}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '0.35rem', color: '#ffffff' }}>
                {selectedHotspot.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
            {selectedHotspot.desc}
          </p>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: '700', marginBottom: '0.4rem' }}>
              Equipment & Technical Specifications:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {selectedHotspot.specs?.map((spec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                  <CheckCircle2 size={13} color="#10b981" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedHotspot(null)}
            className="btn btn-gold btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Continue 3D Walkthrough
          </button>
        </div>
      )}

      {/* Bottom Locations Carousel Selector */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        padding: '0.4rem 0',
        zIndex: 30,
        pointerEvents: 'auto'
      }}>
        {CAMPUS_LOCATIONS.map(loc => {
          const isActive = loc.id === currentLocationId;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => {
                setCurrentLocationId(loc.id);
                setSelectedHotspot(null);
                resetView();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.95)' : 'rgba(11, 37, 69, 0.88)',
                backdropFilter: 'blur(8px)',
                color: isActive ? '#0B2545' : '#ffffff',
                border: isActive ? '1.5px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 6px 18px rgba(212, 175, 55, 0.35)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <MapPin size={14} color={isActive ? '#0B2545' : '#D4AF37'} />
              <span>{loc.name.split(' ')[0]} {loc.name.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse3dPin {
          0% { transform: scale(0.85); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.2; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes slideUpHotspot {
          from { opacity: 0; transform: translate(-50%, 15px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default CampusTour3D;
