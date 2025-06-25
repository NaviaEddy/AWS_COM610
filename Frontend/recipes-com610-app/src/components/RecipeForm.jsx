import { useState, useEffect } from 'react';
import Button from './ui/Button';

const RecipeForm = ({ recipe, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    ingredients: ['']
  });

  const [errors, setErrors] = useState({});

  // Cargar datos del recipe si estamos editando
  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        ingredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : ['']
      });
    } else {
      setFormData({
        title: '',
        ingredients: ['']
      });
    }
  }, [recipe]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    const validIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Debe agregar al menos un ingrediente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en el título
  const handleTitleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      title: e.target.value
    }));
    // Limpiar error del título si existe
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // Manejar cambio en ingrediente
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
    // Limpiar error de ingredientes si existe
    if (errors.ingredients) {
      setErrors(prev => ({ ...prev, ingredients: '' }));
    }
  };

  // Agregar nuevo ingrediente
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  // Eliminar ingrediente
  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Filtrar ingredientes vacíos
    const validIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
    
    const recipeData = {
      title: formData.title.trim(),
      ingredients: validIngredients
    };

    onSubmit(recipeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título de la receta
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Pasta con tomate"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Ingredientes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredientes
        </label>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Ingrediente ${index + 1}`}
                disabled={isLoading}
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
          disabled={isLoading}
        >
          + Agregar ingrediente
        </button>
        
        {errors.ingredients && (
          <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? 'Guardando...' : (recipe ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;