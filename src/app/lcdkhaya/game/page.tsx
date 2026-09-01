import type { Metadata } from "next";
import { lcdKhayaConfig } from "@/lib/lcdkhaya/config";
import PageHero from "@/components/lcdkhaya/PageHero";
import ParkingGame from "@/components/lcdkhaya/ParkingGame";

export const metadata: Metadata = { title: { absolute: `Parking Challenge | ${lcdKhayaConfig.shortName}` } };

export default function GamePage() {
  return (
    <div>
      <PageHero
        title="Parking Challenge"
        subtitle="Steer into the bay without hitting anything. Arrow keys (or W/A/S/D) on desktop, on-screen buttons on mobile."
        breadcrumbs={[{ label: "Home", href: "/lcdkhaya" }, { label: "Parking Challenge" }]}
      />
      <div className="container-page py-6">
        <ParkingGame />
      </div>
    </div>
  );
}
