import type { SVGProps } from "react";

/** 헤더 > 뒤로 가기 왼쪽 화살표 아이콘 */
export default function HeaderBackIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M15 6l-6 6 6 6" />
		</svg>
	);
}
