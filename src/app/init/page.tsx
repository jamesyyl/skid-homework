import { Suspense } from "react";
import InitPage from "@/components/pages/InitPage";

export default function InitRoute() {
  return (
    <Suspense>
      <InitPage />
    </Suspense>
  );
}
