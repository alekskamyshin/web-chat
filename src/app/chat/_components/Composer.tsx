import { useMe } from "@/features/auth/model/hooks/useMe";
import { useSendMessage } from "@/features/socket/hooks/useSendMessage";
import Button from "@/shared/ui/components/Button/Button";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type ComposerProps = {
	chatId: string;
}

const EnterKey = 'Enter' as const

export default function Composer({ chatId }: ComposerProps ) {
	const [msg, setMsg] = useState<string>()
	const MAX_HEIGHT = 250
	const textAreaWrapperRef = useRef<HTMLTextAreaElement>(null)
	const { data: userData } = useMe()
  const sendMessage = useSendMessage();

	const resize = () => {
		const textarea = textAreaWrapperRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT)
    textarea.style.height = `${newHeight}px`

    // Scroll only the wrapper once it's capped
    textarea.classList.toggle('overflow-y-auto', textarea.scrollHeight > MAX_HEIGHT)
    //wrapper.classList.toggle('overflow-y-auto', isOverflow)
	}

	const onChangeHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
		const value = e.currentTarget.value
		setMsg(value)

		resize()
	}

	const onKeyDownHandler = (e: KeyboardEvent ) => {
		if (e.key === EnterKey && !e.shiftKey ) {
			handleSend()
		}
	}

	const handleSend = async () => {
		const content = msg?.trim()

    const senderId = userData?.user?.id;

    if (!content || !senderId || sendMessage.isPending) {
      return;
    }

    try {
      await sendMessage.mutateAsync({ chatId, content, senderId });
    } catch(err) {
			console.log('error sending', err)
		} finally {
			setMsg('')
		}
	}

	useEffect( () => {
		resize()
	}, [])

	return (
      <div className="min-h-20 border-t overflow-hidden border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <div
					className={`flex-1 rounded-2xl border border-border bg-elevated px-4 py-3 text-sm text-text-secondary max-h-[${MAX_HEIGHT}px]`}>
					<textarea 
						className={`w-full active:border-none focus:border-none focus-visible:border-none focus-visible:outline-none resize-none h-full max-h-[${MAX_HEIGHT}px]`}
						ref={textAreaWrapperRef}
						onKeyDown={e => onKeyDownHandler(e)}
						value={msg} 
						aria-multiline
						onChange={e => onChangeHandler(e)} 
					/>
          </div>
          <Button
            type="button"
						variant='primary'
						onClick={handleSend}
						size='icon'
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M4 12l16-7-4 7 4 7-16-7z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>
      </div>
	)
}
