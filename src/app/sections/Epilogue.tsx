'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { snapdom } from '@zumer/snapdom';
import QRCode from 'qrcode';
import type { QuizResult } from '@/app/lib/quiz';
import { getPersonalityByCode } from '@/app/lib/personalities';
import { generateShareCopy, generatePermalink } from '@/app/lib/copy';
import type { ProviderSelection } from '@/app/types';
import ShareCard from '@/app/components/ShareCard';

interface EpilogueProps {
  result: QuizResult | null;
  providers: ProviderSelection;
  onRestart: () => void;
}

/**
 * 尾声：分享与重测（P3）
 *
 * 分享矩阵（P3 §3.1）：复制链接 / 下载图片 / 复制文案 / 微博 / Twitter / QQ / 微信二维码
 */
export default function Epilogue({ result, providers, onRestart }: EpilogueProps) {
  const [notice, setNotice] = useState('');
  const [exporting, setExporting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [cardQr, setCardQr] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const personality = result ? getPersonalityByCode(result.code) : undefined;
  const permalink = result ? generatePermalink(result.code) : '';

  // 分享卡上的域名二维码（P3 修正）：黑码白底保证扫码可靠性。
  // hook 必须放在 early-return 之前，因此 permalink 为空时跳过。
  useEffect(() => {
    if (!permalink) return;
    let cancelled = false;
    QRCode.toDataURL(permalink, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then((url) => {
      if (!cancelled) setCardQr(url);
    });
    return () => { cancelled = true; };
  }, [permalink]);

  // 预览容器高度自适应：transform scale 不改变布局高度，
  // 用「可视高度 - 布局高度」动态计算负 margin，卡片变高（加了三段文案）也不会压住下方按钮。
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const sync = () => {
      el.style.marginBottom = `${el.getBoundingClientRect().height - el.offsetHeight}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  const toast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  if (!result || !personality) {
    return (
      <motion.div
        className="fixed inset-0 z-20 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1 } }}
      >
        <button
          onClick={onRestart}
          className="px-8 py-4 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black transition-all duration-300 font-sans text-sm tracking-wider"
        >
          再测一次
        </button>
      </motion.div>
    );
  }

  const copyText = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(msg);
    } catch {
      toast('复制失败，请手动复制');
    }
  };

  /** 用 snapdom 把分享卡渲染成 PNG Blob（下载用） */
  const renderCardBlob = async (): Promise<Blob> => {
    const el = document.getElementById('share-card');
    if (!el) throw new Error('share-card not found');
    const capture = await snapdom(el, { scale: 2, backgroundColor: '#000000' });
    const img = await capture.toPng();
    const res = await fetch(img.src);
    return res.blob();
  };

  const handleDownload = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await renderCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `closeai-${result.code}-${Date.now()}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast('图片已下载');
    } catch (err) {
      console.error('export failed', err);
      toast('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const shareText = generateShareCopy(result.code);

  const handleWeibo = () =>
    openShare(
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(permalink)}&title=${encodeURIComponent(shareText)}`,
    );

  const handleTwitter = () =>
    openShare(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(permalink)}`,
    );

  const handleQQ = () =>
    openShare(
      `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(permalink)}&title=${encodeURIComponent('CloseAI.moe — How Close Are You to AI?')}&summary=${encodeURIComponent(shareText)}`,
    );

  const handleWechat = async () => {
    if (qrDataUrl) {
      setQrDataUrl(null);
      return;
    }
    const dataUrl = await QRCode.toDataURL(permalink, {
      width: 320,
      margin: 1,
      color: { dark: '#ffffff', light: '#000000' },
    });
    setQrDataUrl(dataUrl);
  };

  const BTN =
    'px-4 py-2.5 border border-neutral-700 text-neutral-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-sans text-xs md:text-sm tracking-wider disabled:opacity-40';

  return (
    <motion.div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black"
      initial={{ opacity: 0, y: '100vh' }}
      animate={{ opacity: 1, y: 0 }}
      // EPILOGUE → CINEMA：淡出 1s（「再测一次」由 restart() 重置全部状态）
      exit={{ opacity: 0, transition: { duration: 1 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-5 px-4 py-8 max-h-screen overflow-y-auto">
        {/* 分享卡预览（缩放适配屏幕；负 margin 由 JS 按实际高度动态计算） */}
        <div ref={previewRef} className="origin-top scale-[0.52] sm:scale-[0.65] md:scale-75 lg:scale-[0.8]">
          <ShareCard result={result} personality={personality} providers={providers} qrDataUrl={cardQr} />
        </div>

        {/* 分享矩阵：两行——第一行图片与素材，第二行社交渠道（P3 修正） */}
        <div className="flex flex-col items-center gap-3 max-w-xl">
          <div className="flex flex-wrap justify-center gap-3">
            <button className={BTN} onClick={handleDownload} disabled={exporting}>
              {exporting ? '生成中…' : '下载图片'}
            </button>
            <button className={BTN} onClick={() => copyText(permalink, '链接已复制')}>
              复制链接
            </button>
            <button className={BTN} onClick={() => copyText(`${shareText}\n\n${permalink}`, '文案已复制')}>
              复制文案
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button className={BTN} onClick={handleWeibo}>微博</button>
            <button className={BTN} onClick={handleTwitter}>Twitter / X</button>
            <button className={BTN} onClick={handleQQ}>QQ</button>
            <button className={BTN} onClick={handleWechat}>
              {qrDataUrl ? '收起二维码' : '微信'}
            </button>
          </div>
        </div>

        {/* 微信二维码 */}
        {qrDataUrl && (
          <motion.div
            className="flex flex-col items-center gap-2 border border-neutral-800 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="微信扫码查看结果" width={180} height={180} />
            <span className="font-sans text-xs text-neutral-500">微信扫码，查看这个测试结果</span>
          </motion.div>
        )}

        {/* 提示 */}
        <div className="h-5 font-sans text-xs text-neutral-500">{notice}</div>

        {/* 再测一次 */}
        <button
          onClick={onRestart}
          className="mt-1 px-8 py-3 font-sans text-sm text-neutral-500 hover:text-white transition-colors tracking-wider border-b border-transparent hover:border-white"
        >
          再测一次（会抽到新题）
        </button>
      </div>
    </motion.div>
  );
}
