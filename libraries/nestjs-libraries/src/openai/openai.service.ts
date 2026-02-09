import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { shuffle } from 'lodash';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-proj-',
});

// Initialize Gemini API
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PicturePrompt = z.object({
  prompt: z.string(),
});

const VoicePrompt = z.object({
  voice: z.string(),
});

@Injectable()
export class OpenaiService {
  async generateImage(prompt: string, isUrl: boolean, isVertical = false) {
    // NOTE: Image generation still uses OpenAI/DALL-E as Gemini doesn't support image generation
    // If OPENAI_API_KEY is not set, this will fail
    // Alternative: Use Stability AI, Midjourney API, or disable image generation
    const generate = (
      await openai.images.generate({
        prompt,
        response_format: isUrl ? 'url' : 'b64_json',
        model: 'dall-e-3',
        ...(isVertical ? { size: '1024x1792' } : {}),
      })
    ).data[0];

    return isUrl ? generate.url : generate.b64_json;
  }

  async generatePromptForPicture(prompt: string) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(
      `You are an assistant that take a description and style and generate a prompt that will be used later to generate images, make it a very long and descriptive explanation, and write a lot of things for the renderer like, if it's realistic describe the camera. Respond with JSON in this format: {"prompt": "your detailed prompt here"}\n\nUser prompt: ${prompt}`
    );

    try {
      const parsed = JSON.parse(result.response.text());
      return parsed.prompt || '';
    } catch {
      return result.response.text() || '';
    }
  }

  async generateVoiceFromText(prompt: string) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(
      `You are an assistant that takes a social media post and convert it to a normal human voice, to be later added to a character, when a person talk they don't use "-", and sometimes they add pause with "..." to make it sounds more natural, make sure you use a lot of pauses and make it sound like a real person. Respond with JSON in this format: {"voice": "your voice text here"}\n\nUser prompt: ${prompt}`
    );

    try {
      const parsed = JSON.parse(result.response.text());
      return parsed.voice || '';
    } catch {
      return result.response.text() || '';
    }
  }

  async generatePosts(content: string) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 1,
        responseMimeType: 'application/json',
      },
    });

    const singlePostPrompt = `Generate 5 Twitter posts from the following content without emojis. Respond with JSON format: [{"post": "text here"}]\n\nContent: ${content}`;
    const threadPrompt = `Generate 5 social media threads from the following content without emojis. Each thread should have multiple posts. Respond with JSON format: [[{"post": "text 1"}, {"post": "text 2"}], ...]\n\nContent: ${content}`;

    const [singlePostsResult, threadsResult] = await Promise.all([
      model.generateContent(singlePostPrompt),
      model.generateContent(threadPrompt),
    ]);

    const posts = [];
    try {
      const singlePosts = JSON.parse(singlePostsResult.response.text());
      if (Array.isArray(singlePosts)) {
        posts.push(...singlePosts.map(p => Array.isArray(p) ? p : [p]));
      }
    } catch (e) {
      console.log('Error parsing single posts:', e);
    }

    try {
      const threads = JSON.parse(threadsResult.response.text());
      if (Array.isArray(threads)) {
        posts.push(...threads);
      }
    } catch (e) {
      console.log('Error parsing threads:', e);
    }

    return shuffle(posts);
  }
  async extractWebsiteText(content: string) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(
      `You take a full website text, and extract only the article content.\n\nWebsite text:\n${content}`
    );

    const articleContent = result.response.text();
    return this.generatePosts(articleContent);
  }

  async separatePosts(content: string, len: number) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `You are an assistant that take a social media post and break it to a thread, each post must be minimum ${len - 10} and maximum ${len} characters, keeping the exact wording and break lines, however make sure you split posts based on context. Respond with JSON: {"posts": ["post 1", "post 2", ...]}\n\nContent: ${content}`;

    const result = await model.generateContent(prompt);
    let posts: string[] = [];

    try {
      const parsed = JSON.parse(result.response.text());
      posts = parsed.posts || [];
    } catch (e) {
      console.log('Error parsing posts:', e);
      return { posts: [content] };
    }

    return {
      posts: await Promise.all(
        posts.map(async (post: string) => {
          if (post.length <= len) {
            return post;
          }

          let retries = 4;
          while (retries) {
            try {
              const shrinkModel = gemini.getGenerativeModel({
                model: 'gemini-2.5-flash',
                generationConfig: {
                  temperature: 0.7,
                  responseMimeType: 'application/json',
                },
              });

              const shrinkResult = await shrinkModel.generateContent(
                `You are an assistant that take a social media post and shrink it to be maximum ${len} characters, keeping the exact wording and break lines. Respond with JSON: {"post": "shrunk text"}\n\nContent: ${post}`
              );

              const parsed = JSON.parse(shrinkResult.response.text());
              return parsed.post || post;
            } catch (e) {
              retries--;
            }
          }

          return post;
        })
      ),
    };
  }

  async generateSlidesFromText(text: string) {
    const model = gemini.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    for (let i = 0; i < 3; i++) {
      try {
        const message = `You are an assistant that takes a text and break it into slides, each slide should have an image prompt and voice text to be later used to generate a video and voice, image prompt should capture the essence of the slide and also have a back dark gradient on top, image prompt should not contain text in the picture, generate between 3-5 slides maximum. Respond with JSON: {"slides": [{"imagePrompt": "...", "voiceText": "..."}, ...]}`;

        const result = await model.generateContent(`${message}\n\nText: ${text}`);
        const parsed = JSON.parse(result.response.text());
        return parsed.slides || [];
      } catch (err) {
        console.log(err);
      }
    }

    return [];
  }

  async refineContent(content: string, prompt: string): Promise<string> {
    const prompts: Record<string, string> = {
      improve: 'Make this social media post more engaging and professional while maintaining its core message. Enhance clarity and impact. IMPORTANT: Return ONLY the refined post text, no explanations or narration.',
      shorten: 'Reduce the length of this social media post while keeping the key points. Make it concise and punchy. IMPORTANT: Return ONLY the shortened post text, no explanations or narration.',
      expand: 'Expand this social media post with more details and context. Make it more informative and comprehensive. IMPORTANT: Return ONLY the expanded post text, no explanations or narration.',
      casual: 'Rewrite this social media post in a more friendly and casual tone. Make it conversational and approachable. IMPORTANT: Return ONLY the rewritten post text, no explanations or narration.',
      professional: 'Rewrite this social media post in a more formal and professional tone. Make it suitable for business contexts. IMPORTANT: Return ONLY the rewritten post text, no explanations or narration.',
      emojis: 'Add relevant emojis to this social media post to make it more engaging and visually appealing. Use emojis thoughtfully. IMPORTANT: Return ONLY the post text with emojis added, no explanations or narration.',
    };

    const systemPrompt = prompts[prompt] || prompts.improve;

    try {
      // Use Gemini API instead of OpenAI
      const model = gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(
        `${systemPrompt}\n\nContent to refine:\n${content}\n\nRemember: Output only the refined text with no additional commentary, explanations, or formatting.`
      );

      const response = result.response;
      return response.text() || content;
    } catch (err) {
      console.error('AI refine error:', err);
      throw new Error('Failed to refine content with AI');
    }
  }
}
