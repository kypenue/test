import { getFormStatus } from "@/shared/lib/getFormStatus";
import { Form, Input, type InputProps } from "antd";
import { useController } from "react-hook-form";
import { memo } from "react";

interface FormInputProps extends InputProps {
    label: string;
}

export const FormInput = memo(
    ({
        prefix,
        autoComplete,
        placeholder,
        label,
        name,
        ...rest
    }: FormInputProps) => {
        const { field, fieldState } = useController({
            name: name ? name : "",
        });

        return (
            <Form.Item
                layout="vertical"
                label={label}
                validateStatus={getFormStatus(fieldState?.error?.message)}
                help={fieldState?.error?.message}
            >
                <Input
                    {...rest}
                    {...field}
                    prefix={prefix}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    size={"large"}
                    name={name}
                />
            </Form.Item>
        );
    },
);

FormInput.displayName = "FormInput";
