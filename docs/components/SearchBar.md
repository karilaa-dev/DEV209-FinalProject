# SearchBar Component

The `SearchBar` component is responsible for rendering a search input field and handling search functionality. It allows users to enter a search term and trigger a search action.

## Props

-   `onSearch`: A function to be called when the search term changes (function, required).

## Functionality

-   Displays a search input field.
-   Calls the `onSearch` function when the search term changes, passing the search term as an argument.

## State Variables

-   `searchTerm`: The current search term (string).

## Example Usage

```jsx
<SearchBar onSearch={(term) => console.log("Search term:", term)} />
