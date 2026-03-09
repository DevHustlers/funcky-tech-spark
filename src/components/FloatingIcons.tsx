import { useMemo } from "react";
import type { IconType } from "react-icons";
import {
  SiReact, SiRust, SiGo, SiRuby, SiCplusplus,
  SiC, SiCsharp, SiPython, SiTypescript, SiJavascript,
  SiGnubash, SiJava, SiZig,
} from "react-icons/si";
import { TbBrackets, TbCode } from "react-icons/tb";

const ALL_ICONS: IconType[] = [
  SiReact, SiRust, SiGo, SiRuby, SiCplusplus,
  SiC, SiCsharp, SiPython, SiTypescript, SiJavascript,
  SiGnubash, SiJava, SiZig, TbBrackets, TbCode,
];

const POSITIONS = [
  // left side (10)
  { top: 3, left: 2 }, { top: 12, left: 5 }, { top: 22, left: 3 },
  { top: 33, left: 6 }, { top: 43, left: 2 }, { top: 53, left: 5 },
  { top: 63, left: 3 }, { top: 73, left: 6 }, { top: 83, left: 2 }, { top: 93, left: 5 },
  // right side (10)
  { top: 5, left: 91 }, { top: 15, left: 94 }, { top: 25, left: 92 },
  { top: 35, left: 93 }, { top: 45, left: 91 }, { top: 55, left: 94 },
  { top: 65, left: 92 }, { top: 75, left: 93 }, { top: 85, left: 91 }, { top: 95, left: 94 },
];

const FloatingIcons = () => {
  const items = useMemo(() => {
    return POSITIONS.map((pos, i) => ({
      id: i,
      Icon: ALL_ICONS[i % ALL_ICONS.length],
      top: pos.top + Math.random() * 3 - 1.5,
      left: pos.left + Math.random() * 3 - 1.5,
      size: 40 + Math.random() * 24,
      rotation: Math.random() * 24 - 12,
      opacity: 0.09 + Math.random() * 0.07,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {items.map(({ id, Icon, top, left, size, rotation, opacity }) => (
        <Icon
          key={id}
          className="absolute text-muted-foreground"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingIcons;
