import React, { useState } from 'react';
import { Star, Search, Users } from 'lucide-react';
import { members, Member } from './data/members';

interface OrbitingLinkProps {
  member: Member;
  orbitRadius: number;
  animationDelay: string;
  color: string;
  ringIndex: number;
  onHover: (member: Member | null) => void;
  isVisible: boolean;
}

const OrbitingLink: React.FC<OrbitingLinkProps> = ({ 
  member, 
  orbitRadius, 
  animationDelay, 
  color,
  ringIndex,
  onHover,
  isVisible 
}) => (
  <a
    href={member.url}
    className={`absolute rounded-full w-16 h-16 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 animate-orbit hover:scale-110 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    style={{
      '--orbit-radius': `${orbitRadius}px`,
      '--ring-index': ringIndex,
      '--orbit-delay': animationDelay,
      background: color,
      padding: '2px',
      boxShadow: `0 0 20px ${color}66`,
      animationPlayState: `var(--ring-${ringIndex}-pause, running)`
    } as React.CSSProperties}
    onMouseEnter={() => onHover(member)}
    onMouseLeave={() => onHover(null)}
  >
    <img 
      src={member.photo} 
      alt={member.name}
      className="w-full h-full rounded-full object-cover"
    />
  </a>
);

function App() {
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  
  const filteredMembers = members.filter(member => {
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

  const rings = ringsConfig.map((config, ringIndex) => {
    const startIndex = ringIndex === 0 ? 0 : 
      ringsConfig.slice(0, ringIndex).reduce((sum, r) => sum + r.capacity, 0);
    
    return filteredMembers.slice(startIndex, startIndex + config.capacity).map((member, i) => ({
      member,
      radius: config.radius,
      delay: `${-(i * (20 / config.capacity))}s`,
      color: `hsl(${(360 / members.length) * members.indexOf(member)}, 70%, 65%)`,
      ringIndex
    }));
  }).flat();

  return (
    <div 
      className="min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center perspective-1000"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2048&q=80")',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform">
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
      
      <div 
        className="relative w-[600px] h-[600px] flex items-center justify-center"
        style={{
          '--ring-0-pause': hoveredRing === 0 ? 'paused' : 'running',
          '--ring-1-pause': hoveredRing === 1 ? 'paused' : 'running',
          '--ring-2-pause': hoveredRing === 2 ? 'paused' : 'running',
        } as React.CSSProperties}
      >
        {ringsConfig.map((config, i) => (
          <div 
            key={i}
            className="absolute rounded-full border border-white/20 orbit-ring"
            style={{ 
              width: `${config.radius * 2}px`, 
              height: `${config.radius * 2}px`,
              animationDelay: `${i * 0.2}s`
            }}
            onMouseEnter={() => setHoveredRing(i)}
            onMouseLeave={() => setHoveredRing(null)}
          />
        ))}
        
        <div className="relative z-10 w-32 h-32 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform central-star">
          <div className="absolute w-full h-full rounded-full animate-pulse-glow" />
          <div className="absolute">
            <Star className="w-10 h-10 text-yellow-200 animate-pulse" />
          </div>
          <div className="text-center z-10">
            {hoveredMember ? (
              <>
                <div className="text-gray-900 font-bold text-lg">{hoveredMember.name}</div>
                <div className="text-gray-800 text-sm">{hoveredMember.year}</div>
              </>
            ) : (
              <>
                <div className="text-gray-900 font-bold text-lg">MGTE</div>
                <div className="text-gray-800 text-sm">webring</div>
              </>
            )}
          </div>
        </div>

        {rings.map((ring, index) => (
          <OrbitingLink
            key={index}
            member={ring.member}
            orbitRadius={ring.radius}
            animationDelay={ring.delay}
            color={ring.color}
            ringIndex={ring.ringIndex}
            onHover={setHoveredMember}
            isVisible={filteredMembers.includes(ring.member)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;