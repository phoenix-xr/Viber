'use server';
/**
 * @fileOverview A Genkit flow for calculating and displaying compatibility scores between two users.
 *
 * - displayCompatibilityScore - A function that calculates the compatibility score between two user profiles.
 * - DisplayCompatibilityScoreInput - The input type for the displayCompatibilityScore function.
 * - DisplayCompatibilityScoreOutput - The return type for the displayCompatibilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  interests: z.array(z.string()).describe('List of user interests.'),
  personalityTraits: z.object({
    introvertExtrovert: z.number().min(0).max(10).describe('Score from 0 (Introvert) to 10 (Extrovert).'),
    creativeAnalytical: z.number().min(0).max(10).describe('Score from 0 (Creative) to 10 (Analytical).'),
    plannerSpontaneous: z.number().min(0).max(10).describe('Score from 0 (Planner) to 10 (Spontaneous).'),
    logicalEmotional: z.number().min(0).max(10).describe('Score from 0 (Logical) to 10 (Emotional).'),
    adventurousCareful: z.number().min(0).max(10).describe('Score from 0 (Adventurous) to 10 (Careful).'),
  }).describe('User personality traits on various scales (0-10).'),
  musicPreferences: z.object({
    genres: z.array(z.string()).describe('List of preferred music genres.'),
    artists: z.array(z.string()).describe('List of favorite music artists.'),
  }).describe('User music preferences, including genres and artists.'),
});

const DisplayCompatibilityScoreInputSchema = z.object({
  user1: UserProfileSchema.describe('The profile of the first user.'),
  user2: UserProfileSchema.describe('The profile of the second user.'),
});
export type DisplayCompatibilityScoreInput = z.infer<typeof DisplayCompatibilityScoreInputSchema>;

const DisplayCompatibilityScoreOutputSchema = z.object({
  compatibilityScore: z.number().min(0).max(100).describe('Overall compatibility score between 0 and 100.'),
  sharedInterests: z.array(z.string()).describe('List of shared interests between the two users.'),
  personalitySimilarityDescription: z.string().describe('An explanation of personality similarities and differences.'),
  musicOverlapDescription: z.string().describe('An explanation of music taste overlap and differences.'),
  aiMatchExplanation: z.string().describe('A comprehensive explanation of why the users are a good match, covering all aspects.'),
});
export type DisplayCompatibilityScoreOutput = z.infer<typeof DisplayCompatibilityScoreOutputSchema>;

export async function displayCompatibilityScore(input: DisplayCompatibilityScoreInput): Promise<DisplayCompatibilityScoreOutput> {
  return displayCompatibilityScoreFlow(input);
}

const compatibilityScorePrompt = ai.definePrompt({
  name: 'compatibilityScorePrompt',
  input: { schema: DisplayCompatibilityScoreInputSchema },
  output: { schema: DisplayCompatibilityScoreOutputSchema },
  prompt: `You are an expert AI matchmaking assistant. Your task is to analyze two user profiles and determine their compatibility.
Provide an overall compatibility score between 0 and 100, and detailed explanations for shared interests, personality similarity, and music overlap.
Finally, provide a comprehensive AI match explanation.

User 1 Profile:
Interests: {{#each user1.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Personality:
  Introvert (0) - Extrovert (10): {{user1.personalityTraits.introvertExtrovert}}
  Creative (0) - Analytical (10): {{user1.personalityTraits.creativeAnalytical}}
  Planner (0) - Spontaneous (10): {{user1.personalityTraits.plannerSpontaneous}}
  Logical (0) - Emotional (10): {{user1.personalityTraits.logicalEmotional}}
  Adventurous (0) - Careful (10): {{user1.personalityTraits.adventurousCareful}}
Music Preferences:
  Genres: {{#each user1.musicPreferences.genres}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Artists: {{#each user1.musicPreferences.artists}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

User 2 Profile:
Interests: {{#each user2.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Personality:
  Introvert (0) - Extrovert (10): {{user2.personalityTraits.introvertExtrovert}}
  Creative (0) - Analytical (10): {{user2.personalityTraits.creativeAnalytical}}
  Planner (0) - Spontaneous (10): {{user2.personalityTraits.plannerSpontaneous}}
  Logical (0) - Emotional (10): {{user2.personalityTraits.logicalEmotional}}
  Adventurous (0) - Careful (10): {{user2.personalityTraits.adventurousCareful}}
Music Preferences:
  Genres: {{#each user2.musicPreferences.genres}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Artists: {{#each user2.musicPreferences.artists}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Analyze these two profiles and provide the compatibility score and explanations in JSON format according to the output schema.`,
});

const displayCompatibilityScoreFlow = ai.defineFlow(
  {
    name: 'displayCompatibilityScoreFlow',
    inputSchema: DisplayCompatibilityScoreInputSchema,
    outputSchema: DisplayCompatibilityScoreOutputSchema,
  },
  async (input) => {
    const { output } = await compatibilityScorePrompt(input);
    if (!output) {
      throw new Error('Failed to generate compatibility score.');
    }
    return output;
  }
);
