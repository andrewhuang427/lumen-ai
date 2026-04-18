import SquareLogo from "./square-logo";

export default function RootLoadingScreen() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background">
      <SquareLogo size={48} className="animate-pulse" shouldLink={false} />
    </div>
  );
}
