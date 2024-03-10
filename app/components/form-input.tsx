import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "./ui/switch";
import { useId, useState } from "react";
import { Textarea } from "./ui/textarea";

type FormInputProps<Schema extends FieldValues> = {
  control: UseFormReturn<Schema>["control"];
  label: string;
  description?: string;
  name: Path<Schema>;
  required?: boolean;
} & React.ComponentProps<typeof Input>;
export function FormInput<Schema extends FieldValues>({
  control,
  label,
  name,
  required = false,
  description,
  type,
  ...props
}: FormInputProps<Schema>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div>
            <FormLabel>
              {label}
              <span className="text-xs text-muted-foreground">
                {required ? (
                  <span className="text-red-600">（必須）</span>
                ) : (
                  "（任意）"
                )}
              </span>
            </FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Input
              {...field}
              {...props}
              type={isPasswordVisible ? "text" : type}
            />
          </FormControl>
          <FormMessage />
          {type === "password" && (
            <PasswordVisibleSwitch
              visible={isPasswordVisible}
              onChange={setIsPasswordVisible}
            />
          )}
        </FormItem>
      )}
    />
  );
}

type FormTextarea<Schema extends FieldValues> = {
  control: UseFormReturn<Schema>["control"];
  label: string;
  description?: string;
  name: Path<Schema>;
  required?: boolean;
} & React.ComponentProps<typeof Textarea>;
export function FormTextarea<Schema extends FieldValues>({
  control,
  label,
  name,
  required = false,
  description,
  ...props
}: FormTextarea<Schema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div>
            <FormLabel>
              {label}
              <span className="text-xs text-muted-foreground">
                {required ? (
                  <span className="text-red-600">（必須）</span>
                ) : (
                  "（任意）"
                )}
              </span>
            </FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FormRadioProps<Schema extends FieldValues> = FormInputProps<Schema> & {
  selects: { label: string; value: string }[];
} & React.ComponentProps<typeof Input>;
export function FormRadio<Schema extends FieldValues>({
  control,
  selects,
  label,
  description,
  name,
}: FormRadioProps<Schema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div>
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col gap-1"
            >
              {selects.map((select) => (
                <FormItem
                  className="flex items-center space-x-1 space-y-0"
                  key={select.value}
                >
                  <FormControl>
                    <RadioGroupItem value={select.value} />
                  </FormControl>
                  <FormLabel className="font-normal min-h-6 cursor-pointer flex items-center">
                    {select.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type PasswordVisibleSwitchProps = {
  visible: boolean;
  onChange: (visible: boolean) => void;
};
function PasswordVisibleSwitch({
  visible,
  onChange,
}: PasswordVisibleSwitchProps) {
  const id = useId();

  return (
    <div className="mt-1 flex items-center gap-2">
      <Switch checked={visible} onCheckedChange={onChange} id={id} />
      <FormLabel htmlFor={id}>パスワードを表示する</FormLabel>
    </div>
  );
}
