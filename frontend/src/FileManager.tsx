import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2, Upload, LogOut, File } from 'lucide-react';

interface File {
  id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

const FileManager: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fileId: number | null; fileName: string }>({
    isOpen: false,
    fileId: null,
    fileName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.getFiles();
      setFiles(response.data.files);
    } catch (err: any) {
      toast.error('Failed to fetch files', {
        description: err.response?.data?.error || 'Unable to load your files',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      await api.uploadFile(file);
      toast.success('File uploaded successfully!', {
        description: `${file.name} has been uploaded to S3`,
      });
      fetchFiles();
      e.target.value = '';
    } catch (err: any) {
      toast.error('Upload failed', {
        description: err.response?.data?.error || 'Unable to upload file',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (fileId: number, fileName: string) => {
    setDeleteModal({
      isOpen: true,
      fileId,
      fileName,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.fileId) return;

    setIsDeleting(true);
    try {
      await api.deleteFile(deleteModal.fileId);
      toast.success('File deleted', {
        description: `${deleteModal.fileName} has been removed`,
      });
      setDeleteModal({ isOpen: false, fileId: null, fileName: '' });
      fetchFiles();
    } catch (err: any) {
      toast.error('Delete failed', {
        description: 'Unable to delete file',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, fileId: null, fileName: '' });
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const response = await api.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success('Download started', {
        description: `${fileName} is downloading`,
      });
    } catch (err: any) {
      toast.error('Download failed', {
        description: 'Unable to download file',
      });
    }
  };

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setLogoutModalOpen(false);
    onLogout();
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header with Title - Top Left Corner */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-4xl font-bold text-white mb-1">S3 File Manager</h1>
        <p className="text-slate-400">Welcome, <span className="text-purple-400 font-semibold">{user.username}</span></p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Below Title */}
        <div className="w-80 bg-slate-800/50 border-r border-slate-700 flex flex-col p-6 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Your Files</h2>
            <p className="text-slate-400 text-sm">{files.length} file(s) uploaded</p>
          </div>

          {/* Files List */}
          <div className="flex-1 mb-6 space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mb-2"></div>
                <p className="text-slate-400 text-sm">Loading files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8">
                <File className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No files yet</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.file_name}</p>
                        <p className="text-slate-400 text-xs">{(file.file_size / 1024).toFixed(2)} KB</p>
                        <p className="text-slate-500 text-xs">{new Date(file.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file.id, file.file_name)}
                        className="flex-1 text-xs h-7"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(file.id, file.file_name)}
                        className="flex-1 text-xs h-7"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Main Content - Right Side */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-3xl">
            {/* Upload Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upload File</CardTitle>
                <CardDescription>Upload files to your S3 bucket</CardDescription>
              </CardHeader>
              <CardContent>
                <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-purple-500 transition cursor-pointer bg-slate-900/50">
                  <div className="text-center">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                    <p className="text-white font-semibold">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-slate-400 text-sm">Any file type is supported</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-sm mx-4">
            <CardHeader>
              <CardTitle className="text-white text-lg">Delete File?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">{deleteModal.fileName}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-sm mx-4">
            <CardHeader>
              <CardTitle className="text-white text-lg">Logout?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                Are you sure you want to logout from <span className="font-semibold text-white">{user.username}</span>?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={cancelLogout}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmLogout}
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FileManager;
