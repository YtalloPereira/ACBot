export const ChatbotTyping = () => {
  // Typing animation for the chatbot
  return (
    <div className="flex items-end">
      <div className="flex gap-2 text-md mx-2 items-start bg-border/80 px-3 py-4 rounded-full">
        <div className="size-2 rounded-full bg-foreground animate-pulse-size delay-0" />
        <div className="size-2 rounded-full bg-foreground animate-pulse-size delay-200" />
        <div className="size-2 rounded-full bg-foreground animate-pulse-size delay-500" />
      </div>
    </div>
  );
};
