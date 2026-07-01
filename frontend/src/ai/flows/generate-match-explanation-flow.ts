'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalityTraitSchema = z.object({
  introvertExtrovert: z
    .number()
    .min(0)
    .max(100)
    .describe('Scale from 0 (Introvert) to 100 (Extrovert)'),
  creativeAnalytical: z
    .number()
    .min(0)
    .max(100)
    .describe('Scale from 0 (Creative) to 100 (Analytical)'),
  plannerSpontaneous: z
    .number()
    .min(0)
    .max(100)
    .describe('Scale from 0 (Planner) to 100 (Spontaneous)'),
  logicalEmotional: z
    .number()
    .min(0)
    .max(100)
    .describe('Scale from 0 (Logical) to 100 (Emotional)'),
  adventurousCareful: z
    .number()
    .min(0)
    .max(100)
    .describe('Scale from 0 (Adventurous) to 100 (Careful)'),
});

const GenerateMatchExplanationInputSchema = z.object({
  user1Name: z.string().describe("The name of the first user."),
  user2Name: z.string().describe("The name of the second user."),
  user1Interests: z.array(z.string()).describe("A list of interests for the first user."),
  user2Interests: z.array(z.string()).describe("A list of interests for the second user."),
  user1Personality: PersonalityTraitSchema.describe("Personality traits for the first user."),
  user2Personality: PersonalityTraitSchema.describe("Personality traits for the second user."),
  user1MusicGenres: z.array(z.string()).describe("A list of music genres liked by the first user."),
  user2MusicGenres: z.array(z.string()).describe("A list of music genres liked by the second user."),
  user1FavoriteArtists: z.array(z.string()).describe("A list of favorite artists for the first user."),
  user2FavoriteArtists: z.array(z.string()).describe("A list of favorite artists for the second user."),
});
export type GenerateMatchExplanationInput = z.infer<typeof GenerateMatchExplanationInputSchema>;

const GenerateMatchExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe("A comprehensive generated explanation of why the two users matched."),
  sharedInterestsSummary: z
    .string()
    .describe("A summary specifically detailing shared interests between the two users."),
  personalitySimilaritySummary: z
    .string()
    .describe("A summary specifically detailing personality similarities between the two users."),
  musicOverlapSummary: z
    .string()
    .describe("A summary specifically detailing music taste overlaps between the two users."),
});
export type GenerateMatchExplanationOutput = z.infer<typeof GenerateMatchExplanationOutputSchema>;

export async function generateMatchExplanation(
  input: GenerateMatchExplanationInput
): Promise<GenerateMatchExplanationOutput> {
  return generateMatchExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMatchExplanationPrompt',
  input: {schema: GenerateMatchExplanationInputSchema},
  output: {schema: GenerateMatchExplanationOutputSchema},
  prompt: `You are an expert matchmaking system for a platform called Soulmatter. Your task is to analyze two user profiles and generate a detailed, insightful, and positive explanation of 'Why You Matched'. Focus on the semantic connections based on their shared interests, personality traits, and music tastes.

Use a warm, engaging, and slightly poetic tone, fitting for a platform that helps people find deep connections. Make sure to clearly explain the connections in each category.

Here is the data for the two users:

User 1: {{{user1Name}}}
Interests: {{{user1Interests}}}
Personality:
  - Introvert/Extrovert: {{{user1Personality.introvertExtrovert}}} (0=Introvert, 100=Extrovert)
  - Creative/Analytical: {{{user1Personality.creativeAnalytical}}} (0=Creative, 100=Analytical)
  - Planner/Spontaneous: {{{user1Personality.plannerSpontaneous}}} (0=Planner, 100=Spontaneous)
  - Logical/Emotional: {{{user1Personality.logicalEmotional}}} (0=Logical, 100=Emotional)
  - Adventurous/Careful: {{{user1Personality.adventurousCareful}}} (0=Adventurous, 100=Careful)
Music Genres: {{{user1MusicGenres}}}
Favorite Artists: {{{user1FavoriteArtists}}}

User 2: {{{user2Name}}}
Interests: {{{user2Interests}}}
Personality:
  - Introvert/Extrovert: {{{user2Personality.introvertExtrovert}}} (0=Introvert, 100=Extrovert)
  - Creative/Analytical: {{{user2Personality.creativeAnalytical}}} (0=Creative, 100=Analytical)
  - Planner/Spontaneous: {{{user2Personality.plannerSpontaneous}}} (0=Planner, 100=Spontaneous)
  - Logical/Emotional: {{{user2Personality.logicalEmotional}}} (0=Logical, 100=Emotional)
  - Adventurous/Careful: {{{user2Personality.adventurousCareful}}} (0=Adventurous, 100=Careful)
Music Genres: {{{user2MusicGenres}}}
Favorite Artists: {{{user2FavoriteArtists}}}

Generate the explanation in JSON format, adhering to the output schema. Ensure each field is populated with a thoughtful and detailed analysis.
`,
});

const generateMatchExplanationFlow = ai.defineFlow(
  {
    name: 'generateMatchExplanationFlow',
    inputSchema: GenerateMatchExplanationInputSchema,
    outputSchema: GenerateMatchExplanationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate match explanation.');
    }
    return output;
  }
);