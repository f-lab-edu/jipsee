import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";

// GET /buildings/{id}/nearby-deals 응답의 data 필드. 화면 모델과 구조가 같음
export type NearbyDealsResponse = NearbyDealsResult;
