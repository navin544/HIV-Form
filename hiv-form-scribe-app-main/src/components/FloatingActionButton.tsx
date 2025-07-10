
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.removeItem('editFormId');
    navigate('/');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      title="Create New Form"
    >
      <Plus size={24} />
    </button>
  );
};
