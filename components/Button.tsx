"use client";
import Link from "next/link";
import { AudioContext } from "./AudioContext";
import { useContext } from "react";

type Props = {
  variant: "primary" | "secondary" | "secondary-darker" | "danger";
  className?: string;
  disabled?: boolean;
  href?: string;
  openInNewTab?: boolean;
  playSoundOnClick?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export default ({
  variant,
  className: extraClassNames,
  disabled,
  href,
  openInNewTab,
  playSoundOnClick = true,
  onClick,
  children,
}: Props) => {
  const className = {
    className: `select-none rounded p-3 text-lg font-semibold transition-colors duration-[40ms] disabled:bg-neutral-500 ${extraClassNames} ${
      variant === "primary" ? "bg-[#048b59] hover:bg-[#15b869]" : ""
    } ${variant === "secondary" ? "hover:bg-neutral-500/50" : ""} ${
      variant === "secondary-darker" ? "hover:bg-black/50" : ""
    } ${variant === "danger" ? "bg-red-500 hover:bg-red-500/50" : ""}`,
  };

  const { buttonClickSound, buttonHoverSound } = useContext(AudioContext);

  return href ? (
    <Link
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      className={className.className}
      onMouseEnter={() => buttonHoverSound.play()}
      onClick={() => buttonClickSound.play()}
    >
      {children}
    </Link>
  ) : (
    <button
      className={className.className}
      onMouseEnter={() => buttonHoverSound.play()}
      disabled={disabled}
      autoFocus={children === "RETRY"}
      onClick={() => {
        if (typeof onClick === "function") onClick();
        if (playSoundOnClick) buttonClickSound.play();
      }}
    >
      {children}
    </button>
  );
};
