import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";

export const nearbyFilterLabels = {
	groups: {
		period: "기간",
		type: "유형",
	},
	options: {
		period: { 6: "6개월", 12: "12개월", 24: "24개월" },
		type: { jeonse: "전세", wolse: "월세" },
	},
} as const satisfies {
	groups: Record<keyof NearbyDealsCondition, string>;
	options: {
		[Name in keyof NearbyDealsCondition]: Record<
			NearbyDealsCondition[Name],
			string
		>;
	};
};
