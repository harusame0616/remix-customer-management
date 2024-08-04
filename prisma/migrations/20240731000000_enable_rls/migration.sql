-- 既存のテーブルすべての RLS を有効化する
DO $$
DECLARE t record;
current_schema text := current_schema();
BEGIN FOR t IN (
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = current_schema
) LOOP EXECUTE format(
    'ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY',
    current_schema,
    t.table_name
);
END LOOP;
END $$;