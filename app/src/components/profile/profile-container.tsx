import { type PropsWithChildren } from "react";

export default function ProfileContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 p-4 md:my-8">
        {children}
      </div>
    </div>
  );
}
