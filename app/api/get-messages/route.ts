import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({ success: false, message: 'not authenticated' });
  }

  const userid = new mongoose.Types.ObjectId(sessionUser._id);

  try {
    const result = await UserModel.aggregate([
      { $match: { _id: userid } },
      { $unwind: '$message' },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$message' } } },
    ]);

    if (!result || result.length === 0) {
      return Response.json({ success: true, messages: [] });
    }

    return Response.json({ success: true, messages: result[0].messages });
  } catch (error) {
    return Response.json({ success: false, message: 'error fetching messages' });
  }
}