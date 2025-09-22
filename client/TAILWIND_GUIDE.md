# Tailwind CSS Configuration Guide for Chat App

Your Tailwind CSS has been optimized for your chat application. Here's how to use the new configuration:

## Custom Colors

### Primary Colors (Your main theme)
```jsx
// Use your main brand color
<div className="bg-primary-500">Primary background</div>
<div className="text-primary-400">Primary text</div>
<div className="border-primary-600">Primary border</div>
```

### Chat-specific Colors
```jsx
// Chat backgrounds and surfaces
<div className="bg-chat-bg">Chat background (#282142)</div>
<div className="bg-chat-surface">Darker surface</div>
<div className="border-chat-border">Border color</div>

// Text colors
<div className="text-chat-text-primary">Primary text (white)</div>
<div className="text-chat-text-secondary">Secondary text</div>
<div className="text-chat-text-muted">Muted text</div>
```

## Pre-built Component Classes

### Chat Containers
```jsx
// Main chat container
<div className="chat-container">
  Content here
</div>

// Sidebar
<div className="chat-sidebar">
  Sidebar content
</div>

// Chat surface/card
<div className="chat-surface">
  Card content
</div>
```

### Messages
```jsx
// Sent message (right side)
<div className="message-sent">
  Your message
</div>

// Received message (left side)
<div className="message-received">
  Received message
</div>
```

### User Items
```jsx
// User list item
<div className="user-item">
  User info
</div>

// Active user item
<div className="user-item user-item-active">
  Active user
</div>
```

### Form Elements
```jsx
// Chat input
<input className="chat-input" placeholder="Type a message..." />

// Buttons
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
```

### Status Indicators
```jsx
// Online indicator
<div className="relative">
  <img src="avatar.jpg" className="w-12 h-12 rounded-full" />
  <div className="online-indicator"></div>
</div>
```

## Utility Classes

### Scrollbars
```jsx
// Custom styled scrollbar
<div className="custom-scrollbar overflow-y-auto">
  Scrollable content
</div>

// Hidden scrollbar
<div className="hide-scrollbar overflow-y-auto">
  Scrollable content without visible scrollbar
</div>
```

### Glass Effect
```jsx
<div className="glass">
  Glass morphism effect
</div>
```

### Gradient Text
```jsx
<h1 className="gradient-text">
  Beautiful gradient text
</h1>
```

## Custom Font Family
```jsx
// Use Outfit font (already applied globally)
<div className="font-outfit">Outfit font</div>

// Or use specific weights
<div className="font-outfit-light">Light weight</div>
<div className="font-outfit-bold">Bold weight</div>
```

## Animations
```jsx
// Fade in animation
<div className="animate-fade-in">Fades in</div>

// Slide up animation
<div className="animate-slide-up">Slides up</div>

// Slow pulse
<div className="animate-pulse-slow">Slow pulse</div>
```

## Example Usage in Your Components

### Updated Sidebar User Item
```jsx
<div className="user-item user-item-active">
  <div className="relative">
    <img
      src={user.profilePic}
      className="w-12 h-12 rounded-full object-cover"
    />
    {user.isOnline && <div className="online-indicator"></div>}
  </div>
  <div className="flex-1 min-w-0">
    <p className="font-medium text-chat-text-primary truncate">
      {user.fullName}
    </p>
    <p className="text-sm text-chat-text-muted">
      {user.isOnline ? 'Online' : 'Offline'}
    </p>
  </div>
</div>
```

### Updated Search Input
```jsx
<input
  type="text"
  className="chat-input w-full"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### Updated Message Container
```jsx
<div className="space-y-4 custom-scrollbar overflow-y-auto p-4">
  {messages.map((message) => (
    <div
      key={message.id}
      className={message.isSent ? "message-sent" : "message-received"}
    >
      {message.content}
    </div>
  ))}
</div>
```

## Custom Spacing
- `spacing-18`: 4.5rem (72px)
- `spacing-88`: 22rem (352px) 
- `spacing-104`: 26rem (416px)

## Custom Shadows
- `shadow-chat`: Subtle chat shadow
- `shadow-message`: Message shadow
- `shadow-glow`: Glowing effect with your primary color

## Benefits of This Configuration

1. **Consistent Design**: All colors and components follow your chat app theme
2. **Reusable Components**: Pre-built classes for common chat elements
3. **Better Performance**: Optimized Tailwind build with only used classes
4. **Easy Maintenance**: Change colors in one place to update entire app
5. **Responsive Design**: All classes work with Tailwind's responsive prefixes

## Development Tips

1. Use the pre-built component classes for faster development
2. Combine utility classes for custom styling when needed
3. The configuration is optimized for dark theme chat interfaces
4. All animations and transitions follow modern UI patterns

Your Tailwind CSS is now perfectly configured for your chat application!