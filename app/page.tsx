import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: "👩‍🎓",
    title: "Mokiniai ir grupės",
    description:
      "Visa svarbiausia informacija apie mokinius, tėvus, mokytojus ir grupes vienoje vietoje.",
  },
  {
    icon: "✓",
    title: "Lankomumas",
    description:
      "Mokytojai greitai pažymi dalyvavusius mokinius ir mato tik jiems priskirtas grupes.",
  },
  {
    icon: "€",
    title: "Mokėjimai ir sutartys",
    description:
      "Patogiai sekami mėnesiniai mokėjimai bei saugomos pasirašytų sutarčių PDF bylos.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbff] text-[#19407a]">
      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Image
          src="/baltas-triusis-logo.jpg"
          alt="Baltas Triušis"
          width={220}
          height={60}
          className="h-auto w-44 sm:w-56"
          priority
        />
        <Link href="/login" className="brand-button text-sm">
          Prisijungti
        </Link>
      </nav>

      <section className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#dff5ff] blur-2xl" />
        <div className="relative z-10">
          <p className="mb-4 inline-flex rounded-full bg-[#fff4d6] px-4 py-2 text-sm font-bold text-[#b87800]">
            „Baltas Triušis“ valdymo sistema
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.08] tracking-tight text-[#19407a] sm:text-6xl">
            Viskas, ko reikia sklandžiam būrelių darbui.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#849aaa]">
            Mokiniai, grupės, lankomumas, mokėjimai, sutartys ir mokytojai –
            aiškiai, patogiai ir vienoje vietoje.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="brand-button px-6 py-3">
              Prisijungti prie sistemos
            </Link>
            <a href="#galimybes" className="brand-button-secondary px-6 py-3">
              Peržiūrėti galimybes
            </a>
          </div>
        </div>

        <div className="relative z-10 rounded-[28px] border border-[#d9eefb] bg-white p-5 shadow-[0_24px_60px_rgba(25,64,122,0.12)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0099ff]">Šiandien</p>
              <h2 className="mt-1 text-2xl">Būrelių apžvalga</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4d6] text-2xl">
              🐇
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["24", "Mokiniai"],
              ["4", "Grupės"],
              ["92 %", "Lankomumas"],
              ["83 %", "Mokėjimai"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`rounded-2xl p-5 ${
                  index === 0 ? "bg-[#0099ff] text-white" : "bg-[#eef9ff]"
                }`}
              >
                <p
                  className={`text-3xl font-extrabold ${
                    index === 0 ? "text-white" : "text-[#19407a]"
                  }`}
                >
                  {value}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    index === 0 ? "text-white/80" : "text-[#849aaa]"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-[#fff4d6] p-5">
            <p className="text-sm font-bold text-[#b87800]">Artimiausia grupė</p>
            <p className="mt-1 text-xl font-extrabold text-[#19407a]">
              Minecraft pradedantiesiems
            </p>
            <p className="mt-1 text-sm text-[#849aaa]">
              Šiandien 16:00 · 8 mokiniai
            </p>
          </div>
        </div>
      </section>

      <section id="galimybes" className="border-t border-[#d9eefb] bg-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="brand-card p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef9ff] text-xl text-[#0099ff]">
                {feature.icon}
              </div>
              <h2 className="text-xl">{feature.title}</h2>
              <p className="mt-2 leading-7 text-[#849aaa]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
