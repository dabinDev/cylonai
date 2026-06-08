import Header from "./Header";
import { getCurrentHeaderUser } from "@/lib/currentUser";

export default async function HeaderServer() {
  const user = await getCurrentHeaderUser();
  return <Header user={user} />;
}
