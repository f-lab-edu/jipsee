import type { SVGProps } from "react";

/** 질문 한도 > 경고 아이콘 */
export default function LimitWarningIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M12 4l9 16H3z" />
			<path d="M12 10v4" />
			<path d="M12 17.5v.01" />
		</svg>
	);
}
