import { redirect } from "next/navigation";
import { isAiStudio } from "@/lib/is-ai-studio";
import { getCurrentUser } from "@/lib/actions/auth";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin/projects");
  } else {
    redirect("/login");
  }
}
