import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose-editorial">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
