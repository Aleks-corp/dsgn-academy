import VideoPage from "@/components/videos/VideoPage";
import { getSeoMetadata } from "@/lib/page.metadata";
import { PageProps } from "@/types/param.type";

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return getSeoMetadata("video", id);
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <VideoPage id={id} />;
}
