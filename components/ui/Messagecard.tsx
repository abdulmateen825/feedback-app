import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './button';
import { Message } from '@/model/User';
import { toast } from 'sonner';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Trash2, Clock, MessageCircle } from 'lucide-react';

type MessageCardProps = {
  message: Message;
  onmessagedelete: (id: string) => void;
};

const Messagecard = ({ message, onmessagedelete }: MessageCardProps) => {
  const handledelete = async () => {
    try {
      await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast.success('Message deleted successfully');
      onmessagedelete(message._id.toString());
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="group relative bg-white border border-purple-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{background: 'linear-gradient(90deg, oklch(0.52 0.22 290), oklch(0.45 0.25 315))'}} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-800 text-sm leading-relaxed break-words">{message.content}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">
                {new Date(message.createdAt).toLocaleString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl border-purple-100">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This message will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handledelete}
                className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Messagecard;