# Smart Input Box - Project Specifications

## Project Overview

A Nuxt.js/Vue.js project featuring an AI-powered smart input box that provides automatic text summarization using a DigitalOcean GenAI Chat Agent. The input box monitors a connected textarea and provides intelligent summary suggestions based on user input.

## Core Features

### Smart Input Box Component
- **Purpose**: Auto-suggest summaries for longer text descriptions
- **Technology**: Vue 3 + Nuxt 3 + Nuxt UI
- **API Integration**: DigitalOcean GenAI Chat Agent (OpenAI-compatible interface)

### Key Functionality
1. **Text Monitoring**: Monitors connected textarea for content changes
2. **Auto-trigger**: Triggers API call when focus is lost from textarea (minimum 20 characters)
3. **Summary Suggestions**: Displays AI-generated summaries as interactive chips
4. **User Interaction**: Allows users to accept suggestions with a commit action

## Technical Specifications

### API Integration

#### Endpoint Configuration
```bash
AGENT_ENDPOINT = https://rm3atnymbbmeazfftkvdcxxu.agents.do-ai.run/
AGENT_ACCESS_KEY = __a_token__
```

#### API Request Structure
```javascript
{
  method: 'POST',
  url: `${AGENT_ENDPOINT}/api/v1/chat/completions`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AGENT_ACCESS_KEY}`
  },
  data: {
    messages: [
      {
        role: 'user',
        content: '[USER_INPUT_TEXT]'
      }
    ],
    stream: false,
    include_functions_info: false,
    include_retrieval_info: false,
    include_guardrails_info: false
  }
}
```

#### API Response Handling
- **Response Path**: `response.data.choices[0].message.content`
- **Content Type**: JSON string (requires parsing)
- **Expected JSON Structure**:
```json
{
  "summary": "Main summary text",
  "alt_summary1": "Alternative summary 1",
  "alt_summary2": "Alternative summary 2", 
  "lang": "detected language",
  "corrected_text": "Grammar/spell-checked text"
}
```
- **Primary Data**: Use `summary` field for suggestion chip

### Component Architecture

#### Smart Input Box Component
- **Framework**: Vue 3 Composition API
- **UI Library**: Nuxt UI
- **State Management**: Component-level reactive state
- **Independence**: Can work standalone or connected to textarea

#### Key Props
```typescript
interface SmartInputProps {
  connectedTextarea?: string; // ID/ref of connected textarea
  placeholder?: string;
  modelValue?: string;
  disabled?: boolean;
  // API configuration passed as props or global config
}
```

#### Component Features
1. **Dual Mode Operation**:
   - Connected: Monitors textarea for changes
   - Standalone: Regular input behavior

2. **Trigger Conditions**:
   - Minimum 20 characters in textarea
   - Focus lost from textarea
   - Debounced to prevent excessive API calls

3. **State Management**:
   - Loading states
   - Error handling with exponential backoff
   - Suggestion display/interaction

### UI/UX Design

#### Visual Design System
- **Base**: Nuxt UI components and styling
- **Theme**: Primary colors with gradient backgrounds
- **Style**: Modern, clean, "nudged" aesthetic

#### Loading States
- **Chip Appearance**: Below input box during API call
- **Loading Indicator**: Spinning AI icon
- **Transition**: Smooth animations for all state changes

#### Suggestion Display
- **Format**: Toned-down chip based on primary theme colors
- **Icon**: AI icon remains visible when suggestion is ready
- **Interaction**: Commit-style icon at the end for acceptance
- **Hover Effects**: Visual feedback on interactive elements

#### User Interactions
- **Accept Suggestion**: Click commit icon to replace input content
- **Future Enhancement**: Ctrl+Right Arrow keyboard shortcut
- **Behavior**: Complete replacement of existing input content

### Error Handling

#### API Error Management
- **Retry Logic**: Exponential backoff with 30-second maximum
- **User Experience**: Silent failure (suggestion chip disappears)
- **Development**: Console logging in debug mode
- **State Reset**: New input resets/replaces ongoing API calls

#### Input Validation
- **Minimum Length**: 20 characters before API trigger
- **Multiple Instances**: Each smart input operates independently
- **Concurrent Operations**: Support multiple smart inputs on same page

### Event System

#### Component Events
```typescript
// Emitted events for parent component integration
interface SmartInputEvents {
  'update:modelValue': string;
  'suggestion-received': SummaryResponse;
  'suggestion-applied': string;
  'api-call-started': void;
  'api-call-failed': Error;
  'api-call-completed': void;
}
```

#### Logging Levels
- **Console Logging**: Configurable logging for development
- **Event Tracking**: Emit events for analytics/monitoring
- **Best Practices**: Follow Vue.js component event patterns

### Demo Page Structure

#### Layout Design
- **Background**: Beautiful gradient backdrop
- **Component Order**: 
  1. Smart input box (top)
  2. Spacing area for suggestions
  3. Connected textarea (below)
- **Content Sections**:
  - Introduction text explaining functionality
  - Marketing/explanation area below demo

#### Demo Features
- **Interactive Example**: Working smart input + textarea
- **Visual Appeal**: Showcase component capabilities
- **Documentation**: Clear usage instructions

## Development Guidelines

### Project Setup
- **Framework**: Nuxt 3 with TypeScript
- **UI Framework**: Nuxt UI (with Pro account available)
- **HTTP Client**: Axios for API calls
- **State Management**: Vue 3 Composition API

### Component Development
- **Best Practices**: Follow Vue.js library component standards
- **Reusability**: Component should be reusable across applications
- **Independence**: Minimal external dependencies
- **Configuration**: Global configuration for API credentials

### Code Organization
```
components/
├── SmartInput/
│   ├── SmartInput.vue
│   ├── SuggestionChip.vue
│   └── types.ts
composables/
├── useSmartInput.ts
└── useGenAIAgent.ts
pages/
└── demo.vue
```

### Configuration Management
- **Environment Variables**: Store API credentials
- **Global Config**: Nuxt plugin/composable for API settings
- **Props System**: Allow component-level configuration override

## MVP Requirements

### Core MVP Features
1. ✅ Smart input box component
2. ✅ Textarea monitoring with 20-character minimum
3. ✅ DigitalOcean GenAI API integration
4. ✅ Suggestion chip with loading states
5. ✅ Commit functionality to accept suggestions
6. ✅ Error handling with exponential backoff
7. ✅ Demo page with beautiful design
8. ✅ Event emission system
9. ✅ Multiple instance support

### Post-MVP Enhancements
- Keyboard shortcuts (Ctrl+Right Arrow)
- Alternative summary options (alt_summary1, alt_summary2)
- Corrected text suggestions
- State persistence across navigation
- Advanced configuration options
- Analytics integration

## Success Criteria

### Functional Requirements
- Component works reliably with DigitalOcean GenAI Agent
- Smooth user experience with proper loading states
- Error handling doesn't disrupt user workflow
- Multiple instances can operate simultaneously

### Technical Requirements
- Clean, reusable component architecture
- Follows Vue.js/Nuxt best practices
- Proper TypeScript typing
- Comprehensive event system

### Design Requirements
- Visually appealing with Nuxt UI styling
- Smooth animations and transitions
- Responsive design
- Accessible user interactions

## Future Considerations

### Scalability
- Support for different AI providers
- Configurable summary types
- Advanced retry strategies
- Performance optimization for multiple instances

### User Experience
- Keyboard navigation
- Accessibility improvements
- Mobile responsiveness
- Customizable themes

### Integration
- Plugin system for different frameworks
- NPM package distribution
- Documentation and examples
- API versioning support