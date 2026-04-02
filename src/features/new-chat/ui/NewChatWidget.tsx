import { useEffect, useState } from "react";

import { useCreateDirectChat } from "@/entities/chat/model/hooks/useChats";
import { useSearchUsers } from "@/entities/users/hooks/useSearchUsers";
import Modal from "@/shared/ui/components/Modal/Modal";

type NewChatWidgetProps = {
	isOpen: boolean;
	toggle: () => void
}

export default function NewChatWidget({ isOpen, toggle }: NewChatWidgetProps) {
	const [query, setQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');
	const { data: users = [], isFetching, isError, refetch } = useSearchUsers(debouncedQuery);
	const createChat = useCreateDirectChat();
	const [createError, setCreateError] = useState<string | null>(null);


	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedQuery(query.trim());
		}, 350);

		return () => clearTimeout(timeout);
	}, [query]);

	const handleSelectUser = async (userId: string) => {
		try {
			setCreateError(null);
			await createChat.mutateAsync({ otherUserId: userId });
		} catch (error) {
			setCreateError(error instanceof Error ? error.message : 'Unable to create chat.');
		}
	};

	const showEmpty = !isFetching && !isError && users.length === 0 && query.length === 0;
	const showNoResults =
		!isFetching && !isError && users.length === 0 && query.length > 0;
	const errorMessage = createError || (isError ? 'Unable to load users.' : null);

	if ( !isOpen ) {
		return null
	}

	return (
		<Modal isOpen closeModal={toggle}>
			<div>
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-lg font-semibold text-text-primary">
							Start a new chat
						</p>
						<p className="text-sm text-text-secondary">
							Search for someone by name.
						</p>
					</div>
					<button
						type="button"
						onClick={toggle}
						aria-label="Close"
						className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-elevated text-text-secondary transition hover:text-text-primary"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
							<path
								d="M6 6l12 12M18 6l-12 12"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				<div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-elevated px-4 py-3">
					<svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-text-secondary">
						<path
							d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35"
							stroke="currentColor"
							strokeWidth="1.6"
							strokeLinecap="round"
						/>
					</svg>
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search users"
						className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
					/>
				</div>

				<div className="mt-4 max-h-[320px] min-h-32 overflow-y-auto">
					{errorMessage ? (
						<div className="rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-xs text-error">
							{errorMessage}
						</div>
					) : null}

					{isFetching ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, index) => (
								<div
									key={`new-chat-skeleton-${index}`}
									className="h-12 w-full animate-pulse rounded-2xl bg-elevated"
								/>
							))}
						</div>
					) : null}

					{showEmpty ? (
						<div className="py-10 text-center text-sm text-text-secondary">
							Search for a user to start a chat.
						</div>
					) : null}

					{showNoResults ? (
						<div className="py-10 text-center text-sm text-text-secondary">
							No users found.
						</div>
					) : null}

					{!isFetching && !isError && users.length > 0 ? (
						<ul className="space-y-2">
							{users.map((user) => {
								const photoUrl =
									typeof user.photoUrl === 'string'
										? user.photoUrl
										: (user.photoUrl as { url?: string } | null)?.url ?? null;

								return (
									<li key={user.id}>
										<button
											type="button"
											onClick={() => handleSelectUser(user.id)}
											className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-elevated"
										>
											<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-elevated">
												{photoUrl ? (
													<img
														src={photoUrl}
														alt={user.displayName}
														className="h-full w-full object-cover"
													/>
												) : (
													<span className="text-xs font-semibold text-text-secondary">
														{user.displayName.slice(0, 1).toUpperCase()}
													</span>
												)}
											</div>
											<div>
												<p className="text-sm font-semibold text-text-primary">
													{user.displayName}
												</p>
											</div>
										</button>
									</li>
								);
							})}
						</ul>
					) : null}
				</div>
			</div>
		</Modal>
	)
}
