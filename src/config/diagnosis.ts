import type { Axis, DiagnosisType, Level, Question } from '../types'

export const axisLabels: Record<Axis, string> = {
  A: '知識の体系化',
  B: '教材化',
  C: '運用・活用',
  D: '測定・改善',
}

const options = (...labels: string[]) =>
  labels.map((label, index) => ({ label, score: (index + 1) as 1 | 2 | 3 | 4 }))

export const questions: Question[] = [
  {
    id: 'Q1', axis: 'A', prompt: '従業員に「何を身につけてもらう必要があるか」が整理されていますか？',
    options: options('ほとんど整理されていない', '部分的には整理されている', '主な業務について整理されている', '体系的に整理され、定期的に見直している'),
  },
  {
    id: 'Q2', axis: 'A', prompt: '業務に必要な知識やノウハウは、どのような状態ですか？',
    options: options('主に担当者・熟練者の頭の中にある', '資料と人の記憶に分散している', '社内資料として概ね残っている', '必要な知識が整理され、必要な人が参照できる'),
  },
  {
    id: 'Q3', axis: 'A', prompt: '新人・経験者・職種などによって、必要な学習内容を整理できていますか？',
    options: options('ほぼ同じ教育をしている', '担当者の判断で変えている', '一部で対象者別に整理している', '対象者ごとの学習目標・内容が明確になっている'),
  },
  {
    id: 'Q4', axis: 'B', prompt: '社内資料を従業員教育にどのように使っていますか？',
    options: options('ほとんど活用していない', 'PDFやPowerPointなどをそのまま共有している', '担当者が研修用に加工している', '学習目標や理解の順序を考えて教材化している'),
  },
  {
    id: 'Q5', axis: 'B', prompt: '教材を作る際、「何を・どの順番で・どう教えるか」を設計していますか？',
    options: options('ほとんど設計していない', '作成者の経験に任せている', '一部にルールやテンプレートがある', '学習目標から一貫して設計している'),
  },
  {
    id: 'Q6', axis: 'B', prompt: '熟練者や担当者が持つ判断・コツ・経験を教材に反映できていますか？',
    options: options('ほとんどできていない', 'OJTや口頭説明に依存している', '一部をマニュアル・教材化している', '継続的に収集し、教材へ反映している'),
  },
  {
    id: 'Q7', axis: 'C', prompt: '教材や研修内容は、どの程度更新されていますか？',
    options: options('更新時期が決まっていない', '問題が起きたときに更新する', '定期的に見直している', '業務・制度・製品の変更に合わせ継続的に更新している'),
  },
  {
    id: 'Q8', axis: 'C', prompt: '教育コンテンツの作成・更新は特定の担当者に依存していますか？',
    options: options('強く依存している', 'かなり依存している', '複数人で対応できる', '標準化されたプロセスで運用できる'),
  },
  {
    id: 'Q9', axis: 'C', prompt: '必要な従業員へ、必要な教育を適切に届けられていますか？',
    options: options('ほとんど管理できていない', 'メールやファイル共有などで配布している', '対象者を決めて受講管理している', '対象者・進捗まで継続的に管理している'),
  },
  {
    id: 'Q10', axis: 'D', prompt: '誰がどの教育を受講したか把握できますか？',
    options: options('把握できない', '一部のみ把握している', '概ね把握できる', '組織的に管理できる'),
  },
  {
    id: 'Q11', axis: 'D', prompt: '従業員が内容を理解したか確認していますか？',
    options: options('確認していない', 'アンケートや感想を中心に確認している', 'テストなどで理解度を確認している', '理解度を継続的に確認している'),
  },
  {
    id: 'Q12', axis: 'D', prompt: '受講結果を、教材や教育方法の改善に使っていますか？',
    options: options('ほとんど使っていない', '問題があったときだけ見直す', '定期的に改善している', '結果をもとに継続的な改善サイクルを回している'),
  },
]

export const levels: Level[] = [
  { level: 1, name: '属人型', min: 12, max: 19, description: '社内の知識や教育が、担当者・熟練者・OJTに強く依存している段階です。まずは「何を教える必要があるか」と「どこに知識があるか」を整理することが、教育資産化の第一歩になります。' },
  { level: 2, name: '資料蓄積型', min: 20, max: 27, description: '社内知識は資料として残り始めています。一方、資料を保存・共有することと、社員が学べることは同じではありません。既存資料を学習目標・順序・説明・確認まで含む教材へ変えていくことが次のテーマです。' },
  { level: 3, name: '教材化型', min: 28, max: 35, description: '教育に使えるコンテンツが整い始めています。次は、対象者への配信、更新、担当者間の運用を仕組みにして、継続的に活用できる状態へ進めることが重要です。' },
  { level: 4, name: '運用型', min: 36, max: 42, description: '教育の制作・配信・管理が一定の仕組みとして回っています。次は、受講状況や理解度を改善につなげ、教育そのものが継続的に育つ状態を目指す段階です。' },
  { level: 5, name: '教育資産型', min: 43, max: 48, description: '社内知識を教材化し、配信・活用・測定・改善へつなげる基盤が整っています。今後は、対象者別の最適化や知識更新の速度、教育効果との接続など、教育資産の価値をさらに高めていく段階です。' },
]

