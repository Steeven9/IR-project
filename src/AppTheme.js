import { createMuiTheme } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
	spacing: 10,
	palette: {
		type: "dark",
		primary: {
			main: red[800],
		},
		secondary: {
			main: red[300],
		},
	},
});

export default theme;