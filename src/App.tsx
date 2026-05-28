import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, Check, Copy, Sparkles, Smartphone, Tablet, Monitor, 
  RefreshCw, Download, Layout, Info, Layers, Settings, X, 
  MessageSquare, Send, ArrowRight, Eye, Code, FileText, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GenerationOptions, GenerationResult, RefinementMessage } from "./types";
import ThreeJsBackground from "./components/ThreeJsBackground";

const PRESETS = [
  {
    id: 'dashboard',
    title: 'Admin Dashboard',
    description: 'Grid layout featuring charts, stat panels, side-navigation bar and core metrics cards.',
    colorClass: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:#0b0f19;border:1px solid #1e293b;border-radius:8px;"><rect x="10" y="10" width="80" height="280" fill="#151d30" rx="6"/><circle cx="50" cy="40" r="15" fill="#312e81" /><rect x="25" y="80" width="50" height="8" fill="#3b82f6" rx="2"/><rect x="25" y="100" width="50" height="8" fill="#475569" rx="2"/><rect x="25" y="120" width="50" height="8" fill="#475569" rx="2"/><rect x="100" y="10" width="290" height="40" fill="#151d30" rx="6"/><text x="115" y="34" font-family="'Inter', sans-serif" font-size="13" fill="#94a3b8" font-weight="bold">System Console</text><rect x="100" y="60" width="85" height="50" fill="#1e293b" rx="6"/><text x="110" y="78" font-family="sans-serif" font-size="9" fill="#64748b">Active Users</text><text x="110" y="98" font-family="sans-serif" font-size="14" fill="#38bdf8" font-weight="bold">12,450</text><rect x="195" y="60" width="100" height="50" fill="#1e293b" rx="6"/><text x="205" y="78" font-family="sans-serif" font-size="9" fill="#64748b">Monthly Sales</text><text x="205" y="98" font-family="sans-serif" font-size="14" fill="#818cf8" font-weight="bold">$45,210</text><rect x="305" y="60" width="85" height="50" fill="#1e293b" rx="6"/><text x="315" y="78" font-family="sans-serif" font-size="9" fill="#64748b">Conversion</text><text x="315" y="98" font-family="sans-serif" font-size="14" fill="#34d399" font-weight="bold">+24.5%</text><rect x="100" y="120" width="190" height="110" fill="#151d30" rx="6"/><line x1="110" y1="200" x2="280" y2="200" stroke="#1e293b" stroke-width="2"/><path d="M 110 190 L 140 150 L 170 170 L 210 130 L 250 160 L 280 120" fill="none" stroke="#6366f1" stroke-width="2.5"/><rect x="300" y="120" width="90" height="110" fill="#151d30" rx="6"/><circle cx="345" cy="175" r="25" fill="none" stroke="#1e293b" stroke-width="6"/><circle cx="345" cy="175" r="25" fill="none" stroke="#ec4899" stroke-width="6" stroke-dasharray="100 200"/><rect x="100" y="240" width="290" height="50" fill="#151d30" rx="6"/><circle cx="120" cy="265" r="10" fill="#4f46e5"/><rect x="140" y="260" width="120" height="10" fill="#94a3b8" rx="2"/></svg>`
  },
  {
    id: 'pricing',
    title: 'Bento Pricing Column',
    description: 'Immersive dark bento grid showing 3 options decorated with tier lists and distinct buttons.',
    colorClass: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;"><text x="200" y="45" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" fill="#ffffff" font-weight="bold">Supercharge Your Stack</text><text x="200" y="65" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#64748b">Simple, transparent, scale-friendly pricing tiers.</text><rect x="25" y="90" width="105" height="185" fill="#1e293b" rx="8"/><text x="77" y="120" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94a3b8">Developer</text><text x="77" y="145" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="bold">$0</text><text x="77" y="160" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#64748b">per month</text><rect x="37" y="235" width="80" height="24" fill="#334155" rx="4"/><text x="77" y="250" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#ffffff">Get Started</text><rect x="145" y="90" width="110" height="185" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" rx="8"/><text x="200" y="120" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#818cf8" font-weight="bold">Business Pro</text><text x="200" y="145" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="bold">$19</text><text x="200" y="160" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#94a3b8">per month</text><rect x="160" y="235" width="80" height="24" fill="#4f46e5" rx="4"/><text x="200" y="250" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#ffffff" font-weight="bold">Try Pro Free</text><rect x="180" y="98" width="40" height="12" fill="#f43f5e" rx="3"/><text x="200" y="107" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#ffffff" font-weight="bold">BEST</text><rect x="270" y="90" width="105" height="185" fill="#1e293b" rx="8"/><text x="322" y="120" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94a3b8">Enterprise</text><text x="322" y="145" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#ffffff" font-weight="bold">$99</text><text x="322" y="160" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#64748b">per month</text><rect x="282" y="235" width="80" height="24" fill="#334155" rx="4"/><text x="322" y="250" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#ffffff">Talk to Sales</text></svg>`
  },
  {
    id: 'login',
    title: 'Modern Sign In Portal',
    description: 'Perfect visual alignment featuring inputs, logo markers, and clear headers.',
    colorClass: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400',
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width="400" height="300" style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;"><rect x="110" y="20" width="180" height="260" fill="#ffffff" rx="12"/><text x="200" y="55" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#0f172a" font-weight="bold">Welcome back</text><text x="200" y="70" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Enter your credentials below</text><text x="130" y="100" font-family="sans-serif" font-size="8" fill="#475569" font-weight="bold">Email Address</text><rect x="130" y="105" width="140" height="24" fill="#f8fafc" stroke="#e2e8f0" rx="4"/><text x="138" y="120" font-family="sans-serif" font-size="8" fill="#94a3b8">name@example.com</text><text x="130" y="145" font-family="sans-serif" font-size="8" fill="#475569" font-weight="bold">Password</text><rect x="130" y="150" width="140" height="24" fill="#f8fafc" stroke="#e2e8f0" rx="4"/><text x="138" y="165" font-family="sans-serif" font-size="12" fill="#94a3b8">••••••••</text><rect x="130" y="190" width="140" height="26" fill="#0f172a" rx="6"/><text x="200" y="206" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#ffffff" font-weight="bold">Sign In</text><text x="200" y="235" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#64748b">Don't have an account? <tspan fill="#3b82f6" font-weight="bold">Sign up</tspan></text></svg>`
  }
];

