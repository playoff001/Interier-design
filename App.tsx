
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { ChatInterface } from './components/ChatInterface';
import { LoadingOverlay } from './components/LoadingOverlay';
import { redesignImage, refineImageWithChat } from './services/geminiService';
import { DESIGN_STYLES } from './constants';
import type { ChatMessage, DesignStyle, ImageFile } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [activeStyle, setActiveStyle] = useState<DesignStyle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (imageFile: ImageFile) => {
    setOriginalImage(imageFile);
    setGeneratedImages({});
    setActiveStyle(null);
    setChatHistory([]);
    setError(null);
  };

  const handleStyleSelect = useCallback(async (style: DesignStyle) => {
    if (!originalImage) return;

    setActiveStyle(style);
    if (generatedImages[style.id]) {
      return; // Already generated
    }

    setLoadingMessage(`Generuji design ve stylu ${style.name}...`);
    setIsLoading(true);
    setError(null);

    try {
      const resultDataUrl = await redesignImage(originalImage.base64, originalImage.mimeType, style.prompt);
      setGeneratedImages(prev => ({ ...prev, [style.id]: resultDataUrl }));
    } catch (e) {
      console.error(e);
      setError('Nepodařilo se vygenerovat obrázek. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, generatedImages]);

  const handleChatSubmit = async (prompt: string) => {
    if (!originalImage || !activeStyle) return;

    const currentImage = generatedImages[activeStyle.id];
    if (!currentImage) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: prompt };
    setChatHistory(prev => [...prev, newUserMessage]);
    setLoadingMessage('Vylepšuji váš design...');
    setIsLoading(true);
    setError(null);

    try {
      const currentImageBase64 = currentImage.split(',')[1];
      const resultDataUrl = await refineImageWithChat(currentImageBase64, originalImage.mimeType, prompt);
      
      setGeneratedImages(prev => ({ ...prev, [activeStyle.id]: resultDataUrl }));
      const newAiMessage: ChatMessage = { sender: 'ai', text: "Zde je aktualizovaný design podle vašeho požadavku." };
      setChatHistory(prev => [...prev, newAiMessage]);

    } catch (e) {
      console.error(e);
      const errorMessage = 'Omlouvám se, nepodařilo se mi obrázek vylepšit. Zkuste prosím jiný pokyn.';
      setError(errorMessage);
       const newAiMessage: ChatMessage = { sender: 'ai', text: errorMessage };
      setChatHistory(prev => [...prev, newAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const currentGeneratedImage = activeStyle ? generatedImages[activeStyle.id] : null;

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200">
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto flex items-center gap-3">
          <LogoIcon />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Interiérový Designér</h1>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-3 text-center">1. Zvolte styl úpravy</h2>
                  <StyleCarousel styles={DESIGN_STYLES} onStyleSelect={handleStyleSelect} activeStyleId={activeStyle?.id} />
              </div>

              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg min-h-[300px] md:min-h-[500px] flex items-center justify-center">
                {originalImage && currentGeneratedImage ? (
                  <ImageComparator 
                    originalImage={originalImage.dataUrl} 
                    generatedImage={currentGeneratedImage}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>{activeStyle ? `Generuje se ${activeStyle.name}...` : "Pro začátek prosím vyberte styl."}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/3 flex flex-col">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex-grow">
                 <h2 className="text-xl font-semibold mb-3 text-center">2. Dolaďte pomocí chatu</h2>
                 <ChatInterface 
                    chatHistory={chatHistory} 
                    onSendMessage={handleChatSubmit}
                    isDisabled={!currentGeneratedImage || isLoading}
                  />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
