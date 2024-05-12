export function DemoDescription() {
  return (
    <section aria-labelledby="demo-description-text">
      <h2 id="demo-description-text" className="text-lg font-bold mb-4">
        案件管理システムのデモ環境説明
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>
            本システムについて
          </h3>
          <p className="flex flex-col">
            <span>
              本システムは架空の仕様を想定した案件管理システムのデモ環境です。
            </span>
            <span>
              ご自由にお試しいただけますが、誰でも閲覧・操作できるため実在するデータを入力するのはご遠慮ください。
            </span>
            <span>
              また、データは適時リセットされますので、ご了承ください。
            </span>
          </p>
        </div>
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>機能</h3>
          <p>以下の機能がご利用いただけます。</p>
          <dl className="list-disc list-inside space-y-4 mt-4">
            <div>
              <dt className="font-bold">・ログイン機能</dt>
              <dd>
                事前に登録してあるユーザーのメールアドレスとパスワードによってシステムの利用を制限するセキュリティー機能です。
                また、パスワードを忘れた場合のパスワードリセット機能も備えています。
                <span className="block mt-2 text-destructive">
                  ※
                  デモ環境では実際にはパスワードリセットのメールは送付されません。
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-bold">・ユーザー管理機能</dt>
              <dd>
                ログインユーザーの一覧・追加・編集・削除を行う機能です。
                また、ロールを設定することで操作可能な機能を制限することができます。
                Admin ロールでのみ利用可能です。
                <span className="block mt-2 text-destructive">
                  ※ デモ環境では一覧の表示のみ可能です。
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-bold">・顧客管理機能</dt>
              <dd>
                顧客を一覧・検索・閲覧・作成・編集・削除する機能です。作成、編集、削除は
                Admin、Editor ロールでのみ利用可能です。
              </dd>
            </div>
            <div>
              <dt className="font-bold">・取引管理機能</dt>
              <dd>
                取引を一覧・検索・閲覧・作成・編集・削除する機能です。作成、編集、削除は
                Admin、Editor ロールでのみ利用可能です。
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className={`text-lg mb-2 before:content-["■"]`}>
            ログインについて
          </h3>
          <h4 className="text-lg font-bold">メールアドレス</h4>
          <p className="mb-4">
            メールアドレスは以下のいずれかを入力してください。
          </p>
          <dl className="space-y-4">
            <div>
              <dt>・Admin ロール（全機能が利用可能）</dt>
              <dt>admin@example.com</dt>
            </div>
            <div>
              <dt>・Editor ロール（ユーザー管理機能以外が利用可能）</dt>
              <dd>editor@example.com</dd>
            </div>
            <div>
              <dt>
                ・Viewer ロール（取引、顧客の一覧、検索、詳細表示のみ可能）
              </dt>
              <dt>viewer@example.com</dt>
            </div>
          </dl>
          <h4 className="text-lg font-bold">パスワード</h4>
          <p className="mb-4">
            パスワードは全ユーザー共通で 「password」です。
          </p>
        </div>
      </div>
    </section>
  );
}
