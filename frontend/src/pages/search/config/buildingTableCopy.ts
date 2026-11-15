import { buildingTableRowCopy } from "@/entities/building/config/buildingTableRowCopy";
import { dongInfoCopy } from "@/entities/building/config/dongInfoCopy";

export const buildingTableCopy = {
	label: "검색 결과",
	building: "건물",
	useApproval: dongInfoCopy.labels.useApproval,
	latestNewJeonse: "최근 신규 전세",
	detail: buildingTableRowCopy.detail,
} as const;
