This project is written in HTML + CSS + Js. Also using socket.io to maintain consistent connection between players.

## Available Scripts

In the project directory, you can run:

### `npm run devStart`

This runs the server on a port(3000). Internally using nodemon.<br />
Open index.html path in the browser to run in development mode.

### `Functionality Implemented`

Initially generate a random 2 digit Whole Number (0 is also a Whole number).<br />
Player has option to select { -1, 0, 1 } button to perform operation on the random Whole Number.<br />
If the selection of operation type made by player does not leads to whole number as result, then the correct operation type to choose is suggested using 'focus' on the button.<br />
If the value reaches ONE then 'You WON' text is displayed.
