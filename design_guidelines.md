# Aceso Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from leading wellness and mental health applications including Headspace, Calm, Bearable, and Notion's calm aesthetic. The design prioritizes emotional safety, trust, and gentle user experience over clinical sterility.

## Core Design Principles
1. **Emotional Comfort First**: Every interaction should feel supportive, never judgmental
2. **Gentle Clarity**: Information is presented clearly but softly, avoiding harsh contrasts
3. **Progressive Trust**: Build confidence through transparency and consistent patterns
4. **Breathing Room**: Generous spacing creates psychological safety

## Typography
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern, humanist sans-serif
- **Heading Scale**: 
  - Hero/Page Titles: text-4xl to text-5xl, font-semibold
  - Section Headers: text-2xl to text-3xl, font-medium
  - Card Titles: text-lg to text-xl, font-medium
  - Body Text: text-base, font-normal, leading-relaxed for readability
  - Small Text/Metadata: text-sm, slightly reduced opacity for hierarchy

## Layout System
**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm (p-4, gap-6, mb-8, py-12, mt-16)
- **Container Width**: max-w-7xl for main layouts, max-w-2xl for focused content like journals
- **Grid Systems**: Single column on mobile, 2-column for desktop dashboard, 3-column for insights cards

## Component Library

### Navigation
- **Top Navigation Bar**: Sticky header with app logo, minimal links (Dashboard, Journal, Insights, Connect), and profile/settings
- Transparent or subtle background with soft shadow on scroll
- Icon + text labels for clarity

### Dashboard Layout
- **Welcome Card**: Personalized greeting with current mood indicator and quick journal entry button
- **Today's Snapshot**: Current emotional state with gentle visual indicators (not aggressive gauges)
- **Quick Actions**: Rounded pill buttons for "Record Feeling", "Talk to AI Assistant", "View Progress"
- **Recent Entries Timeline**: Chronological cards with mood indicators and entry previews

### Journal Entry Interface
- **Dual Input Modes**: Toggle between text editor and voice recording with clear visual states
- **Voice Recording**: Large, centered circular button that pulses gently when active, waveform visualization during recording
- **Text Editor**: Clean, distraction-free interface with subtle formatting tools
- **Post-Entry**: Immediate AI analysis card showing detected emotions with soft badges/chips

### Emotion Analysis Cards
- **Emotion Badges**: Soft, rounded pills with gentle background fills (not stark borders)
- **Mood Indicators**: Use abstract shapes or subtle icons, avoid clinical emoticons
- **Confidence Levels**: Display AI certainty subtly, avoiding alarm

### Progress Tracker & Graphs
- **Chart Style**: Smooth, organic curves using Chart.js or Recharts
- **Data Visualization**: Line graphs for mood trends, radial/donut charts for emotion distribution
- **Time Ranges**: Easy toggle between weekly/monthly/yearly views
- **Insights Cards**: Generated observations in plain language, not clinical jargon

### AI Voice Assistant Interface
- **Conversation View**: Chat-like interface with gentle message bubbles
- **Voice Interaction**: Large microphone button with subtle animation when listening
- **AI Persona**: Warm, supportive tone indicated through rounded avatar and gentle animations

### Coping Strategies Section
- **Strategy Cards**: Expandable cards with category icons (breathing, meditation, movement)
- **Action-Oriented**: Each strategy has clear steps with checkboxes or timers
- **Personalization Indicators**: Subtle badges showing "Suggested for you" based on patterns

### Therapist Connect Page
- **Resource Cards**: Professional help options with photos, credentials, specializations
- **Contact Form**: Simple, non-intimidating with clear privacy messaging
- **Crisis Resources**: Prominent, always-accessible emergency contacts with high-contrast treatment

### Privacy & Security Indicators
- **Trust Badges**: Encryption status and data handling policies visible but unobtrusive
- **Data Controls**: Clear toggles for what gets saved/analyzed
- **Transparency Notes**: Gentle reminders about how AI analysis works

## Interaction Patterns
- **Button States**: Soft shadows on hover, gentle scale on press (no harsh color shifts)
- **Loading States**: Smooth skeleton screens or subtle pulsing, never harsh spinners
- **Transitions**: 200-300ms easing for all state changes
- **Micro-animations**: Sparingly used - breathing effect on meditation timers, gentle pulse on active voice recording

## Images
**Hero Section**: Yes - Use calming nature imagery (soft focus forest, gentle waves, sunrise/sunset) with text overlay
- **Dashboard**: Abstract gradient backgrounds or soft nature textures, never stock photos of people
- **Strategy Cards**: Simple illustrated icons, not photography
- **Therapist Section**: Professional headshots with warm, approachable styling

## Accessibility Standards
- Maintain WCAG AA contrast ratios with gentle adjustments (e.g., 5:1 instead of harsh 7:1 where appropriate)
- Clear focus indicators with soft glows, not harsh outlines
- Screen reader support for all AI-generated insights
- Keyboard navigation throughout with logical tab order

## Mobile Optimization
- Single-column layouts with full-width cards
- Bottom navigation bar for primary actions
- Thumb-friendly touch targets (min 44px)
- Simplified graphs optimized for small screens