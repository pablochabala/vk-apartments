import { interiors } from "@/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";

/** Alternating image/text rows; each image wipes open (inset → full) then drifts with parallax. */
export function Interiors() {
  return (
    <section id="interiors" aria-labelledby="interiors-title" className="relative bg-paper py-[var(--section-y)]">
      <div className="container-x">
        <SectionTitle id="interiors-title" eyebrow={interiors.eyebrow} serif={interiors.titleSerif} title={interiors.title} size="xl" className="mb-20 md:mb-32" />

        <div className="flex flex-col gap-24 md:gap-40">
          {interiors.rows.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={row.title} className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
                <div className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}>
                  <ParallaxImage
                    image={row.image}
                    reveal="center"
                    speed={14}
                    className={`aspect-[4/5] md:aspect-[5/4] ${i === 1 ? "rounded-t-[999px] md:rounded-t-none md:rounded-tl-[clamp(60px,10vw,180px)]" : "rounded-[4px]"}`}
                    sizes="(min-width:768px) 58vw, 100vw"
                    cursorLabel="View"
                  />
                </div>
                <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                  <span className="display block text-[clamp(4rem,8vw,7rem)] text-copper/25">{String(i + 1).padStart(2, "0")}</span>
                  <RevealText as="h3" className="display mt-2 text-[clamp(2.2rem,3.6vw,3.4rem)]">
                    {row.title}
                  </RevealText>
                  <RevealText className="mt-5 text-ink-soft">{row.text}</RevealText>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
