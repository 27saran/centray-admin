import * as yup from "yup";

// 共通バリデーションのローカライズ
yup.setLocale({
  mixed: {
    default: "入力エラーです",
    required: "入力必須です",
  },
  string: {
    email: "有効なメールアドレスを入力してください",
    min: ({ min }) => `${min}文字以上入力してください`,
    max: ({ max }) => `${max}文字以内で入力してください`,
  },
  number: {
    min: ({ min }) => `${min}以上の値を入力してください`,
    max: ({ max }) => `${max}以下の値を入力してください`,
    positive: "正の数を入力してください",
    negative: "負の数を入力してください",
    integer: "整数を入力してください",
  },
  array: {
    min: ({ min }) => `${min}以上入力してください`,
    max: ({ max }) => `${max}以下入力してください`,
  },
});

export default yup;
