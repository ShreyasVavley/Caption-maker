'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { UploadCloud, X, FileImage, FileVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropZoneProps {
  onFileSelect: (file: File | null) => void;
}

export default function DropZone({ onFileSelect }: DropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video'; name: string; size: string } | null>(null);
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
    const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    setPreview({ url, type: isImage ? 'image' : 'video', name: file.name, size });
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
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-56 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
              dragActive 
                ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" 
                : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700"
            )}
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
            
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-300 mb-4",
              dragActive ? "bg-indigo-500/20 text-indigo-400" : "bg-zinc-800/50 text-zinc-400"
            )}>
              <UploadCloud size={32} strokeWidth={1.5} />
            </div>
            
            <div className="text-center px-4">
              <p className="text-sm font-medium text-zinc-200 mb-1">
                Drag & drop or <span className="text-indigo-400">browse files</span>
              </p>
              <p className="text-xs text-zinc-500">
                Images (PNG, JPG) or Video (MP4) up to 50MB
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black/40 group aspect-video flex flex-col items-center justify-center"
          >
            {preview.type === 'image' ? (
              <img src={preview.url} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
            ) : (
              <video src={preview.url} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-30" />
            )}
            
            <div className="relative z-10 flex flex-col items-center gap-3 pointer-events-none p-6">
              <div className="p-3 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 shadow-xl">
                {preview.type === 'image' ? <FileImage className="text-indigo-400" size={24} /> : <FileVideo className="text-indigo-400" size={24} />}
              </div>
              <div className="text-center bg-zinc-900/60 backdrop-blur-md py-1.5 px-4 rounded-full border border-zinc-800/50">
                <p className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{preview.name}</p>
                <p className="text-xs text-zinc-500">{preview.size}</p>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-zinc-300 hover:text-white hover:bg-rose-500 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
