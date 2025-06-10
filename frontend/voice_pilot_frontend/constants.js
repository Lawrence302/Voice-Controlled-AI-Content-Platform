
export const APP_TITLE = "Voice Blog AI";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const VOICE_COMMANDS_HELP = [

  { command: '"Show help" / "Open help"', description: "Open this help modal." },

  { command: '"Create new post" / "New post"', description: "Open the new post form." },
  { command: '"Set title [your title]"', description: "Set title for the new post." },
  // { command: '"Set content [your content]"', description: "Set content for the new post." }, // Removed
  // { command: '"Suggest title"', description: "Ask AI to suggest a title based on content (modal must be open)." }, // Removed
  { command: '"Save post"', description: "Save the current new post. AI will generate content based on the title (modal must be open)." },
  { command: '"Open post with ID (e.g 2)" ', description: "Open a post with the specific ID mentioned" },

  { command: '"Cancel post" / "Close post modal"', description: "Close new post form without saving (modal must be open)." },
   { command: '"Close help" / "Hide help"', description: "Close this help modal." },
  { command: '"Go to about page" / "Open about"', description: "Open the About page." },
  { command: '"Go to contact page" / "open contact page"', description: "navigate to the contacts page" },
  { command: '"Go to home page" / "Go home"', description: "Opens home page and shows post list." },
  { command: '"Scroll down" / "Scroll up"', description: "Scroll the page." },
  { command: '"Scroll help up" / "Scroll help down"', description: "Scroll the help modal" },

  
];
