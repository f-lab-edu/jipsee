import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// 출처 한 줄과 기준일 줄. 기준일 줄이 없으면 null
export type ChatSource = {
	label: string;
	baseLabel: Nullable<string>;
};
