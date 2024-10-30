import { useEffect, useRef, useState } from "react";
import { RadioEvent } from "@/states/Events/reducer";
import { useEvents } from "@/states/Events/hook";
import c from "classnames";
import s from "./index.module.less";

export const Radio = () => {
  const animatiomRef = useRef<number>();

  const { events, updateEventsList } = useEvents();

  const lastTimeRef = useRef<number>(0); // 上一次事件的时间戳

  const [currentEvent, setCurrentEvent] = useState<RadioEvent | undefined>();

  const [showEvnet, setShowEvent] = useState<boolean>(true);

  const handleEvents = (currentTime: number) => {
    // 每隔2秒触发
    if (currentTime - lastTimeRef.current > 2000) {
      if (events.length) {
        const [nextEvnets, ...remainingEvents] = events;

        updateEventsList(remainingEvents);
        setCurrentEvent(nextEvnets);
        setShowEvent(true);

        setTimeout(() => setShowEvent(false), 1000);
        lastTimeRef.current = currentTime;
      }
    }
    animatiomRef.current = requestAnimationFrame(handleEvents);
  };

  useEffect(() => {
    animatiomRef.current = requestAnimationFrame(handleEvents);
    return () => {
      cancelAnimationFrame(animatiomRef.current!);
    };
  }, [events]);

  return (
    <div className={c(s.radio, "fbh fbjc fbac")}>
      {currentEvent && (
        <div className={c(s.radio_event_item)} style={{ opacity: showEvnet ? 1 : 0 }}>
          {currentEvent?.content}
        </div>
      )}
    </div>
  );
};

export default Radio;
