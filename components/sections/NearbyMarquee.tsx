import { nearby } from "@/content";
import { Marquee } from "@/components/ui/Marquee";
import { HexFill, HexOutline } from "@/components/ui/Hex";

export function NearbyMarquee() {
  return (
    <section aria-label="Places near VK Apartments" className="relative overflow-hidden border-y border-line bg-paper py-10 md:py-16">
      <h2 className="sr-only">Nearby in Kitwe</h2>
      <ul className="sr-only">
        {[...nearby.rowA, ...nearby.rowB].map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="flex flex-col gap-2 md:gap-4">
        <Marquee
          items={nearby.rowA}
          duration={45}
          className="text-[clamp(2.8rem,8vw,7.5rem)] leading-none"
          itemClassNames={["display", "serif text-copper-deep"]}
          separator={<HexFill className="mx-[0.3em] h-[0.28em] w-[0.28em] text-copper" />}
        />
        <Marquee
          items={nearby.rowB}
          direction={-1}
          duration={50}
          className="text-[clamp(2.8rem,8vw,7.5rem)] leading-none text-slate"
          itemClassNames={["serif", "display"]}
          separator={<HexOutline className="mx-[0.3em] h-[0.32em] w-[0.32em] text-copper" strokeWidth={2} />}
        />
      </div>
    </section>
  );
}
