import type { SVGProps } from "react";

/** 챗봇 > 말풍선 아이콘 */
export default function ChatBubbleIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M4 5h16v11H9l-5 4z" />
		</svg>
	);
}
