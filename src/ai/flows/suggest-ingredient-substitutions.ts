'use server';
/**
 * @fileOverview Ingredient substitution suggestion flow.
 *
 * This file defines a Genkit flow that suggests ingredient substitutions
 * based on user dietary restrictions or preferences.
 *
 * @remarks
 * - `suggestIngredientSubstitutions` - The main function that triggers the flow.
 * - `SuggestIngredientSubstitutionsInput` - The input type for the function.
 * - `SuggestIngredientSubstitutionsOutput` - The output type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestIngredientSubstitutionsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z.string().describe('A list of ingredients in the recipe.'),
  dietaryRestrictions: z
    .string()
    .describe(
      'Dietary restrictions or preferences (e.g., vegetarian, gluten-free, low-sugar).'
    ),
});
export type SuggestIngredientSubstitutionsInput =
  z.infer<typeof SuggestIngredientSubstitutionsInputSchema>;

const SuggestIngredientSubstitutionsOutputSchema = z.object({
  originalIngredients: z.string().describe('The original ingredients.'),
  suggestedSubstitutions: z
    .string()
    .describe('Suggested ingredient substitutions based on dietary needs.'),
  reasoning: z
    .string()
    .describe('Explanation for the suggested substitutions.'),
});
export type SuggestIngredientSubstitutionsOutput =
  z.infer<typeof SuggestIngredientSubstitutionsOutputSchema>;

export async function suggestIngredientSubstitutions(
  input: SuggestIngredientSubstitutionsInput
): Promise<SuggestIngredientSubstitutionsOutput> {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {
    schema: z.object({
      recipeName: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A list of ingredients in the recipe.'),
      dietaryRestrictions: z
        .string()
        .describe(
          'Dietary restrictions or preferences (e.g., vegetarian, gluten-free, low-sugar).'
        ),
    }),
  },
  output: {
    schema: z.object({
      originalIngredients: z.string().describe('The original ingredients.'),
      suggestedSubstitutions: z
        .string()
        .describe('Suggested ingredient substitutions based on dietary needs.'),
      reasoning: z
        .string()
        .describe('Explanation for the suggested substitutions.'),
    }),
  },
  prompt: `You are a recipe assistant that suggests ingredient substitutions
  for recipes based on dietary restrictions or personal preferences.

  Recipe Name: {{{recipeName}}}
  Original Ingredients: {{{ingredients}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}

  Please provide a list of suggested ingredient substitutions that adhere to the specified dietary restrictions.
  Explain the reason for each substitution.
  Original Ingredients: {{{ingredients}}}
  Substitutions:
  `,
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow<
  typeof SuggestIngredientSubstitutionsInputSchema,
  typeof SuggestIngredientSubstitutionsOutputSchema
>(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
