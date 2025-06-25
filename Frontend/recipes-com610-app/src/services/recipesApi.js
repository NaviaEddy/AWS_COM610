// src/services/recipeApi.js
const URL = import.meta.env.VITE_API_BASE_URL;

class RecipeApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'RecipeApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new RecipeApiError(
      errorData.message || `HTTP Error: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

export const recipeApi = {
  // Obtener todas las recetas
  async getAll() {
    try {
      const response = await fetch(`${URL}/recipe`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Obtener una receta por ID
  async getById(id) {
    try {
      const response = await fetch(`${URL}/recipe/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw error;
    }
  },

  // Crear nueva receta
  async create(recipeData) {
    try {
      const response = await fetch(`${URL}/recipe`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  // Actualizar receta
  async update(id, recipeData) {
    try {
      const response = await fetch(`${URL}/recipe/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error);
      throw error;
    }
  },

  // Eliminar receta
  async delete(id) {
    try {
      const response = await fetch(`${URL}/recipe/${id}`, {
        mode: 'cors',
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error);
      throw error;
    }
  },
};