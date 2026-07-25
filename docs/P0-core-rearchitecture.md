# P0: 核心架构重构 —— 单页不滚动骨架与动画状态机

**优先级：🔴 P0（阻塞后续所有工作）**
**目标：搭建一个单页不滚动、依赖动画渐进展示的体验骨架。**

---

## 1. 为什么必须重构骨架

当前项目的问题是**页面跳转**。用户点击开始 → 跳转到题目页 → 答完跳转结果页。这种传统的多页模式：

- 破坏了「沉浸感」—— 每次跳转都是一次出戏
- 无法做连续的时间线动画 —— 开场电影 → 答题 → 结果，应该是一个完整的叙事流
- 在移动端和桌面端表现不一致

**P0 的核心决策：单页应用，全屏切换，零滚动。**

---

## 2. 全局状态机设计

整个应用只有 4 个状态，由全局动画状态机统一管理：

```
┌─────────┐     自动播放/点击跳过      ┌─────────┐
│  CINEMA │ ────────────────────────→ │ INTERROGATION │
│  开场电影 │                          │    拷问/答题    │
└─────────┘                            └────┬────┘
     ↑                                      │ 答题完成
     │                                      ▼
     │                              ┌─────────┐
     │         点击「再测一次」      │ VERDICT │
     └──────────────────────────────│   裁决   │
                                   └────┬────┘
                                        │ 点击分享/查看详情
                                        ▼
                                   ┌─────────┐
                                   │ EPILOGUE│
                                   │   尾声   │
                                   └─────────┘
```

### 2.1 状态定义（TypeScript）

```ts
// types/animation.ts
type AppState = 'CINEMA' | 'INTERROGATION' | 'VERDICT' | 'EPILOGUE';

interface AnimationState {
  phase: AppState;
  // 当前 phase 内部的子进度，0~1，用于驱动微动画
  subProgress: number;
  // 用户是否主动跳过过场
  skipped: boolean;
  // 方向：前进 / 后退（用于判断动画方向）
  direction: 'forward' | 'backward';
}
```

### 2.2 状态转换规则

| 从状态 | 触发条件 | 到状态 | 动画时长 | 可跳过？ |
|--------|----------|--------|----------|----------|
| CINEMA | 动画播完 或 用户点击 | INTERROGATION | 3-5s | ✅ |
| INTERROGATION | 所有题目答完 | VERDICT | 0.8s | ❌ |
| VERDICT | 用户点击「分享」或「查看详情」 | EPILOGUE | 0.5s | ❌ |
| EPILOGUE | 用户点击「再测一次」 | CINEMA | 1s | ✅ |

**关键约束**：
- 状态转换必须由动画完成回调触发，不能由用户直接跳转（除非跳过开场）
- 每个状态进入时，必须确保上一个状态的 DOM 已完全卸载或隐藏（防止内存泄漏和动画冲突）
- 支持「再测一次」时重置所有答题状态

---

## 3. 开场电影（Cinema）

**目标**：用户打开页面，先看到 3-5 秒的电影级动画，然后自然过渡到答题界面。不是 loading，是**叙事的开头**。

### 3.1 叙事脚本

```
第 0s  : 黑屏。只有微弱的白色噪点（模拟 CRT 扫描线）。
第 0.5s: 一个光点在屏幕中心亮起，快速收缩成一条横线。
第 1.0s: 横线裂开，露出 "closeai.moe" 的文字轮廓（线框描边）。
第 1.5s: 线框填充为白色，下方浮现 "How Close Are You to AI?"
第 2.0s: 文字发生轻微 glitch（故障艺术闪烁），0.2s 后恢复。
第 2.5s: 画面轻微震动，出现一行小字：「这不是一个普通的测试」
第 3.0s: 所有文字向上滑出，下方升起一个脉冲光点（引导点击）
第 3.5s+: 等待用户点击，或 5s 后自动进入 INTERROGATION
```

### 3.2 技术实现

使用 **GSAP Timeline** 精确控制时间线：

```tsx
// sections/Cinema.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cinema({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete,
      defaults: { ease: 'power3.out' }
    });
    tlRef.current = tl;

    // 第 0.5s: 光点收缩成线
    tl.fromTo('.cinema-dot', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 }
    );
    tl.to('.cinema-dot', { scaleX: 50, scaleY: 0.02, duration: 0.4 });

    // 第 1.0s: 线裂开，露出文字轮廓
    tl.to('.cinema-line', { scaleX: 0, duration: 0.3 });
    tl.fromTo('.cinema-title-outline',
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 1 }
    );

    // 第 1.5s: 填充
    tl.to('.cinema-title-outline', { fill: '#fff', duration: 0.5 });
    tl.fromTo('.cinema-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }, '-=0.3'
    );

    // 第 2.0s: glitch 效果
    tl.add(() => triggerGlitch('.cinema-subtitle'), '+=0.3');

    // 第 2.5s: 提示语
    tl.fromTo('.cinema-hint',
      { opacity: 0 },
      { opacity: 0.5, duration: 0.5 }
    );

    // 第 3.0s: 上滑，出现脉冲
    tl.to('.cinema-text-group', { y: -100, opacity: 0, duration: 0.8 });
    tl.fromTo('.cinema-pulse',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5 }
    );

    // 自动进入
    tl.to({}, { duration: 2, onComplete }); // 2s 后自动完成

    return () => { tl.kill(); };
  }, [onComplete]);

  const handleSkip = () => {
    tlRef.current?.kill();
    onComplete();
  };

  return (
    <div ref={containerRef} className="cinema-container" onClick={handleSkip}>
      {/* ... SVG/文字元素 ... */}
    </div>
  );
}
```