const LOADING_STAGES = [
  "🔍 Spark: Reading design wireframes and structures...",
  "📐 Mapping layouts: Generating grids, containers and margin values...",
  "🎨 Extracting color tokens: Identifying hex mappings and brand tones...",
  "🔠 Styling typography: Sourcing elegant Google Web Fonts...",
  "💻 Injecting elements: Designing responsive buttons, lists and dashboards...",
  "⚡ Adding interactivity: Programming fully functional JS tabs and animated toggles...",
  "✨ Finalizing aesthetics: Decorating visual spaces with themed high-res references..."
];

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [framework, setFramework] = useState<GenerationOptions['framework']>('html-tailwind');
  const [style, setStyle] = useState<GenerationOptions['style']>('modern');
  const [customInstructions, setCustomInstructions] = useState('');
  
  // Three.js, Translation target languages, and Developer Tweaks state
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  const [threeJsEnabled, setThreeJsEnabled] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [cssVarSetup, setCssVarSetup] = useState<'tailwind' | 'bootstrap' | 'custom-css'>('tailwind');
  const [engineMode, setEngineMode] = useState<'interactive' | 'commented' | 'lean'>('interactive');
  const [customHeaders, setCustomHeaders] = useState<string>('');
  const [showDevOpts, setShowDevOpts] = useState<boolean>(false);
  
  // App logic states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'explanation'>('preview');
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Refinement memory states
  const [refineInput, setRefineInput] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);
  const [history, setHistory] = useState<RefinementMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Handle auto-progress loader messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Scroll to bottom of refinement dialogue box
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Clear states
  const handleReset = () => {
    setImage(null);
    setResult(null);
    setHistory([]);
    setErrorStatus(null);
    setCustomInstructions('');
  };

  // Convert SVG Preset into loaded asset with zero CORS hassle
  const selectPreset = (presetSvg: string) => {
    setErrorStatus(null);
    try {
      const base64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(presetSvg)));
      setImage(base64);
    } catch (e) {
      console.error(e);
      setErrorStatus("Could not compile standard preset vector.");
    }
  };

  // Handle File Input conversion
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorStatus(null);
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorStatus("Format error: Please submit valid images only (PNG, JPG, SVG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setErrorStatus("Failed to deserialize file stream.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorStatus(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Generation Trigger: POST /api/convert
  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setErrorStatus(null);
    setResult(null);
    setHistory([]);

    const options: GenerationOptions = {
      framework,
      style,
      customInstructions,
      targetLanguage,
      threeJsEnabled,
      developerOptions: {
        temperature,
        cssVarSetup,
        engineMode,
        customHeaders
      }
    };

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image,
          options
        })
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "The server failed to parse the UI mockup.");
      }

      const backendData = await response.json();
      
      setResult({
        id: Date.now().toString(),
        code: backendData.htmlCode,
        frameworkCode: backendData.frameworkCode,
        explanation: backendData.explanation,
        timestamp: new Date().toLocaleTimeString(),
        options,
        imageUrl: image
      });
      
      setActiveTab('preview');
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || "An unexpected compile failure occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Iterative Optimization: POST /api/refine
  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim() || !result) return;

    const userPrompt = refineInput.trim();
    setRefineInput('');
    setRefineLoading(true);
    setErrorStatus(null);

    // Save user message
    const updatedHistory: RefinementMessage[] = [
      ...history,
      { role: 'user', content: userPrompt, timestamp: new Date().toLocaleTimeString() }
    ];
    setHistory(updatedHistory);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history: updatedHistory,
          previousCode: result.code,
          previousFrameworkCode: result.frameworkCode,
          instruction: userPrompt,
          options: result.options,
          image: result.imageUrl // Keep original image context
        })
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.error || "The model was unable to merge feedback into the code.");
      }

      const backendData = await response.json();

      // Update current result codebases
      setResult(prev => {
        if (!prev) return null;
        return {
          ...prev,
          code: backendData.htmlCode,
          frameworkCode: backendData.frameworkCode,
          explanation: backendData.explanation
        };
      });

      // Embed architect feedback to conversation history
      setHistory(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: backendData.explanation || "I have successfully compiled those visual updates into the app sandbox. Check the interactive preview window!", 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);

    } catch (err: any) {
      console.error(err);
      setErrorStatus(`Refinement Error: ${err.message}`);
      setHistory(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ I ran into an error adding that update: ${err.message}`, timestamp: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setRefineLoading(false);
    }
  };

  // Copy helper
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct code file downloader
  const downloadCodeFile = () => {
    if (!result) return;
    const fileText = activeTab === 'code' ? result.frameworkCode : result.code;
    const extension = activeTab === 'code' 
      ? (framework === 'react-tailwind' ? 'tsx' : 'html') 
      : 'html';
    
    const fileBlob = new Blob([fileText], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(fileBlob);
    
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `index-generated.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <div id="app_root" className="min-h-screen bg-[#0F0F0F] text-white font-sans flex flex-col antialiased relative overflow-hidden">
      
      {/* Backdropped Celestial Three.js Universe */}
      <ThreeJsBackground intensity={loading || refineLoading ? 3.0 : 1.0} />
      
      {/* Visual Navigation Bar */}
      <header id="app_header" className="h-20 border-b border-white/10 bg-[#0F0F0F] sticky top-0 z-40 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D4FF00] rounded-none rotate-12 flex items-center justify-center shadow-lg shadow-[#D4FF00]/10">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white flex items-center gap-2">
              IMAGER.AI <span className="text-[10px] uppercase font-mono font-bold bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/20 px-2 py-0.5 rounded-none">V3.5 FLASH</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest font-mono text-white/50">Neural vision-to-structure translation engine</p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest font-bold text-white/40">
          <a href="#" className="hover:text-white transition hidden md:inline">Engine</a>
          <a href="#" className="hover:text-white transition hidden md:inline">Showcase</a>
          {result && (
            <button 
              id="clear_builder"
              onClick={handleReset}
              className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white px-3.5 py-2 rounded-none transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Start Fresh</span>
            </button>
          )}
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-[#D4FF00] font-bold uppercase tracking-widest hover:text-white transition"
          >
            Dashboard &rarr;
          </a>
        </div>
      </header>

      {/* Main Container Grid */}
      <main id="app_main" className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Error Alert Box */}
        {/* Error Alert Box */}
        {errorStatus && (
          <div id="error_banner" className="lg:col-span-12 bg-red-950/20 border border-red-500/20 text-red-300 p-4 rounded-none flex items-start space-x-3 shadow-xl font-mono">
            <X className="h-5 w-5 stroke-[2.5] text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-extrabold text-xs uppercase tracking-widest">SYSTEM DECODE FAILURE WARNING</span>
              <p className="text-[11px] text-red-200/80 mt-1">{errorStatus}</p>
            </div>
            <button onClick={() => setErrorStatus(null)} className="hover:bg-red-900/20 p-1 transition rounded-none">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ================= COLUMN 1: CONTROL CENTER (Lg: col-span-5) ================= */}
        <section id="workshop_control_panel" className="lg:col-span-5 space-y-6">
          
          {/* Card: Design Image Asset Upload/Selector */}
          <div className="bg-black/40 border border-white/10 rounded-none p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#D4FF00]" />
                1. INPUT STRUCTURAL WIREFRAME
              </span>
              {image && (
                <button 
                  onClick={() => setImage(null)}
                  className="text-[10px] font-mono uppercase tracking-wider text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> [CLEAR]
                </button>
              )}
            </div>

            {/* Drag & Drop Visual Box */}
            {!image ? (
              <div 
                id="drop_zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border bg-white/5 flex flex-col items-center justify-center min-h-[220px] cursor-pointer transition-all duration-200 gap-3 rounded-none ${
                  isDragOver 
                    ? 'border-[#D4FF00] bg-[#D4FF00]/5' 
                    : 'border-white/20 hover:border-[#D4FF00] hover:bg-[#D4FF00]/5'
                }`}
                onClick={() => document.getElementById('manual_file_upload')?.click()}
              >
                <div className="w-12 h-12 flex items-center justify-center border border-white/20">
                  <Upload className="h-4 w-4 text-[#D4FF00]" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-white">Upload Screenshot</p>
                  <p className="text-[9px] font-mono text-white/30 uppercase">Drag & drop JPG, PNG, or WebP</p>
                </div>
                <input 
                  type="file" 
                  id="manual_file_upload"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div id="image_loaded_preview" className="relative group rounded-none overflow-hidden bg-[#0F0F0F] aspect-video flex items-center justify-center border border-white/10">
                <img 
                  referrerPolicy="no-referrer"
                  src={image} 
                  alt="UI blueprint" 
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-mono font-bold text-[#D4FF00] uppercase tracking-wider">Aesthetic Target Loaded</span>
                  <p className="text-[9px] font-mono text-white/40 uppercase">Ready for architectural synthesis</p>
                </div>
              </div>
            )}

            {/* Offline Wireframe Presets */}
            {!image && (
              <div id="wireframe_presets_sec" className="space-y-3 pt-2">
                <h3 className="text-[9px] font-mono uppercase tracking-widest text-white/40">Select a template pattern:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset.svg)}
                      className="relative overflow-hidden text-left p-3.5 border border-white/10 bg-black/40 hover:border-[#D4FF00] hover:bg-[#D4FF00]/5 transition-all flex flex-col justify-between h-[110px] rounded-none group"
                    >
                      <div className="space-y-1 z-10">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider block truncate">{preset.title}</span>
                        <p className="text-[9px] font-mono text-white/40 leading-normal line-clamp-2">{preset.description}</p>
                      </div>
                      <div className="mt-3 flex items-center text-[9px] text-[#D4FF00] font-bold font-mono uppercase tracking-widest z-10 group-hover:translate-x-0.5 transition-transform">
                        <span>Load Pattern &rarr;</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card: Fine-tune Parameters */}
          <div className="bg-black/40 border border-white/10 rounded-none p-5 shadow-xl space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4FF00] flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              2. DECODER SPECIFICATIONS
            </span>

            {/* Target Framework / Languages */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold">Target Programming Environment</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'html-tailwind', label: 'HTML + TW CDN' },
                  { id: 'react-tailwind', label: 'React TS Component' },
                  { id: 'vanilla', label: 'Vanilla HTML/CSS' },
                  { id: 'vue-tailwind', label: 'Vue 3 setup lang' },
                  { id: 'svelte-tailwind', label: 'Svelte Standalone' },
                  { id: 'nextjs-tailwind', label: 'NextJS v14 Router' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFramework(item.id as any)}
                    className={`py-2 px-1.5 border transition-all font-mono uppercase text-[8px] tracking-wider rounded-none text-center ${
                      framework === item.id
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-black'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-[#D4FF00]/5 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Localization Language Target */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold">Output Human Language</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['English', 'Spanish', 'Japanese', 'Indonesian', 'German', 'French', 'Korean', 'Chinese'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setTargetLanguage(lang)}
                    className={`py-1.5 px-0.5 border text-center font-mono uppercase text-[8px] tracking-tight rounded-none transition-all ${
                      lang === targetLanguage
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-black'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-[#D4FF00]/5 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Theme Vibe */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold">Esthetic Accent Theme</label>
              <div className="grid grid-cols-5 gap-1">
                {(['modern', 'dark', 'playful', 'minimalist', 'cyberpunk'] as const).map((vib) => (
                  <button
                    key={vib}
                    type="button"
                    onClick={() => setStyle(vib)}
                    className={`py-1.5 px-0.5 border capitalize text-center font-mono uppercase text-[8px] tracking-tighter rounded-none transition-all ${
                      style === vib
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-black'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-[#D4FF00]/5 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {vib}
                  </button>
                ))}
              </div>
            </div>

            {/* ThreeJS Visuals Activation Selector */}
            <div className="flex items-center justify-between border-t border-b border-white/10 py-3 my-2">
              <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#D4FF00]" />
                Inject Three.js 3D Visual Sandbox
              </span>
              <button
                type="button"
                onClick={() => setThreeJsEnabled(!threeJsEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center transition-all duration-300 rounded-none border ${
                  threeJsEnabled ? 'bg-[#D4FF00] border-[#D4FF00]' : 'bg-white/5 border-white/20'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform transition-transform duration-300 bg-white ${
                    threeJsEnabled ? 'translate-x-4.5 bg-black' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Custom Extra Instructions */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono tracking-widest text-white/50 uppercase block font-semibold">Engineering Directives [OPTIONAL]</label>
                <span className="text-[9px] font-mono text-white/30 uppercase">E.g. "Add slide out sidebar"</span>
              </div>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="PROMPT CUSTOM VARIATIONS, ADJUST GRADIENTS, OVERRIDE LABELS OR TEXT STRUCTURES HERE..."
                rows={2}
                className="w-full bg-[#0F0F0F] text-white placeholder-white/20 text-[10px] font-mono rounded-none p-2.5 border border-white/10 focus:outline-none focus:border-[#D4FF00] transition-all resize-none uppercase"
              />
            </div>

            {/* Advanced Developer Settings Accordion */}
            <div className="border border-white/10 bg-black/50 overflow-hidden rounded-none transition-all duration-200">
              <button
                type="button"
                onClick={() => setShowDevOpts(!showDevOpts)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#0F0F0F] text-[9px] font-mono tracking-widest text-[#D4FF00] uppercase font-bold hover:bg-[#141414] transition-all"
              >
                <span>[ Developer Options / Tweaks ]</span>
                <span className="text-[8px] font-mono text-white/40">{showDevOpts ? "Collapse [ - ]" : "Expand [ + ]"}</span>
              </button>
              
              <AnimatePresence>
                {showDevOpts && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3.5 py-3 space-y-3.5 border-t border-white/10 overflow-hidden"
                  >
                    {/* Temperature Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[8px] font-mono tracking-wider text-white/45 uppercase font-bold text-[8px]">Generation Temp: {temperature}</label>
                        <span className="text-[8px] font-mono text-white/30 uppercase">{temperature === 0.0 ? "Deterministic" : temperature === 1.5 ? "Chaotic" : "Creative"}</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="1.5"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-none appearance-none cursor-pointer accent-[#D4FF00]"
                      />
                    </div>

                    {/* CSS Archetype Architecture Blueprint */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono tracking-wider text-white/45 uppercase font-bold block">CSS Blueprint Framework</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['tailwind', 'bootstrap', 'custom-css'] as const).map((setup) => (
                          <button
                            key={setup}
                            type="button"
                            onClick={() => setCssVarSetup(setup)}
                            className={`py-1 px-0.5 border text-center font-mono uppercase text-[7.5px] tracking-tight rounded-none transition-all ${
                              cssVarSetup === setup
                                ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-bold'
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-[#D4FF00]/5 hover:text-white'
                            }`}
                          >
                            {setup === 'tailwind' ? 'Tailwind' : setup === 'bootstrap' ? 'Bootstrap 5' : 'Plain CSS'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Builder Engine Mode */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono tracking-wider text-white/45 uppercase font-bold block">Synthesis Optimization Mode</label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['interactive', 'commented', 'lean'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setEngineMode(mode)}
                            className={`py-1 px-0.5 border text-center font-mono uppercase text-[7.5px] tracking-tight rounded-none transition-all ${
                              engineMode === mode
                                ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-bold'
                                : 'bg-white/5 border-white/5 text-white/30 hover:bg-[#D4FF00]/5 hover:text-white'
                            }`}
                          >
                            {mode === 'interactive' ? 'High Interact' : mode === 'commented' ? 'Comments' : 'Lean Size'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* System Override Prompt Headers */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono tracking-wider text-white/45 uppercase font-bold block">Dev Rules Headers</label>
                      <input
                        type="text"
                        value={customHeaders}
                        onChange={(e) => setCustomHeaders(e.target.value)}
                        placeholder="E.G. 'USE FLEX OVER FLOW...'"
                        className="w-full bg-[#0F0F0F] text-white placeholder-white/10 text-[8px] font-mono rounded-none p-1.5 border border-white/10 focus:outline-none focus:border-[#D4FF00] uppercase"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Synthesis Action Button */}
            <button
              id="synthesize_layout"
              type="button"
              disabled={!image || loading}
              onClick={handleGenerate}
              className={`w-full py-4 px-6 font-mono font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center space-x-2 rounded-none border ${
                !image 
                  ? 'bg-white/5 text-white/25 border-white/10 cursor-not-allowed'
                  : 'bg-[#D4FF00] text-black hover:bg-[#c4ed00] border-[#D4FF00] shadow-md shadow-[#D4FF00]/10 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Website Layout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-black animate-pulse" />
                  <span>Synthesize Code & Sandbox Canvas</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestion Card */}
          <div className="bg-[#0F0F0F] border border-white/10 rounded-none p-4 text-[9px] font-mono uppercase tracking-widest text-white/40 leading-relaxed flex items-start gap-3">
            <Info className="h-4 w-4 text-[#D4FF00] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase tracking-widest">TRANSLATION TIP</span>
              <p className="mt-1">
                Our vision converter translates layout boxes instantly into tailwind layers, extracts wireframe margins, and injects royalty-free high-res illustrations from active context vectors automatically.
              </p>
            </div>
          </div>
        </section>

        {/* ================= COLUMN 2: WORKSHOP WORK BENCH (Lg: col-span-7) ================= */}
        <section id="workshop_workbench" className="lg:col-span-7 space-y-6">

          {/* Live sandbox compile states */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading_sandbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-black/40 border border-white/10 rounded-none p-8 min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl"
              >
                <div className="relative">
                  {/* Rotating outer spinner */}
                  <div className="h-16 w-16 border-2 border-white/10 border-t-[#D4FF00] animate-spin" />
                  {/* Beating inner star */}
                  <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-5 w-5 text-[#D4FF00]" />
                  </div>
                </div>

                <div className="space-y-3 max-w-sm">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1 uppercase">PIPELINE ACTIVE</span>
                  <h3 className="text-sm tracking-widest uppercase font-black text-white">Synthesizing Digital Assets</h3>
                  <div className="bg-[#0F0F0F] border border-white/10 p-3.5 font-mono text-[10px] text-[#D4FF00]/90 h-12 flex items-center justify-center">
                    {LOADING_STAGES[loadingStep]}
                  </div>
                  <p className="text-[10px] font-mono text-white/40 tracking-wider leading-relaxed">
                    Our server-side generator parses raw screenshots to build clean responsive code components.
                  </p>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div 
                key="empty_sandbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/40 border border-white/10 rounded-none p-8 min-h-[500px] flex flex-col items-center justify-center text-center space-y-5 shadow-xl"
              >
                <div className="h-14 w-14 rounded-none bg-[#0F0F0F] flex items-center justify-center text-slate-500 border border-white/10">
                  <Layout className="h-6 w-6 text-[#D4FF00]" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-white">Live Compilation Sandbox</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-mono uppercase tracking-wide">
                    Once you upload your UI screenshot, select wireframes, or enter custom instructions and click **Synthesize**, the complete responsive HTML webpage code and a live simulated testing sandbox will load instantly in this frame.
                  </p>
                </div>
                {image && (
                  <button
                    onClick={handleGenerate}
                    className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-[#D4FF00] bg-[#D4FF00]/10 border border-[#D4FF00]/20 px-5 py-3 rounded-none hover:bg-[#D4FF00]/20 transition-all font-mono"
                  >
                    <span>Mount Sandbox Canvas</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>
            )}

            {!loading && result && (
              <motion.div 
                key="active_workbench"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* Result frame header & export tab selector */}
                <div className="bg-black/40 border border-white/10 rounded-none p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Selector tabs */}
                  <div className="flex items-center bg-[#0F0F0F] rounded-none p-1 border border-white/10 self-start sm:self-auto font-mono uppercase tracking-widest font-black text-[9px]">
                    <button
                      id="tab_preview"
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-none transition-all ${
                        activeTab === 'preview' 
                          ? 'bg-white/10 text-[#D4FF00] font-black' 
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Sandbox</span>
                    </button>
                    <button
                      id="tab_code"
                      onClick={() => setActiveTab('tab_code')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-none transition-all ${
                        activeTab === 'code' 
                          ? 'bg-white/10 text-[#D4FF00] font-black' 
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <Code className="h-3.5 w-3.5" />
                      <span>Clean Exports</span>
                    </button>
                    <button
                      id="tab_explanation"
                      onClick={() => setActiveTab('explanation')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-none transition-all ${
                        activeTab === 'explanation' 
                          ? 'bg-white/10 text-[#D4FF00] font-black' 
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>UX Insights</span>
                    </button>
                  </div>

                  {/* Actions (Clipboard Copy & Source Downloader) */}
                  <div className="flex items-center space-x-2.5">
                    
                    {/* Viewport resizing if active page is iframe preview */}
                    {activeTab === 'preview' && (
                      <div className="flex items-center bg-[#0F0F0F] border border-white/10 rounded-none p-1 mr-2">
                        <button
                          title="Desktop Viewport"
                          onClick={() => setPreviewWidth('desktop')}
                          className={`p-1.5 rounded-none transition-all ${previewWidth === 'desktop' ? 'bg-white/10 text-[#D4FF00]' : 'text-white/30 hover:text-white'}`}
                        >
                          <Monitor className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Tablet Viewport (768px)"
                          onClick={() => setPreviewWidth('tablet')}
                          className={`p-1.5 rounded-none transition-all ${previewWidth === 'tablet' ? 'bg-white/10 text-[#D4FF00]' : 'text-white/30 hover:text-white'}`}
                        >
                          <Tablet className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Mobile Viewport (375px)"
                          onClick={() => setPreviewWidth('mobile')}
                          className={`p-1.5 rounded-none transition-all ${previewWidth === 'mobile' ? 'bg-white/10 text-[#D4FF00]' : 'text-white/30 hover:text-white'}`}
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleCopyToClipboard(activeTab === 'code' ? result.frameworkCode : result.code)}
                      className="bg-white/5 hover:bg-white hover:text-black text-white px-3.5 py-2 text-[10px] uppercase font-bold tracking-widest border border-white/10 rounded-none transition-all"
                    >
                      {copied ? (
                        <span className="text-[#D4FF00]">Copied!</span>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>

                    <button
                      onClick={downloadCodeFile}
                      className="bg-[#D4FF00] hover:bg-[#c4ed00] text-black font-black text-[10px] uppercase tracking-widest px-3.5 py-2 rounded-none transition-all shadow-md shadow-[#D4FF00]/10"
                    >
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* workbench active tab display content */}
                <div className="bg-black/40 border border-white/10 rounded-none overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
                  
                  {activeTab === 'preview' && (
                    <div id="compiled_live_testing_sandbox" className="flex-1 bg-[#0F0F0F] p-4 flex justify-center items-start transition-all duration-300 min-h-[480px]">
                      <div 
                        className="transition-all duration-300 rounded-none overflow-hidden border border-white/10 bg-white shadow-2xl min-h-[480px]"
                        style={{ 
                          width: previewWidth === 'desktop' ? '100%' : previewWidth === 'tablet' ? '768px' : '375px',
                          maxWidth: '100%',
                          minHeight: '480px'
                        }}
                      >
                        {/* Interactive sandboxed iframe content */}
                        <iframe
                          title="Interactive Playground Sandbox"
                          sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                          srcDoc={result.code}
                          className="w-full min-h-[480px] h-full border-0 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'code' && (
                    <div id="technical_editor_output" className="flex-1 overflow-auto flex flex-col h-[500px]">
                      
                      {/* Code language details banner */}
                      <div className="bg-[#0F0F0F] px-4 py-3 border-b border-white/10 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#D4FF00]">
                        <span>
                          {framework === 'react-tailwind' 
                            ? 'COMPONENT.TSX // REACT COMPONENT & TAILWIND V4' 
                            : framework === 'vanilla' 
                              ? 'INDEX.HTML // RAW CORE MARKUP & CUSTOM CSS' 
                              : 'INDEX.HTML // STANDALONE MARKUP + CDN PLAYBACK'}
                        </span>
                        <span className="text-white/30 uppercase tracking-widest">READ ONLY</span>
                      </div>

                      {/* Monospace Code window */}
                      <pre className="flex-1 p-5 bg-[#0F0F0F]/60 font-mono text-[11px] text-[#D4FF00] overflow-auto whitespace-pre leading-relaxed select-all">
                        <code>{result.frameworkCode}</code>
                      </pre>
                    </div>
                  )}

                  {activeTab === 'explanation' && (
                    <div id="visual_insights_output" className="flex-1 p-6 text-white/80 leading-relaxed max-w-none prose prose-invert overflow-auto h-[500px] space-y-4">
                      <div className="flex items-center space-x-2 text-white border-b border-white/10 pb-3">
                        <Info className="h-4 w-4 text-[#D4FF00]" />
                        <h3 className="text-xs uppercase font-mono tracking-widest font-black">Visual System Decoded Insights</h3>
                      </div>
                      <div className="text-[11px] font-mono bg-black/40 p-4 border border-white/10 rounded-none whitespace-pre-wrap leading-relaxed text-white/75">
                        {result.explanation}
                      </div>

                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-black/35 rounded-none border border-white/10">
                          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-white block mb-1">Tailwind V4 Contextual Renderer</span>
                          <p className="text-[10px] font-mono text-white/40 leading-relaxed">The live preview simulator sandbox imports browser runtime compilers directly from verified CDNs for instant aesthetic rendering.</p>
                        </div>
                        <div className="p-4 bg-black/35 rounded-none border border-white/10">
                          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-white block mb-1">Active JS Routine Injector</span>
                          <p className="text-[10px] font-mono text-white/40 leading-relaxed">Layout tabs, toggles, sub menus, and metric inputs are automatically mapped inside vanilla window callbacks.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= REFINEMENT CONTROL CONSOLE PANEL (CONVERSATIONAL LOGIC) ================= */}
                <div className="bg-black/40 border border-white/10 rounded-none overflow-hidden shadow-2xl flex flex-col">
                  <div className="bg-[#141414] px-5 py-4 border-b border-white/10 flex items-center justify-between font-mono">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-[#D4FF00]" />
                      <span className="text-[10px] font-bold tracking-widest text-[#D4FF00] uppercase font-mono">
                        Neural Refiner & Visual Iterations
                      </span>
                    </div>
                    <span className="text-[9px] uppercase font-mono font-bold bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/20 px-2 py-0.5 rounded-none">
                      DIALECT STREAM: ONLINE
                    </span>
                  </div>

                  {/* Message transcript scrolling frame */}
                  <div className="p-4 bg-[#0F0F0F]/60 min-h-[160px] max-h-[250px] overflow-auto space-y-4 font-mono">
                    {history.length === 0 ? (
                      <div className="h-[120px] flex flex-col items-center justify-center text-center space-y-2 text-white/30 text-xs">
                        <MessageSquare className="h-6 w-6 stroke-[1.5] text-white/20 animate-pulse" />
                        <span className="uppercase tracking-widest font-bold">Feedback module standby</span>
                        <p className="text-[9px] text-white/40 leading-normal uppercase">Enter specific styling directives to change colors, forms, charts or spacing.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pr-1">
                        {history.map((msg, idx) => (
                          <div 
                            key={idx} 
                            className={`flex flex-col max-w-[85%] ${
                              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                            }`}
                          >
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-[9px] font-semibold text-white/40 capitalize">{msg.role}</span>
                              <span className="text-[8px] text-white/20">• {msg.timestamp}</span>
                            </div>
                            <div 
                              className={`p-3 rounded-none text-[11px] leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                  ? 'bg-[#D4FF00] text-black font-extrabold shadow-sm' 
                                  : 'bg-black/40 text-white/80 border border-white/10'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {refineLoading && (
                          <div className="flex items-center space-x-3 mr-auto bg-[#141414] border border-white/10 py-2.5 px-4 rounded-none max-w-[80%] animate-pulse">
                            <span className="text-[10px] text-[#D4FF00] font-bold uppercase tracking-widest">Merging requested variations...</span>
                          </div>
                        )}
                        <div ref={chatBottomRef} />
                      </div>
                    )}
                  </div>

                  {/* Message input bar */}
                  <form onSubmit={handleRefine} className="p-4 bg-[#0F0F0F] border-t border-white/10 flex items-center space-x-2 font-mono">
                    <input
                      type="text"
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      disabled={refineLoading}
                      placeholder="ENTER OPTIMIZATION QUERY (e.g. 'add neon blue sidebar', 'make header bold')..."
                      className="flex-1 bg-black/40 text-white text-[10px] uppercase placeholder-white/20 px-4 py-3 border border-white/10 focus:outline-none focus:border-[#D4FF00] transition rounded-none"
                    />
                    <button
                      type="submit"
                      disabled={!refineInput.trim() || refineLoading}
                      className={`h-10 w-10 flex items-center justify-center transition-all rounded-none ${
                        !refineInput.trim() || refineLoading
                          ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                          : 'bg-[#D4FF00] hover:bg-[#c4ed00] text-black'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Workspace design-philosophy layout footer */}
      <footer id="app_footer" className="mt-auto py-5 border-t border-white/10 bg-[#0F0F0F] font-mono text-[9px] uppercase tracking-widest text-white/30">
        <div id="footer_frame_limiter" className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-6">
            <span>Global Latency: 42ms</span>
            <span>Success Rate: 99.8%</span>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D4FF00] rounded-full animate-pulse"></div>
              <span className="text-white/60">System Operational</span>
            </div>
            <span>&copy; 2026 VISION CORE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
