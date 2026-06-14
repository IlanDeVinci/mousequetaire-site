import { permanentRedirect } from "next/navigation";

export default function TarifsV2Redirect() {
  permanentRedirect("/nostarifs");
}
