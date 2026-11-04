import type { SVGProps } from "react";

/** 검색 > 결과 없음 돋보기 아이콘 */
export default function NoResultIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<circle cx="11" cy="11" r="7" />
			<path d="M20 20l-3.5-3.5" />
			<path d="M8.5 11h5" />
		</svg>
	);
}
