'use client'

import { useInView } from '@/hooks/use-in-view'

export function DemoPreview() {
  const { ref, inView } = useInView(0.2)

  return (
    <section className="py-24 px-6">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <p
          className={`text-xs text-muted-text font-mono tracking-[0.2em] text-center mb-4 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          PRODUCT PREVIEW
        </p>
        <h2
          className={`text-[32px] font-semibold text-foreground text-center mb-10 transition-all duration-700 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          See Dev AI in action
        </h2>

        <div
          className={`border border-strong rounded-xl overflow-hidden bg-surface max-w-4xl mx-auto transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ boxShadow: '0 -1px 0 0 #7c3aed40, 0 0 60px 0 #7c3aed10' }}
        >
          <div className="bg-elevated border-b border-border h-10 flex items-center px-4 gap-2">
            <span className="size-3 rounded-full" style={{ background: '#ff5f56' }} />
            <span className="size-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="size-3 rounded-full" style={{ background: '#27c93f' }} />
            <span className="text-xs text-muted-text font-mono ml-4">devai.app/review</span>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-[55%] border-b md:border-b-0 md:border-r border-border">
              <div className="flex gap-0.5 p-2 border-b border-border bg-elevated">
                {['JS', 'TS', 'React', 'Next.js'].map((lang, i) => (
                  <span
                    key={lang}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md ${
                      i === 0
                        ? 'bg-accent text-white'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
              <div className="p-4 bg-[#0a0a0a] font-mono text-[13px] leading-relaxed overflow-x-auto min-h-[220px]">
                <pre className="text-[#a6accd]">
                  <span className="text-[#c792ea]">function</span>{' '}
                  <span className="text-[#82aaff]">fetchUser</span>
                  <span className="text-[#a6accd]">(</span>
                  <span className="text-[#eeffff]">id</span>
                  <span className="text-[#a6accd]">) {'{'}</span>
                  {'\n'}
                  <span className="text-[#a6accd]">  </span>
                  <span className="text-[#c792ea]">var</span>{' '}
                  <span className="text-[#eeffff]">data</span>
                  <span className="text-[#a6accd]"> = </span>
                  <span className="text-[#82aaff]">fetch</span>
                  <span className="text-[#a6accd]">(</span>
                  <span className="text-[#c3e88d]">'/api/users/'</span>
                  <span className="text-[#a6accd]"> + </span>
                  <span className="text-[#eeffff]">id</span>
                  <span className="text-[#a6accd]">)</span>
                  {'\n'}
                  <span className="text-[#a6accd]">  </span>
                  <span className="text-[#c792ea]">return</span>{' '}
                  <span className="text-[#eeffff]">data</span>
                  <span className="text-[#a6accd]">.</span>
                  <span className="text-[#eeffff]">name</span>
                  {'\n'}
                  <span className="text-[#a6accd]">{'}'}</span>
                </pre>
              </div>
            </div>

            <div className="md:w-[45%] p-4 bg-surface space-y-4">
              <div className="flex flex-col items-center">
                <svg width={80} height={80} className="transform -rotate-90">
                  <circle cx={40} cy={40} r={30} fill="none" stroke="#2a2a2a" strokeWidth={6} />
                  <circle
                    cx={40} cy={40} r={30} fill="none" stroke="#f59e0b" strokeWidth={6}
                    strokeLinecap="round" strokeDasharray={188.5} strokeDashoffset={188.5 * 0.58}
                  />
                </svg>
                <span className="font-mono text-2xl font-bold text-amber-500 -mt-14">42</span>
                <span className="text-[10px] text-muted-text -mt-1">/ 100</span>
              </div>

              <div className="bg-elevated border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20 font-medium">high</span>
                  <span className="text-sm font-medium text-foreground">Async handling bug</span>
                </div>
                <p className="text-xs text-muted-foreground">Missing await on fetch call — function returns a Promise, not the result.</p>
              </div>

              <div className="bg-elevated border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium">medium</span>
                  <span className="text-sm font-medium text-foreground">No error handling</span>
                </div>
                <p className="text-xs text-muted-foreground">fetch could reject. Wrap with try/catch or handle the rejected promise.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-text font-mono text-center mt-4">
          Actual Dev AI output — analyze your code in seconds
        </p>
      </div>
    </section>
  )
}
