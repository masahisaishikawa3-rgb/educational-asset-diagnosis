# 匿名診断結果保存の有効化

## 現在の状態

本番環境で有効化済み。診断専用Supabaseへ匿名診断結果を保存する。

## 保存するデータ

- 12問の回答値（1〜4）
- 4軸スコア、合計スコア、Level、診断Type
- 同点の副Type
- 参照元ホスト、形式を制限したUTM値
- アプリバージョン、保存日時、ランダムUUID

氏名、メールアドレス、会社名、自由記述、Cookie ID、GA4 Client ID、IPアドレスはテーブルへ保存しない。

## 有効化手順

1. コンテキストAI本番環境とは別に、診断専用Supabaseプロジェクトを作成する。
2. Supabase SQL Editorで `supabase/migrations/202608290001_create_diagnosis_results.sql` を実行する。
3. Netlifyの環境変数へ次を登録する。
   - `SUPABASE_URL`: 診断専用SupabaseのProject URL
   - `SUPABASE_SERVICE_ROLE_KEY`: 診断専用SupabaseのService Role Key（Secrets扱い）
   - `VITE_ANONYMOUS_STORAGE_ENABLED`: `true`
4. Netlifyで再デプロイする。
5. テスト診断を1件完了し、Supabaseの `diagnosis_results` に1行だけ追加されることを確認する。

## セキュリティと運用

- Service Role Keyはブラウザへ配信せず、Netlify Function内だけで利用する。
- `anon` と `authenticated` ロールにはテーブル権限を付与しない。
- Functionは許可オリジン、固定フィールド、回答範囲、スコア整合性を検証する。
- 保存失敗時も診断結果の表示を止めない。
- 診断画面に利用目的と保存期間を表示し、個人情報保護方針へリンクする。
- 生の匿名診断結果は原則24か月保持し、期限を過ぎた行を毎月自動削除する。
