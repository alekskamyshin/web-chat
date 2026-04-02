import { ReactNode } from "react";

type ModalProps = {
	children: ReactNode;
	isOpen: boolean;
	closeModal: () => void
}

export default function Modal({children, isOpen = false, closeModal}: ModalProps) {
	if ( !isOpen ) {
		return null
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-10 backdrop-blur-sm"
			onClick={closeModal}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
				onClick={(event) => event.stopPropagation()}
			>
				{ children }
			</div>
		</div>
	)

}
