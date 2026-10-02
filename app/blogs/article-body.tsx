export default function ArticleBody({ content }: { content: string }) {
  return <div className="blog-prose">{content.trim().split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph.split(/(https?:\/\/[^\s（）()<>]+)/g).map((part, i) =>
      /^https?:\/\//.test(part) ? <a href={part} target="_blank" rel="noopener noreferrer" key={i}>{part}</a> : part
    )}</p>
  ))}</div>;
}
