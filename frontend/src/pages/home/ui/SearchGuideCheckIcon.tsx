import type { SVGProps } from "react";

/** 홈 > 검색 안내 체크 아이콘 */
export default function SearchGuideCheckIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M5 12l4 4 10-10" />
		</svg>
	);
}
