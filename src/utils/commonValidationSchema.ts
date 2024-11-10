import yup from "@/lib/yup";
//import { DISTRIBUTION_USER_CONDITION } from "@/constants/presentBox";

// 画面単位のバリデーション全般をまとめる
//const stringValidation = yup.string().max(255);
const requiredStringValidation = yup.string().max(255).required();
//const integerValidation = yup
//  .number()
//  .typeError("整数で入力してください")
//  .positive("正の数で入力してください")
//  .integer("整数で入力してください");

const requiredPositiveNumberValidation = yup
  .number()
  .typeError("整数で入力してください")
  .positive("正の数で入力してください")
  .required();

const booleanValidation = yup
  .boolean()
  .typeError("選択してください")

const requiredIntegerValidation = yup
  .number()
  .typeError("整数で入力してください")
  .integer("整数で入力してください")
  .required();

//const requiredIntegerMax365DaysValidation = yup
//  .number()
//  .typeError("整数で入力してください")
//  .integer("整数で入力してください")
//  .max(365, "365以下の値を入力してください")
//  .required("この項目は必須です");

// 現在の日付を取得し、時間部分をリセットする（入力している当日を選択できなくなるため）
const today = new Date();
today.setHours(0, 0, 0, 0);
const requiredFutureDateValidation = yup
  .date()
  .typeError("正しい日付を入力してください")
  .min(today, "過去の日付は選択できません")
  .required();

const requiredDateValidation = yup
  .date()
  .typeError("正しい日付を入力してください")
  .required();

const requiredVersionValidation = yup
  .string()
  .matches(/^\d+\.\d+\.\d+$/, "バージョンはx.x.xの形式で入力してください")
  .required();

//const basePresendBoxSchema = {
//  name: requiredStringValidation,
//  description: requiredStringValidation,
//  distribution_user: requiredIntegerValidation,
//  distribute_at: requiredFutureDateValidation,
//  itemable_1_type: requiredStringValidation,
//  itemable_1_id: requiredIntegerValidation,
//  itemable_1_quantity: requiredIntegerValidation,
//  itemable_2_type: stringValidation,
//  itemable_2_id: integerValidation,
//  itemable_2_quantity: integerValidation,
//  itemable_3_type: stringValidation,
//  itemable_3_id: integerValidation,
//  itemable_3_quantity: integerValidation,
//  itemable_4_type: stringValidation,
//  itemable_4_id: integerValidation,
//  itemable_4_quantity: integerValidation,
//  expiry_date: requiredIntegerMax365DaysValidation,
//};

export const commonValidationSchema = {
  login: {
    email: yup.string().email().max(255).required(),
    password: yup
      .string()
      .matches(/(?=.*[a-z])/, "英字を含めてください。")
      .matches(/(?=.*[0-9])/, "数字を含めてください。")
      .min(8)
      .required(),
  },
  push_notification: {
    title: requiredStringValidation,
    body: requiredStringValidation,
    is_immediate: booleanValidation,
    transmit_date_at: requiredDateValidation,
    transmit_time_at: requiredStringValidation,
  },
  //present_box: {
  //  base: {...basePresendBoxSchema},
  //  [DISTRIBUTION_USER_CONDITION.existing_users]: {
  //    ...basePresendBoxSchema
  //  },
  //  [DISTRIBUTION_USER_CONDITION.set_user_ids]: {
  //    ...basePresendBoxSchema
  //  },
  //  [DISTRIBUTION_USER_CONDITION.all_users_in_period]: {
  //    ...basePresendBoxSchema,
  //    distribute_end_date: requiredFutureDateValidation
  //  },
  //  [DISTRIBUTION_USER_CONDITION.all_login_users_in_period]: {
  //    ...basePresendBoxSchema,
  //    distribute_end_date: requiredFutureDateValidation
  //  }
  //},

  area_fragment: {
    area_label: requiredStringValidation,
    area_latitude: requiredPositiveNumberValidation,
    area_longitude: requiredPositiveNumberValidation,
    area_start_at: requiredDateValidation,
    area_end_at: requiredDateValidation,
    area_fragment_challenge_num: requiredIntegerValidation,
    area_reward_quantity: requiredIntegerValidation,
    area_reward_monster_id: requiredIntegerValidation,
    area_reward_itemable_id: requiredIntegerValidation,
    area_reward_itemable_type: requiredStringValidation,
    area_localized_description: requiredStringValidation,
    area_localized_language_code: requiredStringValidation,
    place_latitude: requiredPositiveNumberValidation,
    place_longitude: requiredPositiveNumberValidation,
    place_localized_name: requiredStringValidation,
    xr_city_asset_relation_xr_city_content_id: requiredStringValidation,
  },
  app_version: {
    ios_app_ver: requiredVersionValidation,
    android_app_ver: requiredVersionValidation,
    master_ver: requiredIntegerValidation,
    asset_ver: requiredIntegerValidation,
  },
  maintenance: {
    start_at: requiredDateValidation,
    end_at: requiredFutureDateValidation,
    description: requiredStringValidation,
  },
};
