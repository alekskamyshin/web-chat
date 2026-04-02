import { useMessages } from "@/entities/messages/model/hooks/useMessages";
import { useMe } from "@/features/auth/model/hooks/useMe";
import MessageBubble from "./MessageBubble";

type ChatProps = {
	chatId: string;
	photoUrl?:string | null;
}

export default function Chat({chatId, photoUrl}: ChatProps) {
  const { data: messageData, isLoading: isMessagesLoading } = useMessages(chatId);
  const { data: me, isLoading: isMeLoading  } = useMe();

	if ( isMessagesLoading || isMeLoading ) {
		return (
			<span className="flex flex-1 flex-col w-full py-6 px-6 items-center justify-center">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
			</span>
		)
	}


	if (!me) {
		return (
			<span className="flex h-8 w-8 items-center justify-center">
				Loading data...
			</span>
		)
	}

	if (!messageData) {
		return (
			<span className="flex h-8 w-8 items-center justify-center">
				No messages yet... start typing!
			</span>
		)
	}

	const isMyMessage = (id: string) => me.user.id === id

	return (
      <div className="flex flex-1 flex-col w-full py-6 px-6 overflow-auto">
        <div className="flex flex-col gap-4">
				{ messageData.map( msg => {
					return (
						<MessageBubble key={msg.id} avatar={isMyMessage(msg.senderId) ?  me?.user.photoUrl : photoUrl} variant={isMyMessage(msg.senderId) ? 'send' : 'receive'} content={msg.content}/>
					)
				})}
        </div>
      </div>
	)

}
