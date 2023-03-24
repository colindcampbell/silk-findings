# Silk Findings

## Running Locally

Install packages and start server:

```js
npm i && npm run preview
```

Once started, go to http://localhost:4173/

## Tools Used

### Backend

- Local database using the browser IndexedDB: [Dexie](https://dexie.org/)
- Request redirect service: [MSW](https://mswjs.io/)

### Frontend

- HTTP client: [Axios](https://axios-http.com/)
- Caching and data fetching layer: [React Query](https://tanstack.com/query/v4)
- UI components: [Material UI](https://mui.com/material-ui/getting-started/overview/)
- Bundler and local server: [Vite](https://vitejs.dev/)
- State management: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- Charts: [react-chartjs-2](https://react-chartjs-2.js.org/)
- Functional programming utilities: [Ramda](https://ramdajs.com/)

## Notable Features

- Clicking on the graph severity data also toggles that severity in the table filters. This is reflected by graying out the chart data that is filtered out in the table. This interaction also works the other way around
- The # of Findings cells are clickable and toggle visibility of the row details
- Sorting on the Severity, Time, and SLA fields
- Configurable table pagination
- Query caching for near instant rendering of the table detail panel
- Sorted Raw Findings table in addition to the Grouped Findings table
- Text filtering on the table

## TODO: Possible Fixes and Improvements

- Changing the table filters should also reset the pagination (use Zustand for pagination state)
- Add the graphs and filter bar to the Raw Findings table
- Fix the the page layout so that the width of the app container doesn't have to be passed down
- Tree map visualization for severity where you can drill down on progress for each severity type
- Make dates more readable
- Make columns configurable with resizing, rearranging, and visibility toggling
- Persist table settings to local storage.
