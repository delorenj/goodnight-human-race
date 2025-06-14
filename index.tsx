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

// MAGICAL CURSOR TRACKING
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update magical cursor position
  const cursor = document.body;
  cursor.style.setProperty('--mouse-x', mouseX + 'px');
  cursor.style.setProperty('--mouse-y', mouseY + 'px');
  
  // Create sparkle trail
  if (Math.random() > 0.85) {
    createSparkleTrail(mouseX, mouseY);
  }
});

// Update cursor position in CSS
document.body.style.setProperty('--mouse-x', '0px');
document.body.style.setProperty('--mouse-y', '0px');

// Add CSS for cursor positioning
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  body::after {
    left: var(--mouse-x, 0px);
    top: var(--mouse-y, 0px);
  }
`;
document.head.appendChild(cursorStyle);

function createSparkleTrail(x: number, y: number) {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle-trail';
  sparkle.style.left = x + 'px';
  sparkle.style.top = y + 'px';
  sparkle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
  document.body.appendChild(sparkle);
  
  setTimeout(() => {
    sparkle.remove();
  }, 1000);
}

function createConfetti() {
  const colors = ['var(--primary-sage)', 'var(--primary-coral)', 'var(--primary-sky)', 'var(--primary-lavender)', 'var(--primary-amber)'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 50);
  }
}

async function addSlide(text: string, image: HTMLImageElement) {
  slideCount++;
  
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.style.animationDelay = `${slideCount * 0.15}s`;
  
  // Add different entrance animations for variety
  const entranceAnimations = [
    'slideEntrance',
    'slideEntranceRotate',
    'slideEntranceScale',
    'slideEntranceBounce'
  ];
  
  const randomAnimation = entranceAnimations[slideCount % entranceAnimations.length];
  slide.style.animation = `${randomAnimation} 1s ease-out`;
  
  const caption = document.createElement('div') as HTMLDivElement;
  caption.innerHTML = await marked.parse(text);
  
  // Add magical loading state
  image.classList.add('loading');
  image.onload = () => {
    image.classList.remove('loading');
    // Trigger confetti on image load occasionally
    if (Math.random() > 0.7) {
      setTimeout(() => createConfetti(), 500);
    }
  };
  
  slide.append(image);
  slide.append(caption);
  slideshow.append(slide);
  
  // Smooth scroll to the new slide with extra flair
  setTimeout(() => {
    slide.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest', 
      inline: 'center' 
    });
  }, 200);
}

// Add additional entrance animations
const additionalAnimations = document.createElement('style');
additionalAnimations.textContent = `
  @keyframes slideEntranceRotate {
    0% {
      opacity: 0;
      transform: perspective(800px) rotateY(90deg) rotateZ(45deg) translateX(200px) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: perspective(800px) rotateY(5deg) rotateZ(0deg) translateX(0) scale(1);
    }
  }
  
  @keyframes slideEntranceScale {
    0% {
      opacity: 0;
      transform: perspective(800px) scale(0.3) rotateX(45deg);
    }
    50% {
      opacity: 0.8;
      transform: perspective(800px) scale(1.1) rotateX(0deg);
    }
    100% {
      opacity: 1;
      transform: perspective(800px) scale(1) rotateY(5deg);
    }
  }
  
  @keyframes slideEntranceBounce {
    0% {
      opacity: 0;
      transform: perspective(800px) translateY(-200px) rotateX(45deg) scale(0.8);
    }
    60% {
      opacity: 1;
      transform: perspective(800px) translateY(20px) rotateX(-5deg) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: perspective(800px) translateY(0) rotateY(5deg) scale(1);
    }
  }
