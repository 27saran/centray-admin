## プロジェクト概要

Centray管理画面のフロントエンド

## コマンド

### 初回セットアップ

```bash
npm install
または
yarn install
```

### 開発サーバー起動

```bash
npm run dev
または
yarn dev
```

開発サーバーは `http://localhost:3000`で起動

### ビルド

```bash
npm run build
または
yarn build
```

### Lint

```bash
npm run lint
# または
yarn lint
```

コードの静的解析の実行

### Lint (自動修正)

```bash
npm run lint:fix
# または
yarn lint:fix
```

自動修正可能な問題の修正

### コードフォーマット

```bash
npm run prettier
# または
yarn prettier
```

コード全体をフォーマット

### 機密情報チェック

```bash
npm run secretlint
# または
yarn secretlint
```

コード内に機密情報が含まれていないかチェック

## 主な使用ライブラリ

- **Next.js**: Reactベースのフルスタックフレームワーク
- **TypeScript**: JavaScriptに静的型付けを追加
- **Tailwind CSS**: CSSフレームワーク
- **shadcn/ui**: RadixUIとTailwindCSSをベースにした再利用可能なUIコンポーネント群
- **Lucide React**: アイコンライブラリ
- **React Hook Form**: フォーム管理ライブラリ
- **Zod**: バリデーションライブラリ
- **ESLint**: コードの静的解析ツール (品質維持、バグ発見)
- **Prettier**: コードフォーマッター
- **Secretlint**: 機密情報検出ツール
- **NextAuth**: 認証周り全般をやってくれる。セキュアなトークン管理など

## フォルダ構成

app配下のコンポーネントは基本的にサーバーコンポーネントにする。

hookなどのクライアントコンポーネントはcomponents配下に置いてサーバーコンポーネントから呼び出すようにする

page.tsx側でクライアントコンポーネントを使わない理由として、表示速度が速く、データ取得が楽で、セキュリティ的にも安全なので。（あとNext.jsがサーバーコンポーネントのページングを推奨してるから）

```
.
├── .next/                           # ビルド成果物(自動生成)
├── node_modules/                    # 依存ライブラリ(自動生成)
├── public/                          # 静的ファイル(画像、フォントなど)
├── src/                             # アプリケーションソースコード
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # ログインのサーバーコンポーネント
│   │   ├── api/                     # Next.js APIルート
│   │   │   ├── auth/                # NextAuth.js認証API
│   │   │   │   └── logout/          # ログアウトAPI（サーバー側セッション削除）
│   │   │   │       └── route.ts     # API Route
│   │   │   └── device-group/        # 端末グループ関連API
│   │   │       ├── route.ts         # グループ一覧・作成API
│   │   │       └── [id]/            # 個別グループAPI
│   │   │           └── route.ts     # グループ詳細・更新・削除API
│   │   ├── (private)/               # 認証が必要なページ群
│   │   │   ├── auth/                # 認証関連（UIなしの機能ディレクトリ）
│   │   │   │   └── fetch.ts         # クライアント用ログアウト関数（use client）
│   │   │   ├── device-group/        # 端末グループのサーバーコンポーネント
│   │   │   │   ├── page.tsx         # グループ一覧ページ
│   │   │   │   ├── fetch.ts         # 一覧用データ取得(Server Actions)
│   │   │   │   └── edit/            # グループ編集機能
│   │   │   │       └── [id]/        # 個別グループ編集
│   │   │   │           ├── page.tsx # 編集ページ
│   │   │   │           └── fetch.ts # 編集用データ取得(Server Actions)
│   │   │   └── session-management/  # セッション管理のサーバーコンポーネント
│   │   └── globals.css              # グローバルスタイル
│   ├── components/                  # UIコンポーネント
│   │   ├── login/                   # ログイン関連クライアントコンポーネント
│   │   ├── device-group/            # 端末グループ関連クライアントコンポーネント
│   │   │   ├── index-client.tsx     # グループ一覧クライアントコンポーネント
│   │   │   └── edit-client.tsx      # グループ編集クライアントコンポーネント
│   │   ├── session-management/      # セッション管理関連クライアントコンポーネント
│   │   └── ui/                      # shadcn/uiで生成されたコンポーネント（自動生成。基本いじらない）
│   ├── data/                        # jsonのモックデータ（繋ぎ込み後削除予定）
│   ├── hooks/                       # カスタムフック
│   ├── lib/                         # ユーティリティ関数など
│   │   └── api.ts                   # APIヘルパー関数（サーバー専用の共通化ロジック）
│   └── types/                       # TypeScriptの型定義
│       ├── device-group.ts          # 端末グループ関連の型
│       └── api.ts                   # API共通型（ApiCallOptions, AuthCheckResponseなど）
├── components.json                  # shadcn/uiの設定ファイル
├── next.config.ts                   # Next.jsの設定ファイル
├── package.json                     # プロジェクト情報、依存関係、スクリプト
├── postcss.config.*                 # PostCSSの設定ファイル
├── tailwind.config.ts               # TailwindCSSの設定ファイル
├── tsconfig.json                    # TypeScriptの設定ファイル
├── eslint.config.mjs                # ESLintの設定ファイル
├── .prettierrc.json                 # Prettierの設定ファイル
```

## ページ表示までの流れ

1. **page.tsx**
   サーバーコンポーネント。最初に呼ばれデータ取得関数（fetch.ts）を呼び出す

2. **fetch.ts**
   Server Actionsやデータ取得関数。lib/api.tsの共通ロジックを使ってAPIやDBからデータ取得

3. **lib/api.ts**
   認証付きAPI呼び出しや共通処理をまとめたユーティリティ

4. **components/hooks**
   クライアントコンポーネントやカスタムフック。page.tsxからpropsでデータを受け取り、UI描画や状態管理を行う