export const diagnosisTypes: Record<Axis, DiagnosisType> = {
  A: { axis: 'A', name: '体系化不足型', heading: '教えるべき知識の整理が、現在のボトルネックです。', description: '教育を増やす前に、「誰に、何を身につけてもらう必要があるのか」と、必要な知識がどこに存在するのかを整理することが優先です。', actions: ['教育対象となる業務・テーマを1つ選ぶ', '必要な知識・判断・手順を洗い出す', '対象者ごとの到達点を決める'] },
  B: { axis: 'B', name: '教材化不足型', heading: '社内資料を「学べる形」に変える工程が、現在のボトルネックです。', description: '資料を保存・共有するだけでは、社員が理解し、判断や行動へ生かせるとは限りません。「何を・どの順番で・どう教えるか」という教育設計を加えることが優先です。', actions: ['教材化する社内資料を1つ選ぶ', 'その資料から「何を学ばせるか」を定義する', '説明・具体例・理解確認を含む教材へ変換する'] },
  C: { axis: 'C', name: '運用不足型', heading: '教育を継続的に回す仕組みが、現在のボトルネックです。', description: '教材があっても、更新や配信が担当者任せでは教育資産として活用し続けることが難しくなります。制作・更新・配信の運用ルールを整えることが優先です。', actions: ['教材ごとの管理責任を明確にする', '更新のタイミング・ルールを決める', '誰に何を届けるかを継続的に管理する'] },
  D: { axis: 'D', name: '改善不足型', heading: '受講結果を教育改善へ戻す仕組みが、現在のボトルネックです。', description: '「受講した」で終わらず、理解できたか、どこでつまずいたかを把握することで、教育資産は継続的に価値を高められます。', actions: ['受講状況を把握する', '理解度を確認する', '結果を教材・教育方法の改善へ戻す'] },
}

export const recommendations: Partial<Record<Axis, { title: string; reason: string; url: string; status: 'published' }[]>> = {
  A: [
    { title: '教材設計は「何を教えるか」から考えてはいけない', reason: '教える内容を整理する起点として、学習後の状態を定める考え方を確認します。', url: 'https://www.adop-context.jp/post/why-not-start-training-design-with-content', status: 'published' },
    { title: 'コンテキストAIができるまで② 学習目標設計編', reason: '知識を対象者と到達点に結びつける、学習目標設計の具体的な流れを確認します。', url: 'https://www.adop-context.jp/post/how-context-ai-works-2-learning-objectives', status: 'published' },
  ],
  B: [
    { title: '社内資料はなぜ教材にならないのか', reason: '資料と教材の違いを、教育設計の観点から整理します。', url: 'https://www.adop-context.jp/post/why-internal-documents-arent-training-materials', status: 'published' },
    { title: '生成AIは教材制作をどこまで変えるのか', reason: '既存資料から教材を作る工程と、人が判断すべきポイントを確認します。', url: 'https://www.adop-context.jp/post/how-far-can-generative-ai-change-training-material-creation', status: 'published' },
  ],
  C: [
    { title: '教材制作は誰が担うのか', reason: '教材制作・確認・更新を特定の担当者だけに依存させない役割分担を整理します。', url: 'https://www.adop-context.jp/post/who-should-create-training-materials-role-division', status: 'published' },
    { title: '大量のマニュアル・規程・営業資料が「使われない資産」になっている会社へ', reason: '資料を継続的に教材化し、組織の運用へ定着させる進め方を確認します。', url: 'https://www.adop-context.jp/post/unused-document-assets-training-content', status: 'published' },
  ],
  D: [
    { title: '従業員教育は教材を作るだけでは改善しない', reason: '受講確認に留まらず、行動や業務成果まで教育効果を捉える視点を確認します。', url: 'https://www.adop-context.jp/post/employee-training-survey-2026-why-training-materials-alone-arent-enough', status: 'published' },
    { title: '学習効果の高い教材をAIは作れるのか', reason: '学習効果を高める条件と、教材品質を確認・改善する観点を整理します。', url: 'https://www.adop-context.jp/post/can-ai-create-effective-learning-content-7-conditions', status: 'published' },
  ],
}

export const links = {
  primaryCta: 'https://www.adop-context.jp/context-ai#1demo',
  secondaryCta: 'https://www.adop-context.jp/post/what-is-educational-asset-transformation',
}

export const appVersion = '0.1.0'
