import { type ModelProvider } from "../../server/utils/model-config";
import Image from "next/image";
import { openaiLogo } from "../../assets";
export default function ModelProviderLogo({
  provider,
}: {
  provider: ModelProvider;
}) {
  switch (provider) {
    case "openai":
      return <OpenAI />;
    default:
      return null;
  }
}

function OpenAI() {
  return (
    <Image
      src={openaiLogo}
      alt="OpenAI"
      width={24}
      height={24}
      className="shrink-0 rounded-sm border bg-white p-1"
    />
  );
}
