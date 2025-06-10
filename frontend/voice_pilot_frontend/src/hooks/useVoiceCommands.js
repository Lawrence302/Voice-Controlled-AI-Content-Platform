import { useEffect, useCallback } from 'react';
import { useVoiceRecognition } from './useVoiceRecognition.js';
// import { generateBlogPostContent } from '../../geminiService.js';


//////


////

/**
 * Hook to manage voice command logic for the app
 */
export const useVoiceCommands = ({
  isCreatePostModalOpen,
  setIsCreatePostModalOpen,
  setCurrentPostDraft,
  handleCreatePost,
  setIsHelpModalOpen,
  helpScrollRef,
  addAlert,
  navigate
}) => {
  const {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported
  } = useVoiceRecognition();

  const processCommand = useCallback(async (command) => {
   
    // This is the actual command spoken by the user 
    command = command.toLowerCase().trim();
    console.log('Processing command:', command);

   
    // command processing and actions
    if (command) {
      console.log('📤 Sending command to backend:', command);
      try{
        const response = await fetch('http://localhost:8000/voice-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: command })
          });

        if (!response.ok){
          throw new Error(`server responeded with status: ${response.status}`)
        }
        
        const actualCommand = await response.json();

        console.log("this is the actual command : ", actualCommand)
        console.log("actual : ", actualCommand , " actual")
        //
        // 
        addAlert('info', `Heard: "${command}"`);

        if (actualCommand.action == "navigate"){
            if (actualCommand.target == ""){
              addAlert('info', 'Welcome to home page');
            }else{
               addAlert('info', `${actualCommand.target} Page opened`);
            }
           
            navigate(`/${actualCommand.target}`);
  
        }

        if (actualCommand.action == "view_post"){
          console.log(actualCommand.target)

          // fetch(`http://localhost:8000/blog/`)
          const post_id = actualCommand.target
          navigate(`/post/${post_id}`)
        }

        // Note** avoid return statements in the if blocks. it may cause an infinite loop
        if (actualCommand.action == "open_help"){
          setIsHelpModalOpen(true);
          
        }

        if (actualCommand.action == "close_help"){
          setIsHelpModalOpen(false);
         
        }

        if (setIsHelpModalOpen){
          if(actualCommand.action == "scroll_help_down"&& helpScrollRef?.current){
               helpScrollRef.current.scrollBy({
                top: 100,
                behavior: 'smooth',
              });
          }

          if(actualCommand.action == "scroll_help_up"&& helpScrollRef?.current){
             helpScrollRef.current.scrollBy({
              top: -100,
              behavior: 'smooth',
            });
          }
        }

        // Note** avoid return statements in the if blocks. it may cause an infinite loop
        // this below is a disaster

        // if (actualCommand.action == "scroll_down"){
        //   window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
        //   return
        // }

        if (actualCommand.action == "scroll_down"){
          window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
          
        }

         if (actualCommand.action == "scroll_up"){
           window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
        
        }

        if (actualCommand.action == "create_post"){
          setCurrentPostDraft({ title: '' });
          setIsCreatePostModalOpen(true);
          addAlert('info', 'New post modal opened. Say "Set title [your title]" then "Save post".');
          
        }

        if (isCreatePostModalOpen) {
         
          if (actualCommand.action == "cancel_save"){
            setIsCreatePostModalOpen(false);
            setCurrentPostDraft({ title: '' });
            addAlert('info', 'New post cancelled.');

            
          }

          if (actualCommand.action == "set_title"){
            const title = command.substring('set title '.length);
            setCurrentPostDraft(prev => ({ ...prev, title }));
        
            addAlert('success', `Title set to: "${title}"`);
            
          }

          if (actualCommand.action == "save_post"){
           
              await handleCreatePost();
             
          }

        }

        // if (command.startsWith('create new post') || command.startsWith('new post')) {
        //   setCurrentPostDraft({ title: '' });
        //   setIsCreatePostModalOpen(true);
        //   addAlert('info', 'New post modal opened. Say "Set title [your title]" then "Save post".');
        // } else if (command.startsWith('scroll down')) {
        //   window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
        // } else if (command.startsWith('scroll up')) {
        //   window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
        // } else if (command.startsWith('show help') || command.startsWith('open help')) {
        //   setIsHelpModalOpen(true);
        // } else if (command.startsWith('close help') || command.startsWith('hide help')) {
        //   setIsHelpModalOpen(false);
          
        // } 

        // if (isCreatePostModalOpen) {
        //   if (command.startsWith('set title ')) {
        //     const title = command.substring('set title '.length);
        //     setCurrentPostDraft(prev => ({ ...prev, title }));
        //     addAlert('success', `Title set to: "${title}"`);
        //   } else if (command === 'save post') {
        //     await handleCreatePost();
        //   } else if (command === 'cancel post' || command === 'close modal') {
        //     setIsCreatePostModalOpen(false);
        //     setCurrentPostDraft({ title: '' });
        //     addAlert('info', 'New post cancelled.');
        //   }
        // }
        
      }catch(err){
        
        console.error("❌ Failed to send voice command:", err)
        addAlert('error', "Failed to process voice command. ")
       
      }
    }

    resetTranscript();
  }, [
    addAlert,
    isCreatePostModalOpen,
    resetTranscript,
    setCurrentPostDraft,
    setIsCreatePostModalOpen,
    setIsHelpModalOpen,
    handleCreatePost
  ]);

  useEffect(() => {
    if (finalTranscript) {
      processCommand(finalTranscript);
    }
  }, [finalTranscript, processCommand]);

  return {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    error,
    isSupported
  };
};
