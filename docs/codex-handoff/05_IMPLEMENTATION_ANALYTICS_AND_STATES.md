# 教育資産化診断｜実装・状態・計測要件（Codex引き渡し）

## 文書情報

- 参照元:
  - `docs/EDUCATIONAL_ASSET_DIAGNOSIS_SPEC_v0.1.md` の12〜18章
  - `docs/EDUCATIONAL_ASSET_DIAGNOSIS_UI_DESIGN_v0.1.md` の12〜15章

## 確定事項

### Routing案

参照元に示された案:

```text
/            Landing
/diagnosis   Question flow
/result      Result
```

これは「案」と明記されているため、URL自体は未決事項として扱う。

### 最低限必要な状態

- Landing
  - default
- Question
  - unanswered
  - answered
  - previous answer restored
- Result
  - calculated
  - recommendation links available
  - primary CTA unavailable（遷移先未確定時の開発用）
- Error
  - diagnosis config load error
  - result calculation error
  - analytics error
  - DB保存エラー

### エラー方針

- v0.1はfail-open。
- analytics errorで画面を止めない。
- DB保存エラーで結果表示を止めない。
- GA4や匿名保存の失敗で診断結果の表示を妨げない。

### 回答状態の保持

- リロード時に結果が消える問題を避ける必要がある。
- URLにスコアを露出しない。
- DB保存を結果表示の前提にしない。
- sessionStorageはv0.1候補であり、実装優先順位ではShould。

### GA4イベント

- `diagnosis_view`
- `diagnosis_start`
- `diagnosis_answer`（`question_id` / `answer_score`）
- `diagnosis_complete`（`level` / `diagnosis_type` / `total_score`）
- `diagnosis_recommendation_click`（`diagnosis_type` / `article_url`）
- `diagnosis_primary_cta_click`（`level` / `diagnosis_type`）
- `diagnosis_secondary_cta_click`

想定される流れ:

```text
Landing View
  → diagnosis_start
Q1 ... Q12
  → diagnosis_complete
Result Hero
  → scroll
Diagnosis Detail
  → Prescription
  → diagnosis_recommendation_click
Recommended Content
  → diagnosis_primary_cta_click
1資料デモ / Context AI
```

### その他の実装要件

- 診断データ・判定・表示コンテンツをConfigとして画面から分離する（Must）。
- 匿名結果保存は抽象化しておく（Should）。
- GA4 hooksを設ける（Should）。
- Recommendationカードの記事クリックをGA4で計測する。

### 匿名保存データ構造

保存を有効化する場合も個人情報は保存しない。保存項目:

- `id`, `created_at`, `answers` JSON
- `score_a`, `score_b`, `score_c`, `score_d`, `total_score`
- `level`, `diagnosis_type`, `secondary_weak_type` nullable
- `referrer` nullable
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` nullable
- `app_version`

企業規模・業種を追加する場合は12問と分離し、結果表示後の任意回答を推奨する。

### 技術構成・セキュリティ

- コンテキストAI本体とは別リポジトリ／別デプロイ。
- Repo: `educational-asset-diagnosis`
- Hosting: Netlify
- Frontend: Bolt.newで生成、React + TypeScript推奨
- DB: 保存する場合は診断専用Supabase
- Analytics: GA4
- Domain: サブドメイン推奨
- コンテキストAI本番Supabaseへ接続しない。
- Service Role Keyをフロントに置かない。
- 匿名insertは専用テーブル・最小権限とする。
- 自由記述欄を持たない。
- 個人情報を診断回答と一緒に保存しない。

### 主要KPI

1. Landing → Start率
2. Start → Complete率
3. 平均完了時間
4. Level分布
5. Type分布
6. 推奨記事CTR
7. Primary CTA CTR

リード獲得率をv0.1の最上位KPIにしない。

## 未決事項

- Routing案を採用するか、別ルートにするか。
- 回答stateの正式な保持方法。
- Resultへの直接アクセス、戻る、リロード時の具体的挙動。
- GA4測定ID、追加イベントパラメータ、同意管理、プライバシー要件。
- scrollをイベント化するか。
- 匿名保存を有効化するか。有効化する場合の保持期間、再試行方法。
- config load error／result calculation error時のユーザー向け文言と復旧導線。
- Primary CTA遷移先未確定時に、非表示／disabled／代替表示のどれを採るか。
- React + TypeScriptは推奨であり確定指定ではない。テスト基盤は未決。
- サブドメイン候補は `diagnosis.adop-context.jp` と `check.adop-context.jp` で、正式決定していない。
