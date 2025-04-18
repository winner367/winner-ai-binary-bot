
import { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BotUploaderProps {
  onFileUploaded: (file: File) => Promise<boolean>;
}

export default function BotUploader({ onFileUploaded }: BotUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    
    if (file.name.endsWith('.xml')) {
      setFile(file);
    } else {
      setUploadError('Please upload an XML file');
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    // Simulate upload progress
    const updateProgress = () => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    };
    
    const interval = setInterval(updateProgress, 150);
    
    try {
      const result = await onFileUploaded(file);
      
      if (result) {
        setUploadProgress(100);
        setUploadSuccess(true);
      } else {
        setUploadError('Failed to process bot file');
      }
    } catch (error) {
      setUploadError('Error uploading file');
      console.error(error);
    } finally {
      clearInterval(interval);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors text-center 
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} 
          ${file ? 'bg-muted/50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="mx-auto flex flex-col items-center justify-center gap-1">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-base font-medium">Drag and drop your bot XML file</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xml"
              onChange={handleFileInputChange}
            />
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse Files
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {uploadSuccess && (
        <Alert variant="default" className="bg-success-50 text-success-700 border-success-200">
          <AlertDescription>
            Bot file uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Upload button */}
      {file && !uploadSuccess && (
        <Button 
          className="w-full"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Bot File'}
        </Button>
      )}
    </div>
  );
}
