import { FiCheckCircle, FiFileText, FiHome, FiKey, FiPieChart, FiSearch, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi'

export const SERVICES = [
  {
    title: 'Verified Shortlisting',
    description: 'We narrow down options depending on your requirements.',
    icon: FiSearch,
    points: ['Relevant property match', 'Quick shortlisting', 'Clear communication about pricing'],
  },
  {
    title: 'Site Visits',
    description: 'Our team sets up coordinated site visits for all properties.',
    icon: FiHome,
    points: ['Accompanied by agents', 'Neighbourhood tour included', 'Flexible timings for visits'],
  },
  {
    title: 'Negotiations',
    description: 'We do in-depth market price evaluation for strategic negotiation.',
    icon: FiPieChart,
    points: ['Clear cost breakdown', 'Complete support', 'Expert market assessment'],
  },
  {
    title: 'Third Party Property Listing',
    description: 'We help you list and promote your property through trusted third-party channels.',
    icon: FiTrendingUp,
    points: ['Wider visibility', 'Qualified buyer leads', 'Support with listing details'],
  },
  {
    title: 'Documentation Help',
    description: 'End to end support for all paperwork and legalities.',
    icon: FiFileText,
    points: ['Compliance with legal systems', 'Smooth process explanations', 'Defined timelines'],
  },
  {
    title: 'Safe & Transparent Process',
    description: 'Guidance with a structured process for faster closures.',
    icon: FiShield,
    points: ['Transparency on top', 'Timely process updates', 'Verified stakeholders involved'],
  },
  {
    title: 'Move-in / Handover',
    description: 'Move-in support to seal the deal smoothly.',
    icon: FiKey,
    points: ['Quick access transfers', 'Communication about societal conditions', 'Post-deal support'],
  },
]

export const STEPS = [
  {
    title: 'Communicate your preferences',
    description: 'Tell us about your budget, preferred location and any other requirements for the property.',
    icon: FiUsers,
  },
  {
    title: 'Shortlisting and sightseeing',
    description: 'We do a quick property match and schedule property tours.',
    icon: FiHome,
  },
  {
    title: 'Negotiations to close the deal',
    description: 'Our team confidently negotiates to get a fair price.',
    icon: FiCheckCircle,
  },
  {
    title: 'Document and moving in',
    description: 'We will handle all legalities while you prepare yourself for moving in.',
    icon: FiFileText,
  },
]
