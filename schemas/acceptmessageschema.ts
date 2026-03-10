import { z } from 'zod';

export const acceptmessageschema = z.object({
  acceptmessage: z.boolean(),
});