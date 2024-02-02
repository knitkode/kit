import type { KoineComponent, KoineComponentProps } from "../types";
import type { CalendarsMap } from "./types";

export type KoineCalendarLegendProps = {
  toggleCalendarVisibility: (id: string) => void;
  calendarsMap: CalendarsMap;
};

export type CalendarLegendItemProps = React.ComponentPropsWithoutRef<"div"> & {
  $color: string;
  $empty: boolean;
  disabled: boolean;
};

export type CalendarLegendProps = KoineComponentProps<
  KoineCalendarLegendProps,
  {
    LegendItem?: KoineComponent<CalendarLegendItemProps>;
    LegendItemStatus?: KoineComponent;
    LegendItemLabel?: KoineComponent;
    LegendItemEvents?: KoineComponent;
  }
>;

export let KoineCalendarLegend = ({
  calendarsMap = {},
  toggleCalendarVisibility,
  LegendItem = "div",
  LegendItemStatus = "span",
  LegendItemLabel = "span",
  LegendItemEvents = "span",
}: CalendarLegendProps) => {
  // const sorted = Object.entries(calendarsMap).sort((a, b) => {
  //   const { name: nameA } = a[1];
  //   const { name: nameB } = b[1];
  //   if (nameA < nameB) return -1;
  //   else if (nameA > nameB) return 1;
  //   else return 0;
  // });

  return (
    <>
      {Object.entries(calendarsMap).map(([id, calendar]) => (
        <LegendItem
          key={"CalendarLegend." + id}
          onClick={() => toggleCalendarVisibility(id)}
          $color={calendar.color}
          $empty={calendar.events === 0}
          disabled={calendar.events === 0}
        >
          <LegendItemStatus>
            {calendar.on ? "\u2b24" : "\u2b58"}
          </LegendItemStatus>
          <LegendItemLabel>{calendar.name}</LegendItemLabel>
          <LegendItemEvents>{calendar.events}</LegendItemEvents>
        </LegendItem>
      ))}
    </>
  );
};
