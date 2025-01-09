export interface Member {
  name: string;
  year: number;
  photo: string;
  url: string;
}

export const members: Member[] = [
  {
    name: "Sarah Johnson",
    year: 2020,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
    url: "https://example.com/sarah"
  },
  {
    name: "David Chen",
    year: 2019,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    url: "https://example.com/david"
  },
  {
    name: "Emma Wilson",
    year: 2021,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    url: "https://example.com/emma"
  },
  {
    name: "Michael Brown",
    year: 2018,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    url: "https://example.com/michael"
  },
  {
    name: "Lisa Anderson",
    year: 2022,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces",
    url: "https://example.com/lisa"
  }
];