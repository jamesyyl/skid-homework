import RequireAiKey from "@/components/guards/RequireAiKey";
import ScanPage from "@/components/pages/ScanPage";

export default function HomePage() {
  return (
    <RequireAiKey fallback="/init">
      <ScanPage />
    </RequireAiKey>
  );
}
