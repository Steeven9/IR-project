import { createMuiTheme } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";

const theme = createMuiTheme({
	spacing: 10,
	palette: {
		type: "dark",
		primary: {
			main: cyan[600],
		},
		secondary: {
			main: cyan[900],
		},
	},
});

export default theme;