// native-morse-trainer\utils\logToServer.ts
import axios from 'axios'
import { backendUrl } from '@/constants/constants'

export const logToServer = async (
  msg: string,
) => {
  try {
    console.log(msg);

    await axios.post(
      `${backendUrl}/api/log-from-front`,
      {
        data: msg,
      },
    );
  } catch (err) {
    console.log(err);
  }
};