`;
document.head.appendChild(additionalAnimations);

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

  // Reset everything with SPECTACULAR transitions
  chat.history.length = 0;
  modelOutput.innerHTML = '';
  slideshow.innerHTML = '';
  error.innerHTML = '';
  error.toggleAttribute('hidden', true);

  // Trigger celebration confetti
  createConfetti();

  try {
    // Create user message with ENHANCED styling
    const userTurn = document.createElement('div') as HTMLDivElement;
    userTurn.innerHTML = await marked.parse(`**You asked:** ${message}`);
    userTurn.className = 'user-turn';
    modelOutput.append(userTurn);
    userInput.value = '';

    // Show slideshow container with fanfare
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
    
    // Add a SPECTACULAR completion indicator
    setTimeout(() => {
      const completionIndicator = document.createElement('div');
      completionIndicator.innerHTML = '🌟✨ <em>The End</em> ✨🌟';
      completionIndicator.style.cssText = `
        text-align: center;
        font-family: 'Caveat', cursive;
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(45deg, var(--primary-sage), var(--primary-coral), var(--primary-sky), var(--primary-lavender));
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: rainbowText 3s ease-in-out infinite, endingBounce 2s ease-in-out infinite;
        padding: var(--space-12);
        opacity: 0;
        transition: opacity 1s ease;
        transform: perspective(500px) rotateX(10deg);
        text-shadow: 0 0 30px rgba(168, 85, 247, 0.5);
      `;
      slideshow.append(completionIndicator);
      
      // Add ending bounce animation
      const endingStyle = document.createElement('style');
      endingStyle.textContent = `
        @keyframes endingBounce {
          0%, 100% { transform: perspective(500px) rotateX(10deg) translateY(0px) scale(1); }
          50% { transform: perspective(500px) rotateX(5deg) translateY(-20px) scale(1.1); }
        }
      `;
      document.head.appendChild(endingStyle);
      
      requestAnimationFrame(() => {
        completionIndicator.style.opacity = '1';
      });
      
      // Final confetti celebration
      setTimeout(() => {
        createConfetti();
      }, 1000);
    }, 1500);
    
  } catch (e) {
    const msg = parseError(e.toString());
    error.innerHTML = `<strong>Oops!</strong> Something went wonderfully wrong: ${msg}`;
    error.removeAttribute('hidden');
    slideshow.setAttribute('hidden', '');
  }
  
  userInput.disabled = false;
  userInput.focus();
}

// Enhanced keyboard interaction with MAGIC
userInput.addEventListener('keydown', async (e: KeyboardEvent) => {
  if (e.code === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
      // Add input sparkle effect
      createSparkleTrail(userInput.offsetLeft + userInput.offsetWidth / 2, userInput.offsetTop);
      await generate(message);
    }
  }
});

// SPECTACULAR example interactions
const examples = document.querySelectorAll('#examples li');
examples.forEach((li, index) => {
  li.addEventListener('click', async (e) => {
    // Add DRAMATIC click animation
    li.style.transform = 'scale(0.95) rotateZ(5deg)';
    li.style.boxShadow = 'var(--shadow-magical)';
    
    // Create click sparkles
    const rect = li.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createSparkleTrail(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height
        );
      }, i * 50);
    }
    
    setTimeout(() => {
      li.style.transform = '';
      li.style.boxShadow = '';
    }, 200);
    
    await generate(li.textContent || '');
  });
  
  // Add keyboard support with flair
  li.setAttribute('tabindex', '0');
  li.setAttribute('role', 'button');
  li.addEventListener('keydown', async (e) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      await generate(li.textContent || '');
    }
  });
});

// MAGICAL loading states
function showLoadingState() {
  const loadingSlide = document.createElement('div');
  loadingSlide.className = 'slide loading';
  loadingSlide.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
      <div style="font-size: 4rem; margin-bottom: 1rem; animation: loadingBounce 1s ease-in-out infinite;">🎨</div>
      <div style="font-family: 'Caveat', cursive; font-size: 1.8rem; font-weight: 700; background: linear-gradient(45deg, var(--primary-coral), var(--primary-lavender)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: textPulse 2s ease-in-out infinite;">
        Crafting your whimsical tale...
      </div>
    </div>
  `;
  slideshow.append(loadingSlide);
  return loadingSlide;
}

// Add loading bounce animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
  @keyframes loadingBounce {
    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(-15px) rotate(10deg) scale(1.1); }
  }
`;
document.head.appendChild(loadingStyle);

// ENHANCED focus management
userInput.addEventListener('focus', () => {
  userInput.style.transform = 'scale(1.03) rotateZ(1deg)';
  userInput.style.boxShadow = '0 0 0 6px rgba(14, 165, 233, 0.2), 0 0 50px rgba(16, 185, 129, 0.3)';
  
  // Create focus sparkles
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      createSparkleTrail(
        userInput.offsetLeft + Math.random() * userInput.offsetWidth,
        userInput.offsetTop + userInput.offsetHeight
      );
    }, i * 100);
  }
});

userInput.addEventListener('blur', () => {
  userInput.style.transform = 'scale(1)';
  userInput.style.boxShadow = '';
});

// Initialize with SPECTACULAR focus
document.addEventListener('DOMContentLoaded', () => {
  userInput.focus();
  
  // Welcome confetti
  setTimeout(() => {
    createConfetti();
  }, 1000);
});

// Add some random ambient sparkles
setInterval(() => {
  if (Math.random() > 0.95) {
    createSparkleTrail(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight
    );
  }
}, 2000);