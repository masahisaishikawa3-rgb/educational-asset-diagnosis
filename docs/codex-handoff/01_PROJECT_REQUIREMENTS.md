# 教育資産化診断｜プロジェクト要件（Codex引き渡し）

## 文書情報

- 参照元:
  - `docs/EDUCATIONAL_ASSET_DIAGNOSIS_SPEC_v0.1.md`
  - `docs/EDUCATIONAL_ASSET_DIAGNOSIS_UI_DESIGN_v0.1.md`
- 参照元バージョン: v0.1
- 本書の目的: 実装の目的、体験、スコープ、優先順位を伝える
- 注意: 本書は参照元を再構成したものであり、新しい仕様を追加しない

## 確定事項

### 位置づけと目的

- 本診断は市場形成ファネルの「④ 概念獲得 → ⑤ 自社化 → ⑥ 解決理解」を担う。
- UI/UXでは「どの情報を、どの順番で、どの強さで見せるか」を固定する。
- ユーザーに「診断される」より「自社の現在地を整理する」感覚を与える。
- 診断完了まで個人情報を入力させない。
- 結果を提示してから製品導線を置く。
- 総合点より「現在地」「最大ボトルネック」「次の一歩」を優先する。
- 診断中にコンテキストAIの機能説明を出さない。
- コンテキストAI本体に組み込まず、マーケティング用の独立Webアプリとして構築する。
- 想定ユーザーは人事／人材開発、研修担当、教育企画担当、管理部門、現場教育責任者、中小〜中堅企業の経営者。コンテキストAIを知らないユーザーも含む。

### v0.1でやらないこと

- ログイン／アカウント登録
- LLMによる自由記述診断
- PDF／Word／PowerPointアップロード
- CRM連携
- メール配信自動化
- 複雑なAIレコメンド
- コンテキストAI本体DBとの接続
- 診断結果を有料契約に直接結びつける処理

### 全体体験

1. ブログ、教育資産化とは、SNS、PR、セミナー等から流入
2. Landingで診断の意味を理解
3. 12問に回答（目安約3分）
4. 結果Heroで教育資産化Levelを確認
5. 4軸と最大ボトルネックを確認
6. 最初に取り組む3つを確認
7. 診断結果に合う推奨記事を確認
8. 「自社資料で試す」または「教育資産化を詳しく読む」へ進む

### 実装優先順位

#### Must

- Landing
- 12 Question flow
- Progress
- Score calculation
- Level
- Type
- 4-axis bars
- Prescription
- Recommendation cards
- CTA
- Responsive
- Config separation

#### Should

- sessionStorage
- GA4 hooks
- 控えめなanimation
- anonymous result save abstraction

#### Later

- PDF result
- Email
- Benchmark
- Company size / industry
- CRM
- LLM diagnosis

## 未決事項

- ブランド名「ADOP CONTEXT / 教育資産化ラボ」の正式な表示規則やブランドアセットは不明。
- 対象ブラウザ、公開日程は不明。
- サブコピーは候補扱い。
- Level閾値は初期仮説で、公開前後の分布を見て調整可能にする。
- 匿名結果保存を実際に有効化するかは未決。
- 推奨記事URL、Primary CTAの正式導線、サブドメインは未決。

## 変更禁止事項

- 未決事項を推測で確定しない。
- 低スコアを赤で表現しない。
- 結果より前に製品訴求を強く出さない。
- 診断の価値提供よりCTAを先に置かない。
- Later項目をv0.1必須範囲に繰り上げない。
