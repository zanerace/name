import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/motion")({
  component: MotionRouteLayout,
});

function MotionRouteLayout() {
  return <Outlet />;
}
