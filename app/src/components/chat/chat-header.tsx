import ThemeToggle from "../theme/theme-toggle";

export default function ChatHeader() {
  return (
    <div className="absolute top-0 z-10 flex h-20 w-full items-center border-b border-transparent p-6 font-medium">
      <div className="grow" />
      <ThemeToggle />
    </div>
  );
}
