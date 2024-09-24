export const formatMessage = (message: string) => {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Negrito
    .replace(/(?<!\*)\*(?!\*)/g, '•') // Bullet points
    .replace(/https:\/\/[^\s]+\.pdf/gi, (match) => {
      const fileName = match.substring(match.lastIndexOf('/') + 1);
      return `- <a class="underline text-blue-500" href="${match}" target="_blank">${fileName}</a>`;
    }); // Links HTTPS para PDFs
};
