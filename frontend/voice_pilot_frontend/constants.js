
export const APP_TITLE = "Voice Blog AI";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const VOICE_COMMANDS_HELP = [
  { command: '"Create new post" / "New post"', description: "Open the new post form." },
  { command: '"Set title [your title]"', description: "Set title for the new post." },
  // { command: '"Set content [your content]"', description: "Set content for the new post." }, // Removed
  // { command: '"Suggest title"', description: "Ask AI to suggest a title based on content (modal must be open)." }, // Removed
  { command: '"Save post"', description: "Save the current new post. AI will generate content based on the title (modal must be open)." },
  { command: '"Cancel post" / "Close modal"', description: "Close new post form without saving (modal must be open)." },
  { command: '"Scroll down" / "Scroll up"', description: "Scroll the page." },
  { command: '"Show help" / "Open help"', description: "Open this help dialog." },
  { command: '"Close help" / "Hide help"', description: "Close this help dialog." },
  { command: '"Go to about page" / "Open about"', description: "Open the About page/modal." },
  { command: '"Close about page" / "Hide about"', description: "Close the About page/modal." },
  { command: '"Go to home page" / "Go home"', description: "Close all open modals and view post list." },
];
