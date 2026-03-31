import { create } from 'zustand';
import { apiClient } from '../api/apiClient';

export const useDietStore = create((set, get) => ({
  diets: [],
  meals: [],
  isLoadingDiets: false,
  isLoadingMeals: false,

  deletedDietIds: [],
  deletedMealIds: [],

  // --- NEW: Added isQuiet flag to prevent UI flashing during background syncs ---
  fetchDiets: async (isQuiet = false) => {
    if (!isQuiet) set({ isLoadingDiets: true });
    try {
      const response = await apiClient.get('/diet');
      const rawDiets = response.data.data || [];
      
      const { deletedDietIds } = get();
      const activeDiets = rawDiets.filter(diet => !deletedDietIds.includes(diet.id));
      
      set({ diets: activeDiets, isLoadingDiets: false });
    } catch (error) {
      console.error("Failed to fetch diets", error);
      if (!isQuiet) set({ isLoadingDiets: false });
    }
  },

  deleteDiet: async (dietId) => {
    set((state) => ({
      diets: state.diets.filter(diet => diet.id !== dietId),
      deletedDietIds: [...state.deletedDietIds, dietId]
    }));

    try {
      await apiClient.delete(`/diet/${dietId}`);
    } catch (error) {
      console.error("Failed to delete diet on server", error);
      set(state => ({
         deletedDietIds: state.deletedDietIds.filter(id => id !== dietId)
      }));
      get().fetchDiets(true);
    }
  },

  fetchMeals: async (dietId) => {
    set({ isLoadingMeals: true });
    try {
      const response = await apiClient.get(`/diet/${dietId}/meal`);
      const rawMeals = response.data.data;
      
      const { deletedMealIds } = get();
      const validMeals = Array.isArray(rawMeals) 
        ? rawMeals.filter(m => m && m.id && !deletedMealIds.includes(m.id)) 
        : [];
        
      set({ meals: validMeals, isLoadingMeals: false });
    } catch (error) {
      console.error("Failed to fetch meals", error);
      set({ isLoadingMeals: false });
    }
  },

  deleteMeal: async (mealId) => {
    set((state) => ({
      meals: state.meals.filter(meal => meal.id !== mealId),
      deletedMealIds: [...state.deletedMealIds, mealId]
    }));

    try {
      await apiClient.delete(`/meal/${mealId}`);
      
      // --- THE FIX: Quietly fetch the newly updated macro totals from the DB ---
      get().fetchDiets(true); 

    } catch (error) {
      console.error("Failed to delete meal on server", error);
      set(state => ({
         deletedMealIds: state.deletedMealIds.filter(id => id !== mealId)
      }));
    }
  }
}));