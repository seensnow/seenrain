import { generatePosts } from './lib/blog.mjs';
const posts = await generatePosts();
console.log(`博客已生成：${posts.length} 篇文章。`);
