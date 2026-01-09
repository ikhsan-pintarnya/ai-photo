import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadStep } from './components/UploadStep';
import { StepWizard } from './components/StepWizard';
import { Gallery } from './components/Gallery';
import { Editor } from './components/Editor';
import { ProjectsList } from './components/ProjectsList';
import { AppStep, HeadshotFeatures, GeneratedImage, SavedProject } from './types';
import { generateHeadshot } from './services/geminiService';
import { Key, Lock, Sparkles, ArrowRight } from 'lucide-react';

const INITIAL_FEATURES: HeadshotFeatures = {
  vibe: 'Corporate',
  pose: '3/4 Profile',
  attire: 'Navy Blue Executive Suit, white shirt, silk tie',
  background: 'Modern tech office with soft daylight bokeh',
  grooming: 'Well-Groomed',
  expression: 'Slight Smile',
  cameraAngle: 'Eye-level',
  lensDepth: 'F1.8 Cinematic Bokeh',
  colorGrade: 'Clean & Modern'
};

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [tempKey, setTempKey] = useState('');
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [uploadedImage, setUploadedImage] = useState<{ base64: string, mimeType: string } | null>(null);
  const [features, setFeatures] = useState<HeadshotFeatures>(INITIAL_FEATURES);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load API Key and projects from localStorage on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem('pintarnya_projects');
    const storedKey = localStorage.getItem('gemini_api_key');

    if (storedKey) {
      setApiKey(storedKey);
    }

    if (storedProjects) {
      try {
        setSavedProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (!tempKey.trim()) return;
    localStorage.setItem('gemini_api_key', tempKey.trim());
    setApiKey(tempKey.trim());
  };

  const handleImageUpload = (base64: string, mimeType: string) => {
    setUploadedImage({ base64, mimeType });
    setError(null);
    setStep(AppStep.FEATURES);
  };

  const updateFeatures = (key: keyof HeadshotFeatures, value: string) => {
    setFeatures(prev => ({ ...prev, [key]: value }));
  };

  const handleGeneration = async () => {
    if (!uploadedImage) return;
    setStep(AppStep.GENERATION);
    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const seed = Math.floor(Math.random() * 10000);
      const img = await generateHeadshot(apiKey, uploadedImage.base64, uploadedImage.mimeType, features, seed);
      setGeneratedImages([img]);

      // Auto-save logic
      const newProject: SavedProject = {
        id: Date.now().toString(),
        name: `Project ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        timestamp: Date.now(),
        sourceImage: uploadedImage,
        features: features,
        generatedImages: [img] // Start with the first generated image
      };

      setSavedProjects(prev => {
        const updated = [newProject, ...prev];
        localStorage.setItem('pintarnya_projects', JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      console.error("Critical error in generation:", err);
      setError(err?.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProject = () => {
    if (!uploadedImage || generatedImages.length === 0) return;
    const newProject: SavedProject = {
      id: Date.now().toString(),
      name: `Project ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: Date.now(),
      sourceImage: uploadedImage,
      features: features,
      generatedImages: generatedImages
    };
    const updated = [newProject, ...savedProjects];
    setSavedProjects(updated);
    localStorage.setItem('pintarnya_projects', JSON.stringify(updated));
    alert("Project saved to your local library!");
  };

  const handleLoadProject = (project: SavedProject) => {
    setUploadedImage(project.sourceImage);
    setFeatures(project.features);
    setGeneratedImages(project.generatedImages);
    setError(null);
    setStep(AppStep.GENERATION);
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('pintarnya_projects', JSON.stringify(updated));
  };

  const handleNewProject = () => {
    setUploadedImage(null);
    setFeatures(INITIAL_FEATURES);
    setGeneratedImages([]);
    setSelectedImage(null);
    setError(null);
    setStep(AppStep.UPLOAD);
  };

  // Render API Key Input Screen if no key is found
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <img src="./assets/pintarnya-logo.png" alt="Pintarnya" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-bold text-slate-900">AI Photo Studio</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Enter Gemini API Key</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              To generate professional headshots, you need a Google Gemini API key. This key is stored locally in your browser.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste your API key here..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
              />
            </div>

            <button
              onClick={handleSaveKey}
              disabled={!tempKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              Securely Save & Continue
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Get one from Google AI Studio</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout
      step={step}
      onNavigate={setStep}
      hasProjects={savedProjects.length > 0}
      apiKey={apiKey}
      onSetApiKey={(key) => {
        if (key) {
          setApiKey(key);
          localStorage.setItem('gemini_api_key', key);
        }
      }}
    >
      {step === AppStep.UPLOAD && <UploadStep onImageUpload={handleImageUpload} onShowLibrary={() => setStep(AppStep.LIBRARY)} hasProjects={savedProjects.length > 0} />}
      {step === AppStep.FEATURES && <StepWizard features={features} updateFeatures={updateFeatures} onNext={handleGeneration} uploadedImagePreview={uploadedImage} />}
      {step === AppStep.GENERATION && (
        <div className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl animate-fade-in mb-4">
              <h4 className="font-bold text-lg mb-1">Generation Failed</h4>
              <p className="text-sm opacity-90">{error}</p>
              <button
                onClick={handleGeneration}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          <Gallery
            images={generatedImages}
            isGenerating={isGenerating}
            onSelect={(img) => { setSelectedImage(img); setStep(AppStep.EDITOR); }}
            onRegenerate={handleGeneration}
            onSave={handleSaveProject}
          />
        </div>
      )}
      {step === AppStep.EDITOR && selectedImage && <Editor apiKey={apiKey} initialImage={selectedImage} onBack={() => setStep(AppStep.GENERATION)} />}
      {step === AppStep.LIBRARY && <ProjectsList projects={savedProjects} onLoad={handleLoadProject} onDelete={handleDeleteProject} onNew={handleNewProject} />}
    </Layout>
  );
};

export default App;