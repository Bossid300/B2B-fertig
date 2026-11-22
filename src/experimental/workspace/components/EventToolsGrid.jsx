import React from 'react';

export default function EventToolsGrid({ event }) {
  if (!event) {
    return null;
  }

  const tools = [
    {
      id: 'crew',
      label: 'Crew',
      description: 'Crew verwalten',
      icon: '👥'
    },
    {
      id: 'chat',
      label: 'Chat',
      description: 'Eventkommunikation',
      icon: '💬'
    },
    {
      id: 'deals',
      label: 'Deals',
      description: 'Angebote / Verträge',
      icon: '📋'
    },
    {
      id: 'promotion',
      label: 'Promotion',
      description: 'Marketing',
      icon: '📢'
    },
    {
      id: 'budget',
      label: 'Budget',
      description: 'Einnahmen / Ausgaben',
      icon: '💰'
    },
    {
      id: 'documents',
      label: 'Dokumente',
      description: 'Dateien',
      icon: '📄'
    }
  ];

  const handleToolClick = (toolId) => {
    console.log(`${toolId.charAt(0).toUpperCase() + toolId.slice(1)} geöffnet`);
  };

  return (
    <div className="event-tools-grid">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className="event-tool-card"
          onClick={() => handleToolClick(tool.id)}
          title={tool.description}
        >
          <div className="event-tool-icon">{tool.icon}</div>
          <div className="event-tool-label">{tool.label}</div>
          <div className="event-tool-description">{tool.description}</div>
        </button>
      ))}
    </div>
  );
}
