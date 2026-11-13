/** 거래 한 행의 기대값. kind는 jeonse, wolse, sale 중 하나임 */
export type DealExpectation = {
	date: string;
	type: string;
	kind: string;
	cancelled?: boolean;
	similar?: boolean;
	area: string;
	amount: string;
};
