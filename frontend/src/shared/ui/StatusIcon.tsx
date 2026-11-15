import type { SVGProps } from "react";
import { statusIconPaths } from "@/shared/config/statusIconPaths";
import type { StatusKind } from "@/shared/model/statusKind";

interface StatusIconProps extends SVGProps<SVGSVGElement> {
	kind: StatusKind;
}

/** 공통 > 상태 아이콘 */
export default function StatusIcon({ kind, ...props }: StatusIconProps) {
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
			{statusIconPaths[kind].map((path) => (
				<path key={path} d={path} />
			))}
		</svg>
	);
}
