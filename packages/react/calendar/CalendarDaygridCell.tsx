import { Fragment, useState } from "react";
import type { KitComponent, KitComponentProps } from "../types";
import type {
  CalendarsMap,
  CalendarView,
  CalendarViewDayProps,
  CalendarViewEvent,
} from "./types";
import type { UseCalendarReturn } from "./useCalendar";
import { getCustomProps, getDisplayTime } from "./utils";

/**
 * TODO: include in this lib utilities like in https://github.com/react-icons/react-icons/blob/master/packages/react-icons/src/iconBase.tsx
 *
 * this is the `MdAdd` icon from `react-icons`
 */
const IconExpand = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M0 0h24v24H0z" />
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
};

export type KitCalendarDaygridCellProps = {
  eventClicked?: UseCalendarReturn["eventClicked"];
  setEventClicked: UseCalendarReturn["setEventClicked"];
  eventHovered?: UseCalendarReturn["eventHovered"];
  setEventHovered: UseCalendarReturn["setEventHovered"];
  view: CalendarView;
  maxEvents: number;
  events: CalendarViewEvent[];
  calendarsMap: CalendarsMap;
};

export type CalendarDaygridCellStyledProps = CalendarViewDayProps & {
  $view: CalendarView;
  $selected?: boolean;
  $past?: boolean;
  $color: string;
};

export type CalendarDaygridCellEventProps =
  React.ComponentPropsWithoutRef<"div"> &
    (
      | (CalendarDaygridCellStyledProps & {
          $placeholder?: false;
        })
      | {
          $placeholder: true;
        }
    );

export type CalendarDaygridCellEventBtnProps = CalendarDaygridCellEventProps;

export type CalendarDaygridCellComponents = {
  Cell?: KitComponent;
  CellOverflow?: KitComponent;
  CellEvent?: KitComponent<CalendarDaygridCellEventProps>;
  CellEventBtn?: KitComponent<CalendarDaygridCellEventBtnProps>;
  CellEventTitle?: KitComponent;
  CellEventStart?: KitComponent;
};

export type CalendarDaygridCellProps = KitComponentProps<
  KitCalendarDaygridCellProps,
  CalendarDaygridCellComponents
>;

/**
 * Style for button within a event cell (never mutated, it is shared)
 *
 * Here we might differentiate week/month view where the first does not get
 * ellipsed btn texts, with `Start` as block element and underneath the `Title`
 * on multiple lines, but that would mean that we loose the ability to interweave
 * single-day events among the spaces left by wider multi-days events.
 */
const styleBtn = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
} as const;

export let CalendarDaygridCell = ({
  eventClicked,
  setEventClicked,
  // eventHovered,
  setEventHovered,
  view,
  maxEvents,
  events,
  calendarsMap,
  Cell = "div",
  CellOverflow = "div",
  CellEvent = "div",
  CellEventBtn = "div",
  CellEventTitle = "span",
  CellEventStart = "span",
}: CalendarDaygridCellProps) => {
  const [isExpanded, expand] = useState(false);
  // the events hidden by the overflow, placeholders might take visible slots
  const overflowing = events
    .slice(maxEvents)
    .filter((event) => !event.placeholder).length;
  const placeholderProps = { $placeholder: true } as const;

  return (
    <Cell>
      {events.map((event, i) => {
        if (i === maxEvents && !isExpanded) {
          return (
            <CellOverflow
              key={"overflowMessage" + i}
              onClick={() => expand(true)}
            >
              <IconExpand />
              {overflowing}
            </CellOverflow>
          );
        }
        if (i > maxEvents && !isExpanded) return null;

        if (event.placeholder) {
          return (
            <Fragment key={event.key}>
              <CellEvent {...getCustomProps(CellEvent, placeholderProps)}>
                <CellEventBtn
                  aria-hidden="true"
                  style={{ visibility: "hidden" }}
                  {...getCustomProps(CellEventBtn, placeholderProps)}
                >
                  <CellEventTitle>&nbsp;</CellEventTitle>
                </CellEventBtn>
              </CellEvent>
            </Fragment>
          );
        }

        const styleEvent = {
          zIndex: event.firstOfMulti ? 1 : 0, // to cover the following event days
          position: "relative",
          width: event.firstOfMulti ? `${100 * event.width}%` : "100%",
        } as const;

        // hide the events of the hidden calendars, the calendars missing in the
        // map are visible
        const calendar = calendarsMap[event.calendar.id];
        const styledProps = {
          $view: view,
          $selected: eventClicked?.uid === event.uid,
          $past: event.isPast,
          $color: event.color,
          $isOutOfRange: event.$isOutOfRange,
          $isToday: event.$isToday,
        };

        return (
          <Fragment key={event.key}>
            <CellEvent
              style={styleEvent}
              {...getCustomProps(CellEvent, styledProps)}
            >
              <CellEventBtn
                role="button"
                style={
                  calendar && !calendar.on
                    ? { ...styleBtn, display: "none" }
                    : styleBtn
                }
                {...getCustomProps(CellEventBtn, styledProps)}
                onClick={() =>
                  setEventClicked((prev) =>
                    prev?.uid === event.uid ? null : event,
                  )
                }
                onMouseEnter={() => setEventHovered(event)}
                onMouseLeave={() => setEventHovered(null)}
              >
                {event.allDay ? (
                  <CellEventTitle>{event.title}</CellEventTitle>
                ) : (
                  <>
                    <CellEventStart>
                      {getDisplayTime(event.start)}
                    </CellEventStart>
                    <CellEventTitle>{event.title}</CellEventTitle>
                  </>
                )}
              </CellEventBtn>
            </CellEvent>
            {/* {i === events.length - 1 && isExpanded ? (
              <CellOverflow onClick={() => expand(false)}>
                <IconCollapse />
                Show less
              </CellOverflow>
            ) : null} */}
          </Fragment>
        );
      })}
    </Cell>
  );
};
