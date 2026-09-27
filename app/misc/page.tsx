import type { Metadata } from 'next';
import Construction from '../construction';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: '其他 — 雪人工坊' };

export default function MiscPage() {
  return <Construction section="其他" note="一些零散、有趣的小东西会放在这里。" />;
}
