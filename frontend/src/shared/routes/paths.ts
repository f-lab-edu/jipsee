export const paths = {
	home: "/",
	search: "/search",
	login: "/login",
	me: "/me",
	dataSources: "/policies/data-sources",
	terms: "/policies/terms",
	privacy: "/policies/privacy",
	building: (id: number) => `/buildings/${id}`,
} as const;
