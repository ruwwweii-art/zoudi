import { DEMO_MODE, demoRoutes, demoStats } from "@/lib/demo";

export function DemoShell() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6f2e8_0%,#f8f7f4_38%,#fcfbf8_100%)] text-stone-900">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col gap-6 rounded-[32px] border border-stone-200/70 bg-white/85 p-8 shadow-[0_20px_60px_rgba(54,44,24,0.08)] backdrop-blur md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
              走地 Demo
            </span>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              {DEMO_MODE ? "演示模式已开启" : "演示模式已关闭"}
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                不连数据库，也可以先把路线产品原型跑起来。
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
                当前首页直接用假数据演示约会、遛娃和 Citywalk
                的后台内容形态。你可以先看页面、继续接 AI，
                等后面准备好 MySQL 再接回真实数据库。
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] bg-stone-900 p-5 text-stone-50">
              {demoStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.22em] text-stone-300">
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          {demoRoutes.map((route) => (
            <article
              key={route.id}
              className="group flex h-full flex-col justify-between rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_16px_40px_rgba(54,44,24,0.06)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
                    {route.scene}
                  </span>
                  <span className="text-sm text-stone-500">{route.duration}</span>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {route.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {route.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {route.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="text-sm font-medium text-stone-500">
                  预算：{route.budget}
                </div>
                <ul className="space-y-2 text-sm leading-7 text-stone-700">
                  {route.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[32px] border border-dashed border-stone-300 bg-stone-50/80 p-6 md:p-8">
          <h3 className="text-xl font-semibold">接下来怎么继续</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
            现在你已经可以直接跑 `npm run dev` 看页面。如果下一步想继续推进，我可以继续帮你补：
            后台表单、AI 生成路线按钮、假数据 API，或者之后再切回 MySQL。
          </p>
        </section>
      </section>
    </main>
  );
}
