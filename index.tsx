/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, Modality} from '@google/genai';
import {marked} from 'marked';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const chat = ai.chats.create({
  model: 'gemini-2.0-flash-preview-image-generation',
  config: {
    responseModalities: [Modality.TEXT, Modality.IMAGE],
  },
  history: [],
});

const userInput = document.querySelector('#input') as HTMLTextAreaElement;
const modelOutput = document.querySelector('#output') as HTMLDivElement;
const slideshow = document.querySelector('#slideshow') as HTMLDivElement;
const error = document.querySelector('#error') as HTMLDivElement;

const additionalInstructions = `
Create a whimsical bedtime story that explains the topic using whatever theme the user suggests (or tiny cats if no theme is specified).
The story should have the charm of a children's illustrated book but with subtle, sophisticated humor that adults will appreciate.
Think "Goodnight Moon" meets "The Hitchhiker's Guide to the Galaxy" - innocent on the surface, cleverly snarky underneath.

Guidelines:
- Keep sentences short, conversational, and engaging
- Add gentle humor that works on multiple levels
- Include moments of delightful absurdity
- End with a cozy, bedtime-appropriate conclusion
- Generate a cute, minimal illustration for each sentence with soft colors and whimsical style
- The illustrations should feel like they belong in a premium children's book
- No commentary, just begin your delightful explanation
- Embrace the beautiful ridiculousness of explaining complex topics through simple metaphors

Remember: We're creating something that makes both children and adults smile, but for slightly different reasons.
`;

let slideCount = 0;

async function addSlide(text: string, image: HTMLImageElement) {
  slideCount++;
  
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.style.animationDelay = `${slideCount * 0.1}s`;
  
  const caption = document.createElement('div') as HTMLDivElement;
  caption.innerHTML = await marked.parse(text);
  
  // Add loading state
  image.classList.add('loading');
  image.onload = () => {
    image.classList.remove('loading');
  };
  
  slide.append(image);
  slide.append(caption);
  slideshow.append(slide);
  
  // Smooth scroll to the new slide
  setTimeout(() => {
    slide.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest', 
      inline: 'center' 
    });
  }, 100);
}

function parseError(error: string) {
  const regex = /{"error":(.*)}/gm;
  const m = regex.exec(error);
  try {
    const e = m[1];
    const err = JSON.parse(e);
    return err.message;
  } catch (e) {
    return error;
  }
}

async function generate(message: string) {
  userInput.disabled = true;
  slideCount = 0;

  // Reset everything with smooth transitions
  chat.history.length = 0;
  modelOutput.innerHTML = '';
  slideshow.innerHTML = '';
  error.innerHTML = '';
  error.toggleAttribute('hidden', true);

  try {
    // Create user message with enhanced styling
    const userTurn = document.createElement('div') as HTMLDivElement;
    userTurn.innerHTML = await marked.parse(`**You asked:** ${message}`);
    userTurn.className = 'user-turn';
    modelOutput.append(userTurn);
    userInput.value = '';

    // Show slideshow container
    slideshow.removeAttribute('hidden');

    const result = await chat.sendMessageStream({
      message: message + additionalInstructions,
    });

    let text = '';
    let img = null;

    for await (const chunk of result) {
      for (const candidate of chunk.candidates) {
        for (const part of candidate.content.parts ?? []) {
          if (part.text) {
            text += part.text;
          } else {
            try {
              const data = part.inlineData;
              if (data) {
                img = document.createElement('img');
                img.src = `data:image/png;base64,` + data.data;
                img.alt = `Illustration for: ${text.substring(0, 100)}...`;
                img.loading = 'lazy';
              } else {
                console.log('no data', chunk);
              }
            } catch (e) {
              console.log('no data', chunk);
            }
          }
          if (text && img) {
            await addSlide(text, img);
            text = '';
            img = null;
          }
        }
      }
    }
    
    // Handle any remaining content
    if (img) {
      await addSlide(text, img);
    }
    
    // Add a subtle completion indicator
    setTimeout(() => {
      const completionIndicator = document.createElement('div');
      completionIndicator.innerHTML = '✨ <em>The End</em> ✨';
      completionIndicator.style.cssText = `
        text-align: center;
        font-family: 'Caveat', cursive;
        font-size: 1.5rem;
        color: var(--neutral-500);
        padding: var(--space-8);
        opacity: 0;
        transition: opacity 0.5s ease;
      `;
      slideshow.append(completionIndicator);
      
      requestAnimationFrame(() => {
        completionIndicator.style.opacity = '1';
      });
    }, 1000);
    
  } catch (e) {
    const msg = parseError(e.toString());
    error.innerHTML = `<strong>Oops!</strong> Something went wonderfully wrong: ${msg}`;
    error.removeAttribute('hidden');
    slideshow.setAttribute('hidden', '');
  }
  
  userInput.disabled = false;
  userInput.focus();
}

// Enhanced keyboard interaction
userInput.addEventListener('keydown', async (e: KeyboardEvent) => {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
      await generate(message);
    }
  }
});

// Enhanced example interactions
const examples = document.querySelectorAll('#examples li');
examples.forEach((li, index) => {
  li.addEventListener('click', async (e) => {
    // Add a subtle click animation
    li.style.transform = 'scale(0.98)';
    setTimeout(() => {
      li.style.transform = '';
    }, 150);
    
    await generate(li.textContent || '');
  });
  
  // Add keyboard support
  li.setAttribute('tabindex', '0');
  li.setAttribute('role', 'button');
  li.addEventListener('keydown', async (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      await generate(li.textContent || '');
    }
  });
});

// Add some delightful loading states
function showLoadingState() {
  const loadingSlide = document.createElement('div');
  loadingSlide.className = 'slide loading';
  loadingSlide.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 280px;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
      <div style="font-family: 'Caveat', cursive; font-size: 1.5rem; color: var(--neutral-500);">
        Crafting your whimsical tale...
      </div>
    </div>
  `;
  slideshow.append(loadingSlide);
  return loadingSlide;
}

// Focus management for better accessibility
userInput.addEventListener('focus', () => {
  userInput.style.transform = 'scale(1.02)';
});

userInput.addEventListener('blur', () => {
  userInput.style.transform = 'scale(1)';
});

// Initialize with focus on input
document.addEventListener('DOMContentLoaded', () => {
  userInput.focus();
});