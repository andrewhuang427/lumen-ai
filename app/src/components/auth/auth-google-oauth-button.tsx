import Image from "next/image";
import { googleLogo } from "../../assets";
import { browserSupabase } from "../../server/supabase/supabase-client";
import { Button } from "../ui/button";

export default function GoogleOAuthButton() {
  async function handleGoogleOAuth() {
    await browserSupabase().auth.signInWithOAuth({
      provider: "google",
      // Stable URL for Supabase allow list (avoids long query/fragment in href)
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <Button
      variant="secondary"
      className="flex items-center gap-2"
      onClick={handleGoogleOAuth}
    >
      <Image src={googleLogo} alt="Google logo" width={20} height={20} />
      Sign in with Google
    </Button>
  );
}
