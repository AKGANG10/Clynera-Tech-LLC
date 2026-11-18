import { useId, type ReactNode } from "react";
import type { CapabilityId } from "@/content/capabilities";

/**
 * One small environment per capability, drawn in the lattice language and
 * animated only to explain the capability (signals becoming decisions,
 * components snapping together, layers scaling). viewBox 400x400, sized to sit
 * inside the diamond window. Moving parts carry `motion-only` so reduced
 * motion shows the still composition.
 */
const INK = "#aeb6ce";
const TIDE = "#4a9ac0";
const SIG = "#3fe0cc";

function Pulse({ path, dur, delay = 0, r = 3.5 }: { path: string; dur: number; delay?: number; r?: number }) {
  return (
    <circle r={r} fill={SIG} className="motion-only">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

const Diamond = ({ x, y, s, fill = SIG, className }: { x: number; y: number; s: number; fill?: string; className?: string }) => (
  <rect x={x - s / 2} y={y - s / 2} width={s} height={s} fill={fill} transform={`rotate(45 ${x} ${y})`} className={className} />
);

function AI() {
  const inputs = [110, 150, 190, 230, 270, 310].map((y) => [100, y] as const);
  const hidden = [140, 200, 260].map((y) => [200, y] as const);
  const outputs = [170, 230].map((y) => [300, y] as const);
  return (
    <g fill="none" strokeLinecap="round">
      {inputs.flatMap(([x1, y1], i) => hidden.map(([x2, y2], j) => <path key={`a${i}${j}`} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={INK} strokeOpacity="0.18" />))}
      {hidden.flatMap(([x1, y1], i) => outputs.map(([x2, y2], j) => <path key={`b${i}${j}`} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={TIDE} strokeOpacity="0.5" />))}
      {inputs.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={INK} fillOpacity="0.7" />
      ))}
      {hidden.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill="#07112f" stroke={TIDE} strokeWidth="2" className="anim-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      {outputs.map(([x, y], i) => (
        <Diamond key={i} x={x} y={y} s={14} />
      ))}
      <Pulse path="M100 150L200 140L300 170" dur={2.4} />
      <Pulse path="M100 270L200 260L300 230" dur={2.8} delay={0.6} />
      <Pulse path="M100 190L200 200L300 230" dur={3.2} delay={1.2} />
    </g>
  );
}

