// icons.jsx — thin, iOS-style SF-inspired line icons (never more complex than needed)

const Icon = ({ d, size = 22, stroke = 2, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {d}
  </svg>
);

const IconHome     = (p) => <Icon {...p} d={<><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></>} />;
const IconMap      = (p) => <Icon {...p} d={<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></>} />;
const IconCompass  = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 4-4 2 2-4 4-2z"/></>} />;
const IconUser     = (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></>} />;
const IconKey      = (p) => <Icon {...p} d={<><circle cx="8" cy="12" r="4"/><path d="M12 12h9M17 12v4M20 12v3"/></>} />;
const IconWifi     = (p) => <Icon {...p} d={<><path d="M2 9a16 16 0 0120 0"/><path d="M5 13a11 11 0 0114 0"/><path d="M8.5 16.5a6 6 0 017 0"/><circle cx="12" cy="20" r="1"/></>} />;
const IconBook     = (p) => <Icon {...p} d={<><path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z"/><path d="M4 19a2 2 0 012-2h12"/></>} />;
const IconStar     = (p) => <Icon {...p} d={<path d="M12 3l2.6 6 6.4.6-4.8 4.4 1.4 6.3L12 17l-5.6 3.3 1.4-6.3L3 9.6 9.4 9z"/>} />;
const IconPhone    = (p) => <Icon {...p} d={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>} />;
const IconMsg      = (p) => <Icon {...p} d={<path d="M4 5h16v11H8l-4 4V5z"/>} />;
const IconClock    = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />;
const IconCopy     = (p) => <Icon {...p} d={<><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></>} />;
const IconChevronR = (p) => <Icon {...p} d={<path d="M9 6l6 6-6 6"/>} />;
const IconChevronL = (p) => <Icon {...p} d={<path d="M15 6l-6 6 6 6"/>} />;
const IconChevronD = (p) => <Icon {...p} d={<path d="M6 9l6 6 6-6"/>} />;
const IconPlus     = (p) => <Icon {...p} d={<><path d="M12 5v14M5 12h14"/></>} />;
const IconCheck    = (p) => <Icon {...p} d={<path d="M5 12l5 5 9-11"/>} />;
const IconX        = (p) => <Icon {...p} d={<><path d="M6 6l12 12M18 6L6 18"/></>} />;
const IconHeart    = (p) => <Icon {...p} d={<path d="M12 20S3 14 3 8.5A5 5 0 0112 5a5 5 0 019 3.5C21 14 12 20 12 20z"/>} />;
const IconSparkle  = (p) => <Icon {...p} d={<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>} />;
const IconSun      = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>} />;
const IconRain     = (p) => <Icon {...p} d={<><path d="M8 18c-3 0-5-2-5-5s2-5 5-5c1-3 4-4 7-3s4 4 3 7"/><path d="M9 20l-1 2M14 20l-1 2M19 20l-1 2"/></>} />;
const IconBike     = (p) => <Icon {...p} d={<><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-7h6l-2 7M12 6h3"/></>} />;
const IconFork     = (p) => <Icon {...p} d={<><path d="M7 3v18M12 3v18M17 3v6a3 3 0 003 3v9"/><path d="M7 9h5"/></>} />;
const IconLeaf     = (p) => <Icon {...p} d={<><path d="M4 20c0-8 7-14 16-14-1 9-6 15-14 15-1 0-2-.4-2-1z"/><path d="M4 20l10-10"/></>} />;
const IconMoon     = (p) => <Icon {...p} d={<path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/>} />;
const IconCoffee   = (p) => <Icon {...p} d={<><path d="M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5V8zM17 10h2a2 2 0 012 2v1a2 2 0 01-2 2h-2M8 4v2M12 4v2"/></>} />;
const IconPaint    = (p) => <Icon {...p} d={<><circle cx="13" cy="6" r="2"/><circle cx="18" cy="11" r="2"/><circle cx="17" cy="17" r="2"/><path d="M3 12a9 9 0 009 9c1.7 0 2-2 1-3s-1-3 1-3h2"/></>} />;
const IconSettings = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.6-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>} />;

Object.assign(window, {
  Icon, IconHome, IconMap, IconCompass, IconUser, IconKey, IconWifi, IconBook,
  IconStar, IconPhone, IconMsg, IconClock, IconCopy, IconChevronR, IconChevronL, IconChevronD,
  IconPlus, IconCheck, IconX, IconHeart, IconSparkle, IconSun, IconRain, IconBike,
  IconFork, IconLeaf, IconMoon, IconCoffee, IconPaint, IconSettings,
});
