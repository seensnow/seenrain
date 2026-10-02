import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ArticleBody({ content }: { content: string }) {
  return <div className="blog-prose"><Markdown remarkPlugins={[remarkGfm]} components={{
    a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  }}>{content}</Markdown></div>;
}