function Software() {
  const blocks: [number, number, number, number, string, string][] = [
    [110, 150, 180, 22, "0px", "-30px"],
    [110, 186, 80, 90, "-30px", "0px"],
    [204, 186, 86, 40, "30px", "0px"],
    [204, 236, 86, 40, "30px", "20px"],
    [110, 290, 180, 14, "0px", "30px"],
  ];
  return (
    <g fill="none">
      <rect x="90" y="110" width="220" height="210" rx="6" stroke={INK} strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M90 134H310" stroke={INK} strokeOpacity="0.4" />
      {[104, 116, 128].map((x) => (
        <circle key={x} cx={x} cy="122" r="3" fill={INK} fillOpacity="0.6" />
      ))}
      {blocks.map(([x, y, w, h, sx, sy], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="3"
          fill={i === 2 ? SIG : TIDE}
          fillOpacity={i === 2 ? 0.9 : 0.35}
          className="anim-snap"
          style={{ ["--sx" as string]: sx, ["--sy" as string]: sy, animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </g>
  );
}

function Cloud() {
  const layer = (y: number) => `M200 ${y - 34}L290 ${y}L200 ${y + 34}L110 ${y}Z`;
  return (
    <g fill="none" strokeLinejoin="round">
      {[150, 205, 260].map((y, i) => (
        <g key={y} className="anim-float" style={{ animationDelay: `${i * 0.5}s` }}>
          <path d={layer(y)} fill={i === 0 ? "rgb(20 201 181 / 0.18)" : "rgb(74 154 192 / 0.12)"} stroke={i === 0 ? SIG : TIDE} strokeWidth="1.6" />
          {[-40, 0, 40].map((dx) => (
            <circle key={dx} cx={200 + dx} cy={y} r="3.5" fill={INK} />
          ))}
        </g>
      ))}
      {[-40, 0, 40].map((dx) => (
        <path key={dx} d={`M${200 + dx} 150V260`} stroke={INK} strokeOpacity="0.4" strokeDasharray="3 5" />
      ))}
      <Pulse path="M200 150V260" dur={2} />
      <Pulse path="M240 260V150" dur={2.6} delay={0.8} />
    </g>
  );
}

function Data() {
  const lanes = [120, 160, 200, 240, 280];
  return (
    <g fill="none" strokeLinecap="round">
      {lanes.map((y, i) => (
        <g key={y}>
          <path d={`M80 ${y}L170 ${y}L210 200`} stroke={INK} strokeOpacity="0.25" />
          <path d={`M80 ${y}L170 ${y}L210 200`} pathLength="1" stroke={SIG} strokeWidth="2" className="anim-flow" style={{ animationDelay: `${i * 0.5}s` }} />
        </g>
      ))}
      <Diamond x={210} y={200} s={16} />
      {[70, 110, 60, 140].map((h, i) => (
        <rect key={i} x={240 + i * 22} y={290 - h} width="14" height={h} fill={i === 3 ? SIG : TIDE} fillOpacity={i === 3 ? 0.9 : 0.45} />
      ))}
      <path d="M232 290H330" stroke={INK} strokeOpacity="0.5" />
    </g>
  );
}

function Security() {
  const clip = `sec${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ring = (r: number) => `M200 ${200 - r}L${200 + r} 200L200 ${200 + r}L${200 - r} 200Z`;
  return (
    <g fill="none">
      <path d={ring(120)} stroke={INK} strokeOpacity="0.2" />
      <path d={ring(90)} stroke={TIDE} strokeWidth="1.5" strokeDasharray="6 8" className="anim-spin" />
      <path d={ring(56)} stroke={SIG} strokeWidth="2" />
      <Diamond x={200} y={200} s={22} />
      <clipPath id={clip}>
        <path d={ring(90)} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <path d="M90 200H310" stroke={SIG} strokeOpacity="0.5" className="anim-scan motion-only" />
      </g>
      {[
        [70, 120],
        [330, 150],
        [300, 320],
        [90, 300],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#e85d4a" className="anim-fade-loop" style={{ animationDelay: `${i * 1.2}s` }} />
      ))}
    </g>
  );
}

function Automation() {
  const loop = "M200 110L290 200L200 290L110 200Z";
  const nodes: [number, number][] = [
    [200, 110],
    [290, 200],
    [200, 290],
    [110, 200],
  ];
  return (
    <g fill="none">
      <path d={loop} stroke={TIDE} strokeWidth="1.6" strokeOpacity="0.7" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="#07112f" stroke={INK} strokeOpacity="0.6" />
          <circle cx={x} cy={y} r="5" fill={SIG} className="anim-pulse" style={{ animationDelay: `${i * 0.75}s`, animationDuration: "3s" }} />
        </g>
      ))}
      <Pulse path={loop} dur={3} r={5} />
      <Diamond x={200} y={200} s={14} fill={INK} />
    </g>
  );
}

function Talent() {
  const people = [130, 180, 230, 280].map((y) => [110, y] as const);
  const skills = [115, 160, 205, 250, 295].map((y) => [290, y] as const);
  const links: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 3],
    [2, 2],
    [3, 4],
    [0, 3],
  ];
  return (
    <g fill="none" strokeLinecap="round">
      {links.map(([a, b], i) => {
        const [x1, y1] = people[a];
        const [x2, y2] = skills[b];
        const d = `M${x1 + 12} ${y1}L200 ${(y1 + y2) / 2}L${x2 - 10} ${y2}`;
        return (
          <g key={i}>
            <path d={d} stroke={INK} strokeOpacity="0.15" />
            <path d={d} pathLength="1" stroke={SIG} strokeWidth="1.8" className="anim-draw-loop" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        );
      })}
      {people.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y - 4} r="7" fill={INK} />
          <path d={`M${x - 11} ${y + 14}a11 9 0 0 1 22 0`} fill={INK} />
        </g>
      ))}
      {skills.map(([x, y], i) => (
        <Diamond key={i} x={x} y={y} s={13} fill={i % 2 ? TIDE : SIG} />
      ))}
    </g>
  );
}

function Consulting() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M90 250C120 140 150 300 180 180S240 120 230 250 300 140 320 210" stroke="#e85d4a" strokeOpacity="0.7" strokeWidth="1.8" className="anim-fade-loop" />
      <path d="M90 260L140 210L180 250L240 190L280 230L320 150" pathLength="1" stroke={SIG} strokeWidth="3" className="anim-draw-loop" />
      {[
        [90, 260],
        [180, 250],
        [280, 230],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={INK} />
      ))}
      <path d="M296 150H320V174" stroke={SIG} strokeWidth="3" />
    </g>
  );
}

function Experience() {
  return (
    <g fill="none">
      <rect x="80" y="130" width="190" height="130" rx="6" stroke={INK} strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="96" y="146" width="80" height="10" rx="2" fill={INK} fillOpacity="0.5" />
      <rect x="96" y="166" width="158" height="44" rx="3" fill={TIDE} fillOpacity="0.35" className="anim-snap" style={{ ["--sy" as string]: "-14px" }} />
      <rect x="96" y="220" width="74" height="24" rx="3" fill={SIG} fillOpacity="0.85" />
      <rect x="250" y="170" width="74" height="140" rx="10" fill="#07112f" stroke={INK} strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="260" y="186" width="54" height="30" rx="3" fill={TIDE} fillOpacity="0.35" className="anim-snap" style={{ ["--sy" as string]: "-14px", animationDelay: "0.4s" }} />
      <rect x="260" y="224" width="54" height="8" rx="2" fill={INK} fillOpacity="0.5" />
      <rect x="260" y="276" width="30" height="16" rx="3" fill={SIG} fillOpacity="0.85" />
      <circle r="5" fill="#fff" className="motion-only">
        <animateMotion dur="5s" repeatCount="indefinite" path="M150 300L130 232L282 284L210 190Z" />
      </circle>
    </g>
  );
}

export const scenes: Record<CapabilityId, () => ReactNode> = {
  ai: AI,
  software: Software,
  cloud: Cloud,
  data: Data,
  security: Security,
  automation: Automation,
  talent: Talent,
  consulting: Consulting,
  experience: Experience,
};

export function CapabilityScene({ id }: { id: CapabilityId }) {
  const Scene = scenes[id];
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className="scene-enter absolute inset-0 size-full">
      <Scene />
    </svg>
  );
}
