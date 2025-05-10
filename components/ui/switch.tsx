"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import styles from "./switch.module.css"

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: "sm" | "md" | "lg"
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size = "md", ...props }, ref) => (
    <SwitchPrimitives.Root className={cn(styles.switchRoot, styles[size], className)} {...props} ref={ref}>
      <SwitchPrimitives.Thumb className={styles.switchThumb} />
    </SwitchPrimitives.Root>
  ),
)

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
