import { z } from 'zod';
import UserModel from '@/model/User';
import { dbConnect } from '@/lib/dbConnect';
import { signupSchema } from '@/schemas/signupschema';

const UsernameQuerySchema = z.object({
  username: signupSchema.shape.username,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get('username') };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'invalid username',
      });
    }

    const { username } = result.data;
    const existingverifieduser = await UserModel.findOne({ username, isverified: true });

    if (existingverifieduser) {
      return Response.json({ success: false, message: 'username already taken' });
    }

    return Response.json({ success: true, message: 'username is available' });
  } catch (error) {
    console.error('error checking username');
    return Response.json({ success: false, message: 'error checking username' });
  }
}