import type { SVGProps } from "react";

/** 건물 > 목록 오른쪽 화살표 아이콘 */
export default function BuildingChevronIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M9 6l6 6-6 6" />
		</svg>
	);
}
