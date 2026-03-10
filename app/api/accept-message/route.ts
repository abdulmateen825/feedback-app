import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({ success: false, message: 'not authenticated' });
  }

  const userid = user._id;
  const { acceptmessages } = await request.json();

  try {
    const updateduser = await UserModel.findByIdAndUpdate(
      userid,
      { isacceptingmessage: acceptmessages },
      { new: true }
    );

    if (!updateduser) {
      return Response.json({ success: false, message: 'failed to update user' });
    }

    return Response.json({
      success: true,
      message: 'message acceptance status updated successfully',
      isacceptingmessage: updateduser.isacceptingmessage,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'failed to update user status for message acceptance',
    });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({ success: false, message: 'not authenticated' });
  }

  const userid = user._id;

  try {
    const founduser = await UserModel.findById(userid);

    if (!founduser) {
      return Response.json({ success: false, message: 'user not found' });
    }

    return Response.json({
      success: true,
      isacceptingmessage: founduser.isacceptingmessage,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: 'Error fetching user acceptance status',
    });
  }
}