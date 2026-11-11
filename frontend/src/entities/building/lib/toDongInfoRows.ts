import { dongInfoCopy } from "@/entities/building/config/dongInfoCopy";
import type { BuildingDong } from "@/entities/building/model/buildingDong";
import type { DongInfoRow } from "@/entities/building/model/dongInfoRow";

/**
 * 건물 > 동 정보 항목 변환
 *
 * - 사용승인, 세대수, 층수, 연면적, 구조, 기타용도는 값이 없거나 0이면 항목을 만들지 않음
 * - 내진설계는 적용 여부가 없을 때만 항목을 만들지 않음
 * - 승강기는 0이면 없음, 1 이상이면 대수를 출력하고, 값이 없으면 항목을 만들지 않음
 * - 주차 대수는 0이거나 없는 쪽을 문구에서 빼고, 둘 다 없으면 항목을 만들지 않음
 * - 주차 대수와 기타용도만 두 열을 차지함
 */
export function toDongInfoRows(dong: BuildingDong): DongInfoRow[] {
	const { labels, units } = dongInfoCopy;
	const rows: DongInfoRow[] = [];

	if (dong.useApprovalYear) {
		rows.push({
			label: labels.useApproval,
			value: `${dong.useApprovalYear}${units.year}`,
			spansTwoColumns: false,
		});
	}
	if (dong.householdCount) {
		rows.push({
			label: labels.household,
			value: `${dong.householdCount}${units.household}`,
			spansTwoColumns: false,
		});
	}
	if (dong.floorCount) {
		rows.push({
			label: labels.floor,
			value: `${dong.floorCount}${units.floor}`,
			spansTwoColumns: false,
		});
	}
	if (dong.totalFloorArea) {
		rows.push({
			label: labels.totalFloorArea,
			value: `${dong.totalFloorArea.toFixed(1)}${units.area}`,
			spansTwoColumns: false,
		});
	}
	if (dong.structureName) {
		rows.push({
			label: labels.structure,
			value: dong.structureName,
			spansTwoColumns: false,
		});
	}
	if (dong.earthquakeDesignApplied === true) {
		rows.push({
			label: labels.earthquakeDesign,
			value: dongInfoCopy.earthquakeDesignApplied,
			spansTwoColumns: false,
		});
	}
	if (dong.earthquakeDesignApplied === false) {
		rows.push({
			label: labels.earthquakeDesign,
			value: dongInfoCopy.earthquakeDesignNotApplied,
			spansTwoColumns: false,
		});
	}
	if (dong.elevatorCount === 0) {
		rows.push({
			label: labels.elevator,
			value: dongInfoCopy.noElevator,
			spansTwoColumns: false,
		});
	}
	if (dong.elevatorCount) {
		rows.push({
			label: labels.elevator,
			value: `${dong.elevatorCount}${units.count}`,
			spansTwoColumns: false,
		});
	}

	const parking: string[] = [];
	if (dong.selfPropelledParkingIndoorCount) {
		parking.push(
			`${dongInfoCopy.parkingIndoor} ${dong.selfPropelledParkingIndoorCount}${units.count}`,
		);
	}
	if (dong.selfPropelledParkingOutdoorCount) {
		parking.push(
			`${dongInfoCopy.parkingOutdoor} ${dong.selfPropelledParkingOutdoorCount}${units.count}`,
		);
	}
	if (parking.length > 0) {
		rows.push({
			label: labels.parking,
			value: `${dongInfoCopy.parkingType} ${parking.join(dongInfoCopy.parkingSeparator)}`,
			spansTwoColumns: true,
		});
	}

	if (dong.etcPurpose) {
		rows.push({
			label: labels.etcPurpose,
			value: dong.etcPurpose,
			spansTwoColumns: true,
		});
	}

	return rows;
}
