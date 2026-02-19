import './Tabs.css'

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <nav className="tabs">
      <button
        className={`tab ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => onTabChange('explore')}
      >
        Explore Tokens
      </button>
      <button
        className={`tab ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => onTabChange('create')}
      >
        Create Token
      </button>
      <button
        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        My Profile
      </button>
    </nav>
  )
}
