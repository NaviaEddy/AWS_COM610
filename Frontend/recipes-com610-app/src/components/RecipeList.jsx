import Loading from './ui/Loading';
import Button from './ui/Button';

const RecipeList = ({ recipes, onEdit, onDelete, loading }) => {
  if (loading) {
    return <Loading size="large" />;
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👨‍🍳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recetas aún</h3>
        <p className="text-gray-500">¡Crea tu primera receta para comenzar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id_recipe}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{recipe.title}</h3>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                {/* CORREGIDO: cambiado de ingredents a ingredients */}
                {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onEdit(recipe)}
              className="text-sm px-4 py-1.5"
            >
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete(recipe)}
              className="text-sm px-4 py-1.5"
            >
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;