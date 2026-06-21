import Link from "next/link";

const features = [
  {
    title: "People and groups",
    description: "Keep students, parents, teachers, and class groups organized.",
  },
  {
    title: "Attendance",
    description: "Record who is present, absent, late, or excused for each class.",
  },
  {
    title: "Payments and contracts",
    description: "See monthly payment and signed contract status in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ClassFlow
        </Link>
        <Link
          href="/login"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Open dashboard
        </Link>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pt-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Simple class management
          </p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Run your classes without the spreadsheet maze.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ClassFlow brings students, groups, attendance, monthly payments,
            contracts, and teachers into one clear dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold transition hover:bg-indigo-400"
            >
              Open dashboard
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500"
            >
              See features
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-indigo-950/30">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["24", "Students"],
              ["4", "Groups"],
              ["92%", "Attendance"],
              ["83%", "Payments"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-slate-800 p-5">
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-indigo-500 p-5">
            <p className="text-sm font-medium text-indigo-100">Next class</p>
            <p className="mt-1 text-xl font-bold">English Beginners</p>
            <p className="mt-1 text-sm text-indigo-100">
              Today at 16:00 · 8 students
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-800 bg-slate-900/60">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
