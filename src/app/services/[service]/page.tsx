import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceDetailClient from "@/components/ServiceDetailClient";

export function generateStaticParams() {
  return [
    { service: "double-selling" },
    { service: "chain-of-title" },
    { service: "cadastral-area" },
    { service: "deed-mutation" },
    { service: "timing-anomaly" },
    { service: "pre-registration" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  return {
    title: `সেবা বিবরণ: ${service} | LandTrace`,
    description: "ল্যান্ডট্রেস ভূমি রেকর্ড অডিট ও বিশ্লেষণ সেবার বিশদ বিবরণ।",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <ServiceDetailClient serviceSlug={service} />
      </main>
      <Footer />
    </div>
  );
}
