# Spatial Tyson - RecipeMatcher

A modern, responsive React application designed to help users discover new meal ideas based on their preferences. Built with performance, aesthetics, and user experience in mind.

## 🚀 Key Features

- **Smart Recipe Discovery**: Finding the perfect meal is easy with our two-step wizard.
  1.  **Select Region**: Filter recipes by cuisine area (e.g., Italian, Japanese, Mexican).
  2.  **Refine Search**: Narrow down results by choosing a specific Category (e.g., Seafood) or Main Ingredient (e.g., Chicken).
- **Intersection Logic**: The app intelligently finds recipes that match _both_ your chosen area and your secondary criteria, ensuring precise recommendations.
- **Instant Recommendations**: Get a random recipe recommendation that fits your criteria instantly.
- **Interactive Feedback**:
  - **Like/Dislike**: Rate recommendations to save them to your history.
  - **New Idea**: Request a different recipe with the same criteria if the first one doesn't spark joy.
- **Local History**: Your liked recipes and search history are persisted locally, so you never lose track of a great find.
- **Premium UI/UX**:
  - **Glassmorphism Design**: extensive use of translucent backgrounds and blurs for a modern look.
  - **Responsive Layout**: Optimized for both desktop and mobile devices.
  - **Micro-animations**: Subtle interactions to enhance engagement.

## 🛠 Tech Stack & Peculiarities

This project is built using a modern frontend stack with a focus on type safety and state management.

- **React 19**: Leveraging the latest React features for efficient rendering.
- **TypeScript**: Fully typed codebase for robustness and developer experience.
- **Redux Toolkit (RTK) & RTK Query**:
  - **State Management**: Centralized store for form state and user preferences using slices.
  - **Data Fetching**: All API interactions with TheMealDB are handled via RTK Query. This includes a custom `useLazyLookupRecipeQuery` implementation to fetch detailed recipe info on demand, replacing standard `fetch` calls for better caching and request lifecycle management.
- **Styled Components**: CSS-in-JS solution for scoped styling, theming, and dynamic styles based on props.
- **Vite**: Next-generation frontend tooling for lightning-fast HMR and building.
- **Testing**: Comprehensive test suite using **Vitest** and **React Testing Library**, ensuring component reliability and interaction correctness.

## 📦 Getting Started

1.  **Install dependencies**:

    ```bash
    yarn install
    ```

2.  **Run development server**:

    ```bash
    yarn dev
    ```

3.  **Run tests**:
    ```bash
    yarn test
    ```
