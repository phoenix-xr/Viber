'use server';
/**
 * @fileOverview A Genkit flow for generating a unique 'Soul Vector' (AI embedding) and a semantic explanation
 * based on a user's interests, personality, and music taste for the Soulmatter matchmaking platform.
 *
 * - generateSoulVector - A function that handles the soul vector generation process.
 * - GenerateSoulVectorInput - The input type for the generateSoulVector function.
 * - GenerateSoulVectorOutput - The return type for the generateSoulVector function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoulVectorInputSchema = z.object({
  name: z.string().describe("The user's name."),
  age: z.number().int().positive().describe("The user's age."),
  city: z.string().describe("The user's city of residence."),
  bio: z.string().describe("A short biography of the user."),
  interests: z.array(z.string()).describe("A list of the user's interests."),
  personalityTraits: z
    .object({
      introvertExtrovert: z
        .number()
        .min(0)
        .max(10)
        .describe('Slider value for Introvert (0) to Extrovert (10).'),
      creativeAnalytical: z
        .number()
        .min(0)
        .max(10)
        .describe('Slider value for Creative (0) to Analytical (10).'),
      plannerSpontaneous: z
        .number()
        .min(0)
        .max(10)
        .describe('Slider value for Planner (0) to Spontaneous (10).'),
      logicalEmotional: z
        .number()
        .min(0)
        .max(10)
        .describe('Slider value for Logical (0) to Emotional (10).'),
      adventurousCareful: z
        .number()
        .min(0)
        .max(10)
        .describe('Slider value for Adventurous (0) to Careful (10).'),
    })
    .describe("The user's personality trait scores."),
  musicProfile: z
    .object({
      genres: z.array(z.string()).describe('A list of the user\u0027s favorite music genres.'),
      favoriteArtists: z.array(z.string()).describe('A list of the user\u0027s favorite music artists.'),
    })
    .describe("The user's music preferences."),
});
export type GenerateSoulVectorInput = z.infer<typeof GenerateSoulVectorInputSchema>;

const GenerateSoulVectorOutputSchema = z.object({
  soulVectorDescription: z
    .string()
    .describe(
      "A high-level textual summary or 'essence' of the user's personality, interests, and music taste, acting as their unique 'Soul Vector'."
    ),
  semanticOverlapExplanation: z
    .string()
    .describe(
      "An explanation of how the AI derived the Soul Vector, detailing how different aspects of the user's profile contribute to it, and suggesting types of compatible individuals with reasoning."
    ),
});
export type GenerateSoulVectorOutput = z.infer<typeof GenerateSoulVectorOutputSchema>;

export async function generateSoulVector(
  input: GenerateSoulVectorInput
): Promise<GenerateSoulVectorOutput> {
  return generateSoulVectorFlow(input);
}

const generateSoulVectorPrompt = ai.definePrompt({
  name: 'generateSoulVectorPrompt',
  input: {schema: GenerateSoulVectorInputSchema},
  output: {schema: GenerateSoulVectorOutputSchema},
  prompt: `You are an advanced AI assistant for the "Soulmatter" matchmaking platform. Your task is to analyze a user's detailed profile and generate a "Soul Vector" description and a semantic explanation of potential compatibility.

The Soul Vector description should capture the essence of the user's personality, interests, and music taste in a concise, high-level summary that could be used for semantic matching. This summary should highlight core characteristics and values that define the user.

The semantic overlap explanation should detail how these different aspects of the user's profile contribute to their unique "Soul Vector" and suggest the types of individuals they might be compatible with, explaining the reasoning based on their profile. This explanation should be insightful and actionable for matchmaking.

User Profile:
Name: {{{name}}}
Age: {{{age}}}
City: {{{city}}}
Bio: {{{bio}}}

Interests:
{{#each interests}}- {{{this}}}
{{/each}}

Personality Traits (0=Left, 10=Right):
Introvert \u2194 Extrovert: {{{personalityTraits.introvertExtrovert}}}
Creative \u2194 Analytical: {{{personalityTraits.creativeAnalytical}}}
Planner \u2194 Spontaneous: {{{personalityTraits.plannerSpontaneous}}}
Logical \u2194 Emotional: {{{personalityTraits.logicalEmotional}}}
Adventurous \u2194 Careful: {{{personalityTraits.adventurousCareful}}}

Music Profile:
Genres:
{{#each musicProfile.genres}}- {{{this}}}
{{/each}}
Favorite Artists:
{{#each musicProfile.favoriteArtists}}- {{{this}}}
{{/each}}`,
});

const generateSoulVectorFlow = ai.defineFlow(
  {
    name: 'generateSoulVectorFlow',
    inputSchema: GenerateSoulVectorInputSchema,
    outputSchema: GenerateSoulVectorOutputSchema,
  },
  async input => {
    const {output} = await generateSoulVectorPrompt(input);
    if (!output) {
      throw new Error('Failed to generate Soul Vector output.');
    }
    return output;
  }
);
