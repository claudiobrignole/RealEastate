"use client";

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `projects/images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUploadComplete(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block font-body-sm text-on-surface-variant">Carica un&apos;immagine</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange} 
        disabled={isUploading}
        className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/10 file:text-secondary hover:file:bg-secondary/20"
      />
      {isUploading && <p className="text-xs text-secondary mt-1">Caricamento in corso...</p>}
    </div>
  );
}
