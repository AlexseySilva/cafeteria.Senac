import { Link } from "expo-router";

import type { ComponentProps } from "react";

type LinkButtonProps = ComponentProps<typeof Link> & {
  title: string;
};

export function LinkButton({ title, ...rest }: LinkButtonProps) {
  return (
    <Link className="text-slate-300 text-center text-base font-body" {...rest}>
      {title}
    </Link>
  );
}
