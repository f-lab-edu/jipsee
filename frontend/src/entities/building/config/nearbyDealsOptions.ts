import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";

const defaultCondition: NearbyDealsCondition = {
	period: 12,
	type: "jeonse",
};

export const nearbyDealsOptions = {
	periods: [6, 12, 24],
	types: ["jeonse", "wolse"],
	defaultCondition,
	// 이 건수보다 적으면 조건 확장 안내를 보여 줌
	noticeCountThreshold: 3,
} as const;
