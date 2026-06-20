import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PackageDetailBody from "../../components/PackageDetailBody";
import { getPackage, packages } from "../../data/packages";

type PackagePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return packages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getPackage(slug);

  if (!item) {
    return {
      title: "Package Not Found | Voyagoglobal",
    };
  }

  return {
    title: `${item.place} | Voyagoglobal`,
    description: item.summary,
  };
}

export default async function PackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const item = getPackage(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <section className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <Link className="text-sm font-black text-[#075985]" href="/#packages">
            Back to packages
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0f766e]">
                Travel package
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
                {item.place}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#475569]">
                {item.summary}
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-[#475569]">
                <span className="rounded-md bg-white px-4 py-2">
                  {item.days}
                </span>
                <span className="rounded-md bg-white px-4 py-2">
                  Starting from {item.price}
                </span>
                <span className="rounded-md bg-white px-4 py-2">
                  Fully customizable
                </span>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-lg sm:min-h-[420px]">
              <Image
                alt={item.place}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                src={item.image}
              />
            </div>
          </div>
        </div>
      </section>

      <PackageDetailBody item={item} />
    </main>
  );
}
