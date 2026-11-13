export type ChartAxis = {
	startYear: number;
	endYear: number;
	total: number;
	yMin: number;
	yMax: number;
	yLabels: [number, number, number];
	xTicks: { year: number; xPercent: number }[];
};
