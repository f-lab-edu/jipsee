import type { SVGProps } from "react";

/** 채팅 > 건물 칩 아이콘 */
export default function BuildingChipIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M5 21V4h9v17" />
			<path d="M14 9h5v12" />
			<path d="M3 21h18" />
			<path d="M8 8h3M8 12h3M8 16h3" />
		</svg>
	);
}
