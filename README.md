# Personal site

[![Netlify Status](https://api.netlify.com/api/v1/badges/e7dcc33b-8c8b-46e0-bd0f-8b85daa859cc/deploy-status)](https://app.netlify.com/sites/chrastina/deploys)


## Installation

Install required modules by `npm install` command.

Run `gatsby develop` in the terminal to start the dev site.

## CSS Grid

The grid on this site was replaced with a custom version, built using CSS Grid. It's a very simple 12 column grid that is disabled on mobile. To start using the grid, wrap the desired items with `grid-wrapper`. Items inside the `grid-wrapper` use the class `col-` followed by a number, which should add up to 12.

Here is an example of using the grid, for a 3 column layout:

```jsx
<div className="grid-wrapper">
    <div className="col-4">
        <p>Content Here</p>
    </div>
    <div className="col-4">
        <p>Content Here</p>
    </div>
    <div className="col-4">
        <p>Content Here</p>
    </div>
</div>
```
