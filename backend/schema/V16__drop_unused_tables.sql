alter table rent_deal drop foreign key fk_rent_deal_building_parcel;
alter table rent_deal drop check ck_rent_deal_match_status;
alter table rent_deal drop index idx_rent_deal_building_parcel_id_deal_date;
alter table rent_deal drop column building_parcel_id, drop column match_status;

alter table sale_deal drop foreign key fk_sale_deal_building_parcel;
alter table sale_deal drop check ck_sale_deal_match_status;
alter table sale_deal drop index idx_sale_deal_building_parcel_id_deal_date;
alter table sale_deal drop column building_parcel_id, drop column match_status;

drop table chat_message;
drop table chat;
drop table law_article;
drop table law;
drop table building_register;
drop table building_parcel;
drop table restricted_account;
drop table user;
