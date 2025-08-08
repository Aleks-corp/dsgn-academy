import axios, { AxiosError } from "axios";
import "dotenv/config";

const PING_INTERVAL = 13 * 60 * 1000;

const { FRONT_SERVER, BASE_URL } = process.env;

export function startRenderPing(): void {
  setInterval(async () => {
    try {
      await axios.get(FRONT_SERVER + "/command");
      console.info(`[PING] Frontend OK: ${FRONT_SERVER}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`[PING] Frontend FAILED: ${FRONT_SERVER}`, error.message);
      }
    }
    try {
      await axios.get(BASE_URL + "/ping");
      console.info(`[PING] Backend OK: ${BASE_URL}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(`[PING] Backend FAILED: ${BASE_URL}`, error.message);
      }
    }
  }, PING_INTERVAL);
}
