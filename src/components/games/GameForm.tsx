import React, { useState, useEffect } from 'react';
import { Edit, Upload, Plus, X, Save } from 'lucide-react';
import { GameFormData, Game } from '../../types';
import { fileToBase64 } from '../../services/gameService';
import ErrorMessage from '../common/ErrorMessage';

interface GameFormProps {
  initialData?: Game;
  onSubmit: (formData: GameFormData) => Promise<void>;
  onCancel: () => void;
}

const GameForm: React.FC<GameFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<GameFormData>({
    name: '',
    image: '',
    brand: '',
    category: [''],
    description: '',
    disableRating: false,
    disableCommenting: false,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        image: initialData.image,
        brand: initialData.brand,
        category: initialData.category,
        description: initialData.description,
        disableRating: initialData.disableRating,
        disableCommenting: initialData.disableCommenting,
        optionalField1: initialData.optionalField1,
        optionalField2: initialData.optionalField2,
      });
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...formData.category];
    updatedCategories[index] = value;
    setFormData(prev => ({ ...prev, category: updatedCategories }));
  };

  const addCategory = () => {
    if (formData.category.length < 5) {
      setFormData(prev => ({ ...prev, category: [...prev.category, ''] }));
    }
  };

  const removeCategory = (index: number) => {
    if (formData.category.length > 1) {
      const updatedCategories = formData.category.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, category: updatedCategories }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      setError('Please upload a JPG or PNG image only');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      const base64Image = await fileToBase64(file);
      setFormData(prev => ({ ...prev, image: base64Image }));
      setImagePreview(base64Image);
      setError(null);
    } catch (err) {
      setError('Failed to process the image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Game name is required');
      return;
    }
    
    if (!formData.image) {
      setError('Game image is required');
      return;
    }
    
    if (!formData.brand.trim()) {
      setError('Developer name is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Game description is required');
      return;
    }
    
    // Filter out empty categories
    const filteredCategories = formData.category.filter(cat => cat.trim() !== '');
    if (filteredCategories.length === 0) {
      setError('At least one category is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        category: filteredCategories,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the game');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {initialData ? 'Edit Game' : 'Add New Game'}
      </h2>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Game Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="brand" className="block text-gray-300 mb-2">
            Developer *
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Categories * (1-5)
        </label>
        <div className="space-y-3">
          {formData.category.map((category, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={category}
                onChange={e => handleCategoryChange(index, e.target.value)}
                placeholder={`Category ${index + 1}`}
                className="flex-grow px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {formData.category.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
          
          {formData.category.length < 5 && (
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        ></textarea>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Game Image * (PNG or JPG)
        </label>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-32 h-32 bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Game preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload size={32} className="text-gray-500" />
            )}
          </div>
          
          <div className="flex-grow">
            <div className="relative">
              <input
                type="file"
                id="image"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="sr-only"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md cursor-pointer transition-colors"
              >
                <Upload size={18} className="mr-2" />
                <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Accepted formats: JPEG, PNG. Max size: 5MB.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="disableRating"
              name="disableRating"
              checked={formData.disableRating}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-600 focus:ring-offset-gray-800"
            />
            <label htmlFor="disableRating" className="ml-2 text-gray-300">
              Disable Rating
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="disableCommenting"
              name="disableCommenting"
              checked={formData.disableCommenting}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-600 focus:ring-offset-gray-800"
            />
            <label htmlFor="disableCommenting" className="ml-2 text-gray-300">
              Disable Commenting
            </label>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="optionalField1" className="block text-gray-300 mb-2">
            Optional Field 1
          </label>
          <input
            type="text"
            id="optionalField1"
            name="optionalField1"
            value={formData.optionalField1 || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        
        <div>
          <label htmlFor="optionalField2" className="block text-gray-300 mb-2">
            Optional Field 2
          </label>
          <input
            type="text"
            id="optionalField2"
            name="optionalField2"
            value={formData.optionalField2 || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center space-x-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <Save size={18} />
          <span>{isSubmitting ? 'Saving...' : 'Save Game'}</span>
        </button>
      </div>
    </form>
  );
};

export default GameForm;