### 3.3 视觉规格

| 元素 | 规格 |
|------|------|
| 背景 | `#000000`，叠加微弱噪点纹理（opacity 0.03） |
| 主标题 | Space Grotesk, 48px, weight 700, `#FFFFFF` |
| 副标题 | Space Grotesk, 18px, weight 400, `#AAAAAA` |
| 提示语 | Noto Sans SC, 14px, weight 300, `#666666` |
| 脉冲光点 | 白色圆点，CSS `box-shadow` 多层扩散脉冲动画 |
| 点击跳过 | 任意位置点击可跳过，但前 1s 内不响应（防止误触） |

---

## 4. 单页不滚动布局

### 4.1 核心 CSS

```css
/* 全局禁用滚动 */
html, body {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  background: #000;
  color: #fff;
}

/* 每个 section 都是全屏 */
.app-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 默认隐藏，由状态机控制显示 */
  opacity: 0;
  pointer-events: none;
}

.app-section.active {
  opacity: 1;
  pointer-events: all;
}
```

### 4.2 页面结构

```tsx
// page.tsx
export default function HomePage() {
  const { phase, transitionTo } = useAnimationState();

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'CINEMA' && (
          <Cinema key="cinema" onComplete={() => transitionTo('INTERROGATION')} />
        )}
        {phase === 'INTERROGATION' && (
          <Interrogation key="interrogation" onComplete={(scores) => transitionTo('VERDICT', scores)} />
        )}
        {phase === 'VERDICT' && (
          <Verdict key="verdict" onShare={() => transitionTo('EPILOGUE')} />
        )}
        {phase === 'EPILOGUE' && (
          <Epilogue key="epilogue" onRestart={() => transitionTo('CINEMA')} />
        )}
      </AnimatePresence>
    </main>
  );
}
```

### 4.3 转场动画

使用 Framer Motion 的 `AnimatePresence` 管理组件进出场：

| 转场 | 离场动画 | 入场动画 | 时长 |
|------|----------|----------|------|
| CINEMA → INTERROGATION | 整体向上滑出 `y: -100vh` | 从下方向上滑入 `y: 100vh → 0` | 0.8s |
| INTERROGATION → VERDICT | 模糊淡出 `filter: blur(10px), opacity: 0` | 从中心放大 `scale: 0.9 → 1` | 0.8s |
| VERDICT → EPILOGUE | 向两侧散开 | 从底部滑入 | 0.5s |
| EPILOGUE → CINEMA | 淡出 | 淡入（重置所有状态） | 1s |

---

## 5. 响应式策略

**桌面端（≥1024px）**：完整体验，所有动画、所有特效全开。

**平板（768px ~ 1023px）**：保持单页不滚动，字体适当缩小，动画简化 30%。

**移动端（< 768px）**：
- 仍然单页不滚动
- 开场电影缩短至 2-3s
- 答题区域改为上下布局（题目在上，选项在下）
- 减少粒子/光效数量

---

## 6. 性能约束

| 指标 | 目标 |
|------|------|
| FCP（首次内容绘制） | < 1.5s |
| LCP（最大内容绘制） | < 2.5s |
| 动画帧率 | 稳定在 60fps |
| 内存占用 | 切换状态后，上一状态的 DOM 和动画必须清理 |

**关键优化**：
- 使用 `will-change: transform, opacity` 在动画元素上
- 开场电影的 SVG/Canvas 动画使用 GPU 加速
- 字体使用 `font-display: swap`，避免阻塞渲染

---

## 7. 待决策问题

以下问题需要你在本文档上批注决策：

1. **开场电影是否支持音效？** 一个轻微的电子合成器音符可以提升沉浸感，但需要考虑浏览器的自动播放策略。不需要
2. **是否需要在开场电影中加入「进度条」？** 让用户知道还要等多久，还是保持神秘？酷炫的话可以添加
3. **移动端是否也坚持 3-5s 开场？** 还是缩短到 1-2s？可以
4. **GSAP 是否需要购买商业授权？** 如果未来有商业化可能，需要评估。不需要

---

## 8. 检查清单

- [x] 全局状态机 Hook 实现 (`useAnimationState`) — 2026-07-25：含 phase / subProgress / skipped / direction / restart，全部转换经 `transitionTo` 统一入口
- [x] Cinema 组件 + GSAP Timeline — 2026-07-25：完整实现 §3.1 叙事脚本（光点→横线→描边→填充→glitch→震动→脉冲），前 1s 防误触跳过，移动端 timeScale 1.5 加速，`prefers-reduced-motion` 近乎直出
- [x] AnimatePresence 转场封装 — 2026-07-25：四组转场均按 §4.3 规格；「向两侧散开」用横向拉伸+模糊近似实现，后续可在 P2 精化
- [x] 单页不滚动基础 CSS — 已就位（`globals.css`：`overflow: hidden` + 隐藏滚动条）
- [ ] 响应式断点测试 — 已有基础适配（Cinema 移动端加速、字号断点），真机验证待做
- [ ] 性能基准测试（Lighthouse）— 待做；实现已遵循 §6 约束（`will-change`、DOM 随 AnimatePresence 卸载、字体 swap）
