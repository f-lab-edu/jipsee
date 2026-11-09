import type { SVGProps } from "react";

/** 로그인 > 고지 정보 아이콘 */
export default function LoginInfoIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 11v5" />
			<path d="M12 8h.01" />
		</svg>
	);
}
