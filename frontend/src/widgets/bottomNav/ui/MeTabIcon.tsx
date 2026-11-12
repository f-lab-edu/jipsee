import type { SVGProps } from "react";

/** 하단 내비게이션 > 내 정보 아이콘 */
export default function MeTabIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
		</svg>
	);
}
