import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRecipes } from './hooks/useRecipes';
import Layout from './components/Layout';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Loading from './components/ui/Loading';

function App() {
  const {
    recipes,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    clearError
  } = useRecipes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [notification, setNotification] = useState(null);

  // Mostrar notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Manejar creación de receta
  const handleCreateRecipe = async (recipeData) => {
    const result = await createRecipe(recipeData);
    if (result.success) {
      setIsFormOpen(false);
      showNotification('Receta creada exitosamente');
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Manejar actualización de receta
  const handleUpdateRecipe = async (recipeData) => {
    const result = await updateRecipe(editingRecipe.id_recipe, recipeData);
    if (result.success) {
      setIsFormOpen(false);
      setEditingRecipe(null);
      showNotification('Receta actualizada exitosamente');
    } else {
      showNotification(result.error, 'error');
    }
  };

  // Manejar eliminación de receta
  const handleDeleteRecipe = async (recipe) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${recipe.title}"?`)) {
      const result = await deleteRecipe(recipe.id_recipe);
      if (result.success) {
        showNotification('Receta eliminada exitosamente');
      } else {
        showNotification(result.error, 'error');
      }
    }
  };

  // Abrir formulario para editar
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header de la página principal - removido porque Layout ya tiene header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Colección</h2>
          <p className="text-gray-600 mt-1">
            {recipes.length === 0 
              ? 'Aún no tienes recetas guardadas' 
              : `${recipes.length} receta${recipes.length > 1 ? 's' : ''} guardada${recipes.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Nueva Receta
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={clearError} 
              className="text-red-500 hover:text-red-700 font-bold text-lg ml-4"
              aria-label="Cerrar mensaje de error"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Lista de Recetas */}
      <RecipeList
        recipes={recipes}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        loading={isDeleting}
      />

      {/* Formulario en Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingRecipe ? 'Editar Receta' : 'Nueva Receta'}
      >
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
          onCancel={handleCloseForm}
          isLoading={isCreating || isUpdating}
        />
      </Modal>
    </Layout>
  );
}

export default App;