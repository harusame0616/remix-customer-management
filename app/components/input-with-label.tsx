import React, {
  ComponentProps,
  HTMLInputTypeAttribute,
  useId,
  useState,
} from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { PASSWORD_MIN_LENGTH } from "~/domains/auth-user/constants";

type Props = {
  error?: string;
  label: string;
  hint?: string;
  selectList?: string[];
} & ComponentProps<typeof Input>;

const defaultPropsMap = {
  email: {
    autoCorrect: "off",
    spellCheck: "false",
  },
  password: {
    autoCapitalize: "none",
    autoCorrect: "off",
    spellCheck: "false",
    minLength: PASSWORD_MIN_LENGTH,
  },
} as Record<HTMLInputTypeAttribute, ComponentProps<typeof Input>>;
export const InputWithLabel = React.forwardRef(function _InputWithLabel(
  { label, hint, error = "", type = "text", selectList, ...props }: Props,
  ref: React.Ref<HTMLInputElement>
) {
  const id = useId();
  const hintId = useId();
  const errorId = useId();
  const listId = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const defaultProps = type in defaultPropsMap ? defaultPropsMap[type] : {};

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <p id={hintId}>{hint}</p>
      <Input
        {...defaultProps}
        {...props}
        type={isPasswordVisible ? "text" : type}
        id={id}
        aria-describedby={[hintId, errorId].join(" ")}
        ref={ref}
        list={listId}
      />
      {type === "password" && (
        <div className="mt-1 flex items-center gap-2">
          <Switch
            checked={isPasswordVisible}
            onCheckedChange={setIsPasswordVisible}
          />
          <Label>パスワードを表示する</Label>
        </div>
      )}
      <p className="text-destructive mt-1 text-sm" role="alert" id={errorId}>
        {error}
      </p>
      <datalist id={listId}>
        {selectList?.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
    </div>
  );
});
