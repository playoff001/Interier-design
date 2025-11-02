
export interface DesignStyle {
  id: string;
  name: string;
  prompt: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface ImageFile {
  dataUrl: string;
  base64: string;
  mimeType: string;
}
