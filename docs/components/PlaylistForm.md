# PlaylistForm Component

The `PlaylistForm` component is responsible for rendering a form for creating or editing playlists. It allows users to enter the playlist name and description.

## Props

-   `onSubmit`: A function to be called when the form is submitted (function, required).
-   `initialValues`: An object containing the initial values for the form fields (object, optional).

## Functionality

-   Displays input fields for the playlist name and description.
-   Provides a submit button to submit the form.
-   Calls the `onSubmit` function when the form is submitted, passing the form values as an argument.

## State Variables

-   `name`: The current value of the playlist name input field (string).
-   `description`: The current value of the playlist description input field (string).

## Example Usage

```jsx
<PlaylistForm
    onSubmit={(values) => console.log("Form values:", values)}
    initialValues={{ name: "My Playlist", description: "A great playlist" }}
/>
