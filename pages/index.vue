<template>
  <div class="container mx-auto px-4 justify-center">
    <h1 class="text-2xl font-semibold text-center mt-4 mb-4">Add Ingredients</h1>
    <div class="flex items-center justify-center">
      <div class="space-x-4">
        <input type="text" v-model="newIngredients" placeholder="Ingredients" class="w-72 h-10 px-3 py-2 border border-gray-300 rounded" />
        <button @click="addIngredients" class="py-2 px-4 bg-blue-500 text-white rounded">Add Ingredients</button>
      </div>
    </div>
    <div class="flex justify-center mt-5">
      <ul class="list-disc">
        <li v-for="(Ingredient, index)  in Ingredients" :key=index class="flex space-x-4 items-center py-2">
          <span class="text-2xl">・</span>
          <p class="text-2xl">{{ Ingredient }}</p>
          <button @click="removeIngredients(index)" class="text-1xl py-1 px-2 bg-red-500 text-white rounded">delete</button>
        </li>
      </ul>
    </div>
    <div class="flex justify-center mt-5" v-if="isTasksCount">
      <button @click="getRecipe()" class="py-2 px-4 bg-blue-500 text-white rounded">Find Recipes</button>
    </div>
    <div class="flex justify-center mt-5">
      <div class="flex space-x-4">
        <div v-for="recipe in recipes" :key="recipe.id" class="flex flex-col items-center">
          <img :src="recipe.image" class="w-72 h-72 object-cover" />
          <p class="text-2xl">{{ recipe.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

const Ingredients = ref<string[]>([]);
const recipes = ref<Recipe[]>([]);
const newIngredients = ref('');

const runtimeConfig = useRuntimeConfig();

const addIngredients = (): void => {
  if (newIngredients.value.trim() !== '') {
    const addition = Ingredients.value.length != 0 ? '+' : '';
    Ingredients.value.push(addition + newIngredients.value)
    newIngredients.value = '';
  }
}

const isTasksCount = computed ((): boolean => {
  return Ingredients.value.length > 0;
})

const removeIngredients = (index: number): void => {
  Ingredients.value.splice(index, 1);
}

const getRecipe = async (): Promise<void> => {
if (recipes.value.length !=0 ) recipes.value = [];
let res: any;
try {
  res = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
    params: {
      apiKey: runtimeConfig.public.spoonApiKey,
      ingredients: Ingredients.value.join(','),
      number: 2,
    }
  });
} catch (error) {
  console.error('An error occurred while trying to fetch the data:', error);
}

if (res && res.data && res.data.length === 0) {
  alert('No recipe found.');
  Ingredients.value = [];
} else {
   Ingredients.value = [];
   res.data.forEach((recipe: Recipe) => {
     recipes.value.push({
       id: recipe.id,
       title: recipe.title,
       image: recipe.image,
     });
   });
}
}
</script>

<style scoped></style>

