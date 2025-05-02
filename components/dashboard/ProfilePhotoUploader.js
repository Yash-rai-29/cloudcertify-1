import { useRef, useState } from 'react';
import { IconUpload, IconTrash, IconEdit } from '@tabler/icons-react';
import { motion } from 'framer-motion';

/**
 * Component for uploading and previewing profile photos
 * 
 * @param {Object} props - Component props
 * @param {string} props.currentPhotoUrl - URL of the current profile photo
 * @param {Function} props.onPhotoChange - Function to call when photo is changed
 */
export default function ProfilePhotoUploader({ currentPhotoUrl, onPhotoChange }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Handle click on the upload button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onPhotoChange(file);
    }
  };
  
  // Handle remove photo
  const handleRemovePhoto = () => {
    onPhotoChange(null);
    
    // Also clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
      {/* Photo preview */}
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          {currentPhotoUrl ? (
            <img 
              src={currentPhotoUrl} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 uppercase font-medium text-xl">
              {/* Placeholder - could use user's initials here */}
              <IconUpload size={32} />
            </div>
          )}
        </div>
        
        {/* Edit overlay */}
        {currentPhotoUrl && (
          <button
            type="button"
            onClick={handleUploadClick}
            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <IconEdit size={16} />
            <span className="sr-only">Change photo</span>
          </button>
        )}
      </div>

      {/* Uploader */}
      <div className="flex flex-col gap-3 flex-1">
        <motion.div 
          className={`border-2 border-dashed rounded-lg p-4 text-center ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center space-y-2 py-3">
            <IconUpload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <button 
                type="button" 
                className="text-blue-600 font-medium hover:text-blue-500 focus:outline-none"
                onClick={handleUploadClick}
              >
                Upload a file
              </button>{' '}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
          </div>
        </motion.div>

        {/* Actions */}
        {currentPhotoUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <IconTrash size={16} className="mr-1" />
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}
