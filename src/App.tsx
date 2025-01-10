import React, { useState } from 'react';
import { Star, Search, Users } from 'lucide-react';
import { members, Member } from './data/members';

/* Use a single ring map, each ring wraps its planets */

interface OrbitingLinkProps {
  member: Member;
  orbitRadius: number;
  animationDelay: string;
  color: string;
  onHover: (member: Member | null) => void;
  isVisible: boolean;
}

const OrbitingLink: React.FC<OrbitingLinkProps> = ({
  member,
  orbitRadius,
  animationDelay,
  color,
  onHover,
  isVisible
}) => (
  <a
    href={member.url}
    className={`
      planet
      ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      hover:scale-110 transition-transform duration-300
    `}
    style={{
      /* We position each planet at some angle and radius in the revolve. 
         Optionally, you can “counter-rotate” so it faces upright. */
      transform: `
        rotateZ(0deg) 
        translateX(${orbitRadius -24}px)
        rotateZ(0deg)
      `,
      '--orbit-delay': animationDelay,
      background: `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0.8))`,
      boxShadow: `0 0 20px ${color}66`
    } as React.CSSProperties}
    onMouseEnter={() => onHover(member)}
    onMouseLeave={() => onHover(null)}
  >
    <div className="planet-inner sphere-effect">
      <img
        src={member.photo}
        alt={member.name}
        className="w-full h-full object-cover"
      />
    </div>
  </a>
);

function App() {
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  
  /* Filter members by search. */
  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.url.toLowerCase().includes(query) ||
      member.year.toString().includes(query)
    );
  });

  const totalMembers = filteredMembers.length;
  const ringsConfig = [
    { radius: 120, capacity: Math.min(3, totalMembers) },
    { radius: 180, capacity: Math.min(4, Math.max(0, totalMembers - 3)) },
    { radius: 240, capacity: Math.min(5, Math.max(0, totalMembers - 7)) }
  ];

  /* Instead of flattening all rings into one array,
     map each ring plus its orbiting members directly in the JSX. */
  
  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center perspective-1000"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2048&q=80")'
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform sphere-effect">
          <Users className="w-6 h-6 text-yellow-200" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-8 right-8 z-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 ring-yellow-200/50 w-64"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
        </div>
      </div>

      {/* Main 3D container of size 600x600 (you can alter) */}
      <div
        className="relative w-[600px] h-[600px] flex items-center justify-center preserve-3d"
        style={{
          '--ring-0-pause': hoveredRing === 0 ? 'paused' : 'running',
          '--ring-1-pause': hoveredRing === 1 ? 'paused' : 'running',
          '--ring-2-pause': hoveredRing === 2 ? 'paused' : 'running'
        } as React.CSSProperties}
      >
        {/* 
          Map each ring with a "ring container" that:
            1) Starts at rotateX(75deg)
            2) Animates to rotateX(0deg)
            3) Contains an .orbit-revolver that spins the planets around Z
            4) Houses OrbitingLink planets
        */}
        {ringsConfig.map((config, ringIndex) => {
          // Which members go in this ring
          const startIndex =
            ringIndex === 0
              ? 0
              : ringsConfig
                  .slice(0, ringIndex)
                  .reduce((sum, r) => sum + r.capacity, 0);

          const ringMembers = filteredMembers.slice(
            startIndex,
            startIndex + config.capacity
          );

          return (
            <div
              key={ringIndex}
              className="orbit-ring absolute preserve-3d"
              style={{
                width: `${config.radius * 2}px`,
                height: `${config.radius * 2}px`,
                animationDelay: `${ringIndex * 0.2}s`,
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
                /* Pause the ring's tilt animation if hovered, or keep it spinning if you do that. 
                   Currently it's only tilting once from 75 -> 0, so no infinite spin. 
                 */
              }}
              onMouseEnter={() => setHoveredRing(ringIndex)}
              onMouseLeave={() => setHoveredRing(null)}
            >
              {/* 
                orbit-revolver: spins around its center in local Z 
                (the ring is initially tilted, so it looks elliptical from the camera's POV) 
              */}
              <div
                className="orbit-revolver w-full h-full relative preserve-3d"
                /* Usually you'd define the orbit animation in CSS:
                   @keyframes orbit { from {transform: rotateZ(0deg);} to {transform: rotateZ(360deg);} }
                */
                style={{
                  animation: `orbit 20s linear infinite`,
                  animationPlayState: `var(--ring-${ringIndex}-pause, running)`
                }}
              >
                {/* Map the ringMembers to planet links */}
                {ringMembers.map((member, i) => {
                  const color = `hsl(${
                    (360 / members.length) * members.indexOf(member)
                  }, 70%, 65%)`;
                  const delay = `${-(i * (20 / config.capacity))}s`;

                  return (
                    <OrbitingLink
                      key={member.name}
                      member={member}
                      orbitRadius={config.radius}
                      animationDelay={delay}
                      color={color}
                      isVisible={filteredMembers.includes(member)}
                      onHover={setHoveredMember}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Central Star */}
        <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform central-star sphere-effect preserve-3d">
          <div className="absolute w-full h-full rounded-full animate-pulse-glow" />
          <div className="absolute">
            <Star className="w-10 h-10 text-yellow-200 animate-pulse" />
          </div>
          <div className="text-center z-10">
            {hoveredMember ? (
              <>
                <div className="text-gray-900 font-bold text-lg">
                  {hoveredMember.name}
                </div>
                <div className="text-gray-800 text-sm">{hoveredMember.year}</div>
              </>
            ) : (
              <>
                <div className="text-gray-900 font-bold text-lg">MGTE</div>
                <div className="text-gray-800 text-sm">WEBRING</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
