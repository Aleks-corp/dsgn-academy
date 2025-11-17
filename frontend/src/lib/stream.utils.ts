import { fetchStreamData } from "./api/getStreamData";
import { IStream } from "@/types/stream.type";

const handlefetchStreamData = async (
  setStream: React.Dispatch<React.SetStateAction<IStream | null>>
) => {
  try {
    const res: { data: IStream; status: number } = await fetchStreamData();
    if (res.status === 200) {
      setStream(res.data);
    }
  } catch (error) {
    console.info(error);
  }
};
export default handlefetchStreamData;
