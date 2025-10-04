import CoursePage from "@/components/courses/CoursePage";
import { getSeoMetadata } from "@/lib/page.metadata";
import { PageProps } from "@/types/param.type";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return getSeoMetadata("course", id);
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CoursePage id={id} />;
}
