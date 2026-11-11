import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type BuildingDong = {
	name: Nullable<string>;
	useApprovalYear: Nullable<number>;
	householdCount: Nullable<number>;
	// 지상 층수
	floorCount: Nullable<number>;
	totalFloorArea: Nullable<number>;
	structureName: Nullable<string>;
	earthquakeDesignApplied: Nullable<boolean>;
	elevatorCount: Nullable<number>;
	selfPropelledParkingIndoorCount: Nullable<number>;
	selfPropelledParkingOutdoorCount: Nullable<number>;
	etcPurpose: Nullable<string>;
};
