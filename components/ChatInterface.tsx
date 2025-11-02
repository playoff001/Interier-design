
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon } from './icons';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, onSendMessage, isDisabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isDisabled) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 min-h-[300px] max-h-[calc(100vh-400px)]">
        {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <p className="font-semibold">Začněte vylepšovat!</p>
                <p className="text-sm mt-1">Zkuste například:</p>
                <ul className="text-xs mt-2 list-disc list-inside">
                    <li>"Přidej retro filtr"</li>
                    <li>"Změň barvu stěn na světle modrou"</li>
                    <li>"Vyměň koberec za dřevěnou podlahu"</li>
                </ul>
            </div>
        )}
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
            {message.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"><BotIcon /></div>}
            <div className={`max-w-xs md:max-w-sm rounded-lg p-3 ${message.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm">{message.text}</p>
            </div>
             {message.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center"><UserIcon /></div>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isDisabled ? "Nejprve vyberte styl" : "Změň pohovku na zelenou..."}
          disabled={isDisabled}
          className="flex-grow p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isDisabled || !inputMessage.trim()}
          className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};
