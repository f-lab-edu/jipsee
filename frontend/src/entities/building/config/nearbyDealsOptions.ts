import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";

const defaultCondition: NearbyDealsCondition = {
	radius: 500,
	period: 12,
	type: "jeonse",
};

export const nearbyDealsOptions = {
	radii: [300, 500, 1000],
	periods: [6, 12, 24],
	types: ["jeonse", "wolse"],
	defaultCondition,
	// 이 건수보다 적으면 조건 확장 안내를 보여 줌
	noticeCountThreshold: 3,
} as const;
