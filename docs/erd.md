# Jipsee ERD

## user

> 사용자 정보

```mermaid
erDiagram
    user {
        bigint id PK "사용자 ID, 자동 증가"
        varchar provider UK "로그인 수단: GOOGLE, KAKAO, NAVER"
        varchar provider_user_id UK "로그인 수단이 발급한 사용자 고유 ID"
        timestamp created_at "가입 시각"
    }
```

- UNIQUE(provider, provider_user_id): 로그인 수단별 별도 계정
- 탈퇴 시 행 삭제 (하드 삭제)

## building_parcel

> 필지

```mermaid
erDiagram
    building_parcel {
        bigint id PK "필지 ID, 자체 발급"
        varchar name "건물명 bldNm, 없으면 NULL"
        char sigungu_cd UK "시군구코드 5자리 (sigunguCd)"
        char bjdong_cd UK "법정동코드 뒤 5자리 (bjdongCd)"
        char plat_gb_cd UK "대지구분, 대지:0, 산:1, 블록:2 (platGbCd)"
        char bun UK "지번의 번, 4자리 0 채움, 없으면 0000"
        char ji UK "지번의 지, 4자리, 없으면 0000"
    }
```

- UNIQUE(sigungu_cd, bjdong_cd, plat_gb_cd, bun, ji): 필지 식별을 위한 유니크 제약조건
- 예: 서울 종로구 부암동 208-13 = `11110`, `18400`, `0`, `0208`, `0013`

## building_register

> 건축물대장 표제부 동

```mermaid
erDiagram
    building_parcel ||--o{ building_register : "필지 1개에 동 N개"
    building_register {
        bigint id PK "동 ID, 자동 증가"
        bigint building_parcel_id FK "필지 ID"
        varchar mgmt_bldrgst_pk "관리건축물대장PK (mgmBldrgstPk)"
        varchar plat_plc "지번주소 (platPlc)"
        varchar new_plat_plc "도로명주소 (newPlatPlc), 없으면 NULL"
        varchar name "건물명 (bldNm), 없으면 NULL"
        varchar dong_nm "동 명칭 (dongNm), 없으면 NULL"
        char main_atch_gb_cd "주부속구분, 주건축물:0, 부속건축물:1 (mainAtchGbCd)"
        char use_apr_day "사용승인일 YYYYMMDD 원본 그대로 (useAprDay), 없으면 NULL"
        int hhld_cnt "세대 수 (hhldCnt)"
        int grnd_flr_cnt "지상 층수 (grndFlrCnt)"
        int ugrnd_flr_cnt "지하 층수 (ugrndFlrCnt)"
        int ride_use_elvt_cnt "승용 승강기 수 (rideUseElvtCnt)"
        varchar strct_cd_nm "구조 코드명 (strctCdNm)"
        char rserthqk_dsgn_apply_yn "내진설계 적용 여부, 미적용:0, 적용:1 (rserthqkDsgnApplyYn), 없으면 NULL"
        decimal tot_area "연면적 ㎡ (totArea)"
        varchar etc_purps "기타용도 (etcPurps), 없으면 NULL"
        int indr_mech_utcnt "옥내 기계식 주차 대수 (indrMechUtcnt)"
        int oudr_mech_utcnt "옥외 기계식 주차 대수 (oudrMechUtcnt)"
        int indr_auto_utcnt "옥내 자주식 주차 대수 (indrAutoUtcnt)"
        int oudr_auto_utcnt "옥외 자주식 주차 대수 (oudrAutoUtcnt)"
    }
```

- 필지 1개(building_parcel)에 동 N개(building_register): 1:N, 동은 원본 그대로 나열
- FULLTEXT(name, plat_plc, new_plat_plc) ngram: 건물명, 지번주소, 도로명주소 통합 검색
- 원본이 0인 수치 필드는 0으로 저장, 화면에서 숨김 (승강기는 0이면 "없음" 표시)
