"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  type BarProps,
  type CartesianGridProps,
  type CellProps,
  type LabelListProps,
  type LabelProps,
  type LegendProps,
  type LineProps,
  type PieProps,
  type PolarAngleAxisProps,
  type PolarGridProps,
  type PolarRadiusAxisProps,
  type RadialBarProps,
  type ResponsiveContainerProps,
  type SectorProps,
  type TooltipProps,
  type XAxisProps,
  type YAxisProps,
} from "recharts"
import {
  type AxisConfig,
  type ChartConfig,
  type ChartContextProps,
  type ChartLegendContentProps,
  type ChartStyleConfig,
  type ChartTooltipContentProps,
} from "recharts-extend"

import { cn } from "@/lib/utils"
import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Context
// -----------------------------------------------------------------------------
const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// Components
// -----------------------------------------------------------------------------
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof ResponsiveContainer>["children"]
    className?: string
  }
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = `chart-${id || React.useId()}`
  const contextValue = React.useMemo(() => ({ config }), [config])

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "recharts-wrapper group/chart w-full h-full flex items-start justify-center text-xs [&>div]:h-full [&>div]:w-full",
          className
        )}
        {...props}
      >
        <ResponsiveContainer id={chartId}>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartTooltip = Tooltip

const ChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentPrimitive>,
  React.ComponentProps<typeof TooltipContentPrimitive> &
    Pick<
      TooltipProps<any, any>,
      "allowEscapeViewBox" | "content" | "cursor"
    > & {
      indicator?: "line" | "dot" | "dashed"
      hideLabel?: boolean
      hideIndicator?: boolean
      label?: React.ReactNode
      labelFormatter?: ChartTooltipContentProps["labelFormatter"]
      labelClassName?: string
      formatter?: ChartTooltipContentProps["formatter"]
    }
