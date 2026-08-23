# 教育資産化診断

12問・約3分で、教育資産化の現在地、最大ボトルネック、次に取り組むことを確認する独立Webアプリです。

## 開発

```bash
npm install
npm run dev
```

## 確認

```bash
npm test
npm run build
```

## 仕様

- 元仕様: `docs/EDUCATIONAL_ASSET_DIAGNOSIS_SPEC_v0.1.md`
- UI設計: `docs/EDUCATIONAL_ASSET_DIAGNOSIS_UI_DESIGN_v0.1.md`
- Codex引き渡し資料: `docs/codex-handoff/`

未確定の推奨記事URL、CTA URL、GA4測定ID、匿名保存は接続していません。診断設定は `src/config/diagnosis.ts` から変更できます。
