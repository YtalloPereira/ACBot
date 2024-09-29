export const formatMessage = (message: string) => {
  return message
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Negrito
    .replace(/(?<!\*)\*(?!\*)/g, '•') // Bullet points
    .replace(/https:\/\/[^\s]+/gi, (match) => {
      const url = new URL(match);
      const fileName = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
      return `- <a class="underline text-blue-500" href="${url}" target="_blank">${fileName}</a>`;
    }); // Links HTTPS para PDFs
};
