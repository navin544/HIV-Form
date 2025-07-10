
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, FolderOpen } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-slate-700 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">HIV Form Manager</h1>
          </div>
          
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              New Form
            </Link>
            
            <Link
              to="/files"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/files') 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-600'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              All Forms
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
