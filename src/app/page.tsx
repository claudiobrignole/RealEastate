import { redirect } from "next/navigation";
import { isAiStudio } from "@/lib/is-ai-studio";

export default async function Home() {
  const isDev = await isAiStudio();
  if (isDev) {
    redirect("/admin/projects");
  } else {
    redirect("/login");
  }
}
