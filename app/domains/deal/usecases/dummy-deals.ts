import { DealPlatform, DealStatus } from "../enum";

export const dummyDeals = [
  {
    dealId: "405c8968-010b-1d53-a51a-0583b990fe83",
    title: "モバイルアプリ開発プロジェクト",
    url: "https://example.com/mobile-app-project",
    content:
      "iOS/Androidプラットフォーム向けの新規モバイルアプリの開発を請け負います。ゲーム、ユーティリティ、ビジネスアプリなど、様々なジャンルに対応可能です。",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.InProgress.dealStatusId,
  },
  {
    dealId: "405c8968-010b-1d53-a51a-0583b990fe81",
    title: "Webサイト制作",
    url: "https://example.com/website-development",
    content:
      "企業や個人事業主向けのWebサイトの制作を請け負います。デザインからコーディングまで一貫して対応します。",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.Canceled.dealStatusId,
  },
  {
    dealId: "415c8968-010b-1d53-a51a-0583b990fe81",
    title: "データ分析システム開発",
    url: "https://example.com/data-analysis-system",
    content:
      "大規模データの解析・可視化を行うシステムの開発を請け負います。AIやビッグデータ解析の知見を活かした高度な分析機能を実装します。",
    attachments: [],
    platformId: DealPlatform.Coconala.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    dealId: "425c8968-010b-1d53-a51a-0583b990fe81",
    title: "業務システム改修",
    url: "https://example.com/system-refactoring",
    content:
      "既存の業務システムのリファクタリングやパフォーマンス改善、セキュリティ強化などの改修作業を請け負います。安定した運用を実現します。",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.UnderProposal.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    dealId: "435c8968-010b-1d53-a51a-0583b990fe81",
    title: "Webアプリケーション開発",
    url: "https://example.com/web-app-development",
    content:
      "クラウドネイティブな設計によるスケーラブルなWebアプリケーションの開発を請け負います。モダンなフレームワークを活用した高度な機能を実装します。",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Rejected.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    dealId: "435c8268-010b-1d53-a51a-0583b990fe81",
    title: "IoTシステム構築",
    url: "https://example.com/iot-system",
    content:
      "様々なIoTデバイスを連携させたシステムの構築を請け負います。データ収集・処理の自動化や遠隔監視・制御などの機能を実装します。",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.UnderConsideration.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    dealId: "475c8968-010b-1d53-a51a-0583b990fe81",
    title: "AIシステム開発",
    url: "https://example.com/ai-system",
    content:
      "機械学習やディープラーニングなどのAI技術を活用したシステムの開発を請け負います。画像認識、自然言語処理、予測モデリングなどの機能を実装します。",
    attachments: [],
    platformId: DealPlatform.CloudWorks.dealPlatformId,
    statusId: DealStatus.Rejected.dealStatusId,
    deadline: new Date("2022-01-02T00:00:00+09:00"),
  },
  {
    dealId: "485c8968-010b-1d53-a51a-0583b990fe81",
    title: "Webサービス開発",
    url: "https://example.com/web-service",
    content:
      "SaaSモデルのWebサービスの開発を請け負います。サブスクリプション課金やマルチテナント対応など、サービス運用に必要な機能を実装します。",
    attachments: [],
    platformId: DealPlatform.Lancers.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2022-01-01T00:00:00+09:00"),
  },
  {
    dealId: "875c8968-010b-1d53-a51a-0583b990fe81",
    title: "ブロックチェーンシステム開発",
    url: "https://example.com/blockchain-system",
    content:
      "分散型台帳技術であるブロックチェーンを活用したシステムの開発を請け負います。トレーサビリティやデータ改ざん防止などの機能を実現します。",
    attachments: [],
    platformId: DealPlatform.Other.dealPlatformId,
    statusId: DealStatus.Completed.dealStatusId,
    deadline: new Date("2021-12-31T00:00:00+09:00"),
  },
];
