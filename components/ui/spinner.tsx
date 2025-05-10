import { cn } from "@/lib/utils"
import styles from "./spinner.module.css"

type SpinnerSize = "sm" | "md" | "lg" | "xl"

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        styles.spinner,
        {
          [styles.spinnerSm]: size === "sm",
          [styles.spinnerMd]: size === "md",
          [styles.spinnerLg]: size === "lg",
          [styles.spinnerXl]: size === "xl",
        },
        className,
      )}
      aria-label="Loading"
    >
      <div
        className={cn(styles.spinnerCircle, {
          [styles.spinnerCircleSm]: size === "sm",
          [styles.spinnerCircleMd]: size === "md",
          [styles.spinnerCircleLg]: size === "lg",
          [styles.spinnerCircleXl]: size === "xl",
        })}
      />
      <div
        className={cn(styles.spinnerTrack, {
          [styles.spinnerTrackSm]: size === "sm",
          [styles.spinnerTrackMd]: size === "md",
          [styles.spinnerTrackLg]: size === "lg",
          [styles.spinnerTrackXl]: size === "xl",
        })}
      />
    </div>
  )
}
