const APP = "(app|src/app)";

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "shared-no-upward",
			comment: "shared는 상위 레이어를 참조하지 않음",
			severity: "error",
			from: { path: "^src/shared/" },
			to: { path: `^(${APP}|src/(pages|widgets|features|entities))/` },
		},
		{
			name: "entities-no-upward",
			comment: "entities는 상위 레이어를 참조하지 않음",
			severity: "error",
			from: { path: "^src/entities/" },
			to: { path: `^(${APP}|src/(pages|widgets|features))/` },
		},
		{
			name: "features-no-upward",
			comment: "features는 상위 레이어를 참조하지 않음",
			severity: "error",
			from: { path: "^src/features/" },
			to: { path: `^(${APP}|src/(pages|widgets))/` },
		},
		{
			name: "widgets-no-upward",
			comment: "widgets는 상위 레이어를 참조하지 않음",
			severity: "error",
			from: { path: "^src/widgets/" },
			to: { path: `^(${APP}|src/pages)/` },
		},
		{
			name: "pages-no-upward",
			comment: "pages는 app을 참조하지 않음",
			severity: "error",
			from: { path: "^src/pages/" },
			to: { path: `^${APP}/` },
		},
		{
			name: "no-cross-slice",
			comment: "같은 레이어의 다른 슬라이스를 참조하지 않음",
			severity: "error",
			from: { path: "^src/(pages|widgets|features|entities)/([^/]+)/" },
			to: { path: "^src/$1/(?!$2/)[^/]+/" },
		},
		{
			name: "no-segments-on-sliced-layers",
			comment: "슬라이스가 오는 레이어 바로 아래에 세그먼트를 두지 않음",
			severity: "error",
			from: {},
			to: {
				path: "^src/(pages|widgets|features|entities)/(ui|api|model|lib|config)/",
			},
		},
		{
			name: "no-circular",
			comment: "순환 의존 금지",
			severity: "error",
			from: {},
			to: { circular: true },
		},
	],
	options: {
		doNotFollow: { path: "node_modules" },
		tsConfig: { fileName: "tsconfig.json" },
		tsPreCompilationDeps: true,
		enhancedResolveOptions: {
			exportsFields: ["exports"],
			conditionNames: ["import", "require", "node", "default", "types"],
			extensions: [".js", ".jsx", ".ts", ".tsx"],
		},
	},
};
