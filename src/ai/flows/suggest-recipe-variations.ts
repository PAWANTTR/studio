// Use server directive is required for Genkit Flows to run in Next.js
'use server';
/**
 * @fileOverview Provides recipe variation suggestions based on an existing recipe.
 *
 * - suggestRecipeVariations -  A function that takes a recipe and suggests variations.
 * - SuggestRecipeVariationsInput - The input type for the suggestRecipeVariations function.
 * - SuggestRecipeVariationsOutput - The return type for the suggestRecipeVariations function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestRecipeVariationsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe to find variations for.'),
  ingredients: z.string().describe('The ingredients of the recipe.'),
  instructions: z.string().describe('The instructions for the recipe.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe(
      'Optional dietary restrictions to consider when suggesting variations (e.g., vegetarian, gluten-free).'
    ),
  availableIngredients:
    z.string().optional().describe('Optional ingredients the user has available.'),
});
export type SuggestRecipeVariationsInput = z.infer<typeof SuggestRecipeVariationsInputSchema>;

const SuggestRecipeVariationsOutputSchema = z.object({
  variations: z
    .array(z.string())
    .describe('An array of suggested recipe variations based on the input recipe.'),
});
export type SuggestRecipeVariationsOutput = z.infer<typeof SuggestRecipeVariationsOutputSchema>;

export async function suggestRecipeVariations(
  input: SuggestRecipeVariationsInput
): Promise<SuggestRecipeVariationsOutput> {
  return suggestRecipeVariationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipeVariationsPrompt',
  input: {
    schema: z.object({
      recipeName: z.string().describe('The name of the recipe to find variations for.'),
      ingredients: z.string().describe('The ingredients of the recipe.'),
      instructions: z.string().describe('The instructions for the recipe.'),
      dietaryRestrictions:
        z.string().optional().describe(
          'Optional dietary restrictions to consider when suggesting variations (e.g., vegetarian, gluten-free).'
        ),
      availableIngredients:
        z.string().optional().describe('Optional ingredients the user has available.'),
    }),
  },
  output: {
    schema: z.object({
      variations:
        z.array(z.string()).describe(
          'An array of suggested recipe variations based on the input recipe.'
        ),
    }),
  },
  prompt: `You are a creative recipe assistant. Given a recipe, suggest some interesting variations.

Recipe Name: {{{recipeName}}}
Ingredients: {{{ingredients}}}
Instructions: {{{instructions}}}

{{#if dietaryRestrictions}}
Dietary Restrictions: {{{dietaryRestrictions}}}
{{/if}}

{{#if availableIngredients}}
Available Ingredients: {{{availableIngredients}}}
Consider these ingredients when creating variations.
{{/if}}

Suggest 3 distinct recipe variations. Each variation should be a short description.
`,
});

const suggestRecipeVariationsFlow = ai.defineFlow<
  typeof SuggestRecipeVariationsInputSchema,
  typeof SuggestRecipeVariationsOutputSchema
>(
  {
    name: 'suggestRecipeVariationsFlow',
    inputSchema: SuggestRecipeVariationsInputSchema,
    outputSchema: SuggestRecipeVariationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
