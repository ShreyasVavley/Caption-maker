'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
  onFileSelect: (file: File | null) => void;
}

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit.');
      return;
    }
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Unsupported file type. Please upload an image or video.');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview({ url, type: isImage ? 'image' : 'video' });
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-colors ${
              dragActive ? 'border-accent bg-surface/50' : 'border-border-subtle bg-surface/20 hover:bg-surface/40'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleChange}
            />
            <div className="p-4 rounded-full bg-surface/80 shadow-md mb-4 text-gray-400">
              <Upload size={32} />
            </div>
            <p className="text-gray-300 font-medium">Drag & drop your media here</p>
            <p className="text-gray-500 text-sm mt-2">Images (PNG, JPG, WebP) or Video (MP4, up to 50MB)</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full rounded-2xl overflow-hidden glass-panel group aspect-video flex items-center justify-center bg-black/40"
          >
            {preview.type === 'image' ? (
              <img src={preview.url} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <video src={preview.url} controls className="w-full h-full object-contain" />
            )}
            
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
            >
              <X size={20} />
            </button>
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-2 text-sm">
              {preview.type === 'image' ? <ImageIcon size={16} /> : <Film size={16} />}
              <span className="capitalize">{preview.type} Attached</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
