import { Outlet, createFileRoute } from "@tanstack/react-router";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}
