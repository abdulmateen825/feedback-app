import {z} from 'zod'

export const messageschema = z.object({
       content : z. string()
                  .min(10,"message must be 10 charcters long")
                  .max(300,"message must not exceed 300 characters")


})