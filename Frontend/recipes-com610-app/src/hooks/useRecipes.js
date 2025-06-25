// src/hooks/useRecipes.js
import { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/recipesApi';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipeApi.getAll();
      setRecipes(response.data?.recipes || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipe = async (recipeData) => {
    try {
      setIsCreating(true);
      setError(null);
      const response = await recipeApi.create(recipeData);
      const newRecipe = response.data?.recipe;
      if (newRecipe) {
        setRecipes(prev => [...prev, newRecipe]);
      }
      return { success: true, data: newRecipe };
    } catch (err) {
      setError(err.message);
      console.error('Error creating recipe:', err);
      return { success: false, error: err.message };
    } finally {
      setIsCreating(false);
    }
  };

  const updateRecipe = async (id, recipeData) => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await recipeApi.update(id, recipeData);
      const updatedRecipe = response.data?.recipe;
      if (updatedRecipe) {
        setRecipes(prev => 
          prev.map(recipe => 
            recipe.id_recipe === id ? updatedRecipe : recipe
          )
        );
      }
      return { success: true, data: updatedRecipe };
    } catch (err) {
      setError(err.message);
      console.error('Error updating recipe:', err);
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      setIsDeleting(true);
      setError(null);
      await recipeApi.delete(id);
      setRecipes(prev => prev.filter(recipe => recipe.id_recipe !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting recipe:', err);
      return { success: false, error: err.message };
    } finally {
      setIsDeleting(false);
    }
  };

  const getRecipeById = (id) => {
    return recipes.find(recipe => recipe.id_recipe === id);
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    clearError: () => setError(null),
  };
};