>(
  (
    {
      allowEscapeViewBox,
      className,
      content,
      cursor = true,
      formatter,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !label) {
        return null
      }

      const item = config[label as string] as AxisConfig | undefined

      if (labelFormatter) {
        return labelFormatter(label, config)
      }

      if (item?.label) {
        return item.label
      }

      return label
    }, [label, labelFormatter, hideLabel, config])

    if (!content || !("active" in content && content.active)) {
      return null
    }

    const { payload = [] } = content

    return (
      <TooltipContentPrimitive
        ref={ref}
        wrapperClassName="recharts-tooltip-wrapper"
        className={cn(
          "rounded-md border bg-background/95 p-2 text-sm shadow-lg backdrop-blur-sm",
          className
        )}
      >
        {tooltipLabel ? (
          <div className={cn("pb-1 pl-2 pr-1 font-medium", labelClassName)}>
            {tooltipLabel}
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5 p-1">
          {payload.map((item, i) => {
            const key = `${item.name}-${i}`
            const itemConfig = config[item.name as string]

            const indicatorColor =
              itemConfig?.color || item.color || "hsl(var(--foreground))"

            const value =
              formatter?.(item.value, item.name, item, i, payload) ??
              item.value

            if (item.value === undefined || item.value === null) {
              return null
            }

            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between gap-1.5",
                  hideIndicator && "justify-end"
                )}
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "size-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                      {
                        "border-0": indicator === "dot",
                        "border-2": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                        "*:size-2.5": indicator === "dot",
                      }
                    )}
                    style={
                      {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      } as React.CSSProperties
                    }
                  >
                    {indicator === "dot" && (
                      <div className="rounded-full bg-background" />
                    )}
                  </div>
                )}
                <div
                  className={cn(
                    "flex w-full flex-wrap items-center justify-end gap-x-1.5 gap-y-1",
                    !hideIndicator && "grid flex-1 grid-cols-2"
                  )}
                >
                  <span
                    className={cn(
                      "text-muted-foreground",
                      !hideIndicator && "order-2 text-right"
                    )}
                  >
                    {itemConfig?.label || item.name}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      hideIndicator ? "text-foreground" : "order-1 text-right"
                    )}
                  >
                    {value as React.ReactNode}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </TooltipContentPrimitive>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    {
      className,
      hideIcon,
      payload,
      verticalAlign = "bottom",
      nameKey = "name",
    },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "recharts-legend flex items-center justify-center gap-4",
          verticalAlign === "top" ? "mb-4" : "mt-4",
          className
        )}
      >
        {payload.map((item) => {
          const key = item.value as string
          const itemConfig = config[key]
          const color =
            itemConfig?.color || item.color || "hsl(var(--foreground))"

          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:shrink-0"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

// This is a workaround to provide a default legend formatter.
// The recharts library doesn't provide a way to render a custom legend with default formatting.
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<LegendProps, "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
      content?: React.ComponentType<LegendProps>
    }
>(
  (
    {
      className,
      hideIcon,
      verticalAlign = "bottom",
      nameKey = "name",
      content: Content,
      ...props
    },
    ref
  ) => {
    const { config } = useChart()
    const payload = React.useMemo(
      () =>
        Object.entries(config).map(([key, config]) => ({
          value: key,
          ...config,
          payload: {
            ...config,
          },
          color: config.color,
          dataKey: key,
        })),
      [config]
    )

    if (!payload.length) {
      return null
    }

    if (Content) {
      return <Content {...props} payload={payload} />
    }

    return (
      <div
        ref={ref}
        className={cn(
          "recharts-legend flex items-center justify-center gap-4",
          verticalAlign === "top" ? "mb-4" : "mt-4",
          className
        )}
      >
        {payload.map((item) => {
          const key = item.value
          const itemConfig = config[key]
          const color =
            itemConfig?.color || item.color || "hsl(var(--foreground))"

          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:shrink-0"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

const ChartStyle = React.forwardRef<
  HTMLStyleElement,
  React.ComponentProps<"style"> & { id: string }
>(({ id, ...props }, ref) => {
  const { config } = useChart()

  const style = React.useMemo(() => {
    const styles: ChartStyleConfig[] = [
      {
        ".recharts-wrapper": {
          "--chart-font-family": "var(--font-sans)",
          "--chart-font-size": "var(--font-size-xs)",
        },
        ".recharts-wrapper .recharts-cartesian-axis-tick-value": {
          fontFamily: "var(--chart-font-family)",
          fontSize: "var(--chart-font-size)",
        },
        ".recharts-wrapper .recharts-polar-axis-tick-value": {
          fontFamily: "var(--chart-font-family)",
          fontSize: "var(--chart-font-size)",
        },
        ".recharts-wrapper .recharts-legend-item-text": {
          fontFamily: "var(--chart-font-family)",
          fontSize: "var(--chart-font-size)",
        },
        ".recharts-wrapper .recharts-tooltip-wrapper": {
          fontFamily: "var(--chart-font-family)",
          fontSize: "var(--chart-font-size)",
        },
      },
    ]

    Object.entries(config).forEach(([key, itemConfig]) => {
      const color =
        itemConfig.color ||
        `hsl(var(--chart-${itemConfig.index || 0}))` ||
        "hsl(var(--foreground))"

      styles.push({
        [`.recharts-wrapper .recharts-bar .recharts-bar-rectangle.chart-bar-${key}`]:
          {
            fill: color,
          },
        [`.recharts-wrapper .recharts-line .recharts-line-curve.chart-line-${key}`]:
          {
            stroke: color,
          },
        [`.recharts-wrapper .recharts-area .recharts-area-area.chart-area-${key}`]:
          {
            fill: color,
            stroke: color,
          },
        [`.recharts-wrapper .recharts-pie .recharts-pie-sector.chart-pie-${key}`]:
          {
            fill: color,
          },
        [`.recharts-wrapper .recharts-radial-bar .recharts-radial-bar-background-sector`]:
          {
            fill: "hsl(var(--muted))",
          },
        [`.recharts-wrapper .recharts-radial-bar .recharts-radial-bar-sector.chart-radial-bar-${key}`]:
          {
            fill: color,
          },
        [`.recharts-wrapper .recharts-dot.recharts-line-dot.chart-dot-${key}`]:
          {
            fill: color,
            stroke: "hsl(var(--background))",
          },
      })
    })

    const css = styles
      .map((style) => {
        return Object.entries(style)
          .map(([selector, rules]) => {
            const declarations = Object.entries(rules)
              .map(([property, value]) => {
                const prop = property.replace(
                  /([A-Z])/g,
                  (g) => `-${g[0].toLowerCase()}`
                )
                return `${prop}: ${value};`
              })
              .join(" ")
            return `[data-chart=${id}] ${selector} { ${declarations} }`
          })
          .join("\n")
      })
      .join("\n")

    return css
  }, [config, id])

  return <style ref={ref} dangerouslySetInnerHTML={{ __html: style }} />
})
ChartStyle.displayName = "ChartStyle"

export {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  Label,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Rectangle,
  ResponsiveContainer,
  Sector,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  XAxis,
  YAxis,
  type AxisConfig,
  type BarProps,
  type CartesianGridProps,
  type CellProps,
  type ChartConfig,
  type ChartContextProps,
  type ChartLegendContentProps,
  type ChartStyleConfig,
  type ChartTooltipContentProps,
  type LabelListProps,
  type LabelProps,
  type LegendProps,
  type LineProps,
  type PieProps,
  type PolarAngleAxisProps,
  type PolarGridProps,
  type PolarRadiusAxisProps,
  type RadialBarProps,
  type ResponsiveContainerProps,
  type SectorProps,
  type TooltipProps,
  type XAxisProps,
  type YAxisProps,
}
export { useChart }
