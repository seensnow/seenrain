import { spawnSync } from 'node:child_process';
import { root } from './lib/blog.mjs';
import { syncBlog } from './sync-blog.mjs';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} 失败，发布已停止。`);
}
function gitText(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim());
  return result.stdout.trim();
}
if (gitText(['branch', '--show-current']) !== 'main') throw new Error('请在 main 分支发布博客。');
if (gitText(['diff', '--cached', '--name-only'])) throw new Error('暂存区已有其他修改，请先处理，再发布博客。');
await syncBlog();
run('npm', ['run', 'build'], { env: { ...process.env, GITHUB_PAGES: 'true', GITHUB_REPOSITORY: 'seensnow/seenrain' } });
run('git', ['add', '-A', '--', 'content/blogs', 'app/blogs/posts.json']);
if (gitText(['diff', '--cached', '--name-only'])) run('git', ['commit', '-m', 'Update blog content']);
run('git', ['push', 'origin', 'main']);
console.log('文章已上传，正式上线结果请查看 GitHub Actions